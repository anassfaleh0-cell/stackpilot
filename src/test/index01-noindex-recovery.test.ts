import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { H02_INDEX01_RECOVERY, H02_INDEX02A_RECOVERY } from "@/lib/content/h02-contract"
import { isNoindexed } from "@/lib/noindex"
import sitemap from "@/app/sitemap"
import { getContentTitle, getReview, getBest, getGuide, getStatistic } from "@/lib/content/registry"
import { isPublicAuthor } from "@/lib/authors"
import * as ReviewsPage from "@/app/reviews/[slug]/page"
import * as BestPage from "@/app/best/[slug]/page"
import * as GuidesPage from "@/app/guides/[slug]/page"
import * as StatisticsPage from "@/app/statistics/[slug]/page"
import * as AuthorsPage from "@/app/authors/[slug]/page"
import { metadata as searchMetadata } from "@/app/search/page"
import { metadata as dashboardMetadata } from "@/app/dashboard/page"

// Phase INDEX-01 recovery contract.
// Proves that exactly the approved 52 B-class pages moved noindex -> keep and that
// every protected surface (C, D, E, unpublished, utility routes, canonical, robots,
// sitemap quality rules, content) is untouched.

const ROOT = process.cwd()
const SITE = "https://www.pilotstack.online"
const RECOVERY = H02_INDEX01_RECOVERY

interface DirLists {
  [dir: string]: { keep: string[]; noindex: string[] }
}
interface AllFile {
  dir: string
  slug: string
  words: number
  isDuplicate: boolean
  keep: boolean
}

type PageMeta = {
  robots?: { index?: boolean; follow?: boolean }
  alternates?: { canonical?: string }
  xRobotsTag?: unknown
}
type MetaFn = (ctx: { params: Promise<{ slug: string }> }) => Promise<unknown>

const ROUTES: Record<string, { generateMetadata: MetaFn }> = {
  reviews: ReviewsPage,
  best: BestPage,
  guides: GuidesPage,
  statistics: StatisticsPage,
}

const RESOLVERS: Record<string, (slug: string) => unknown> = {
  reviews: getReview,
  best: getBest,
  guides: getGuide,
  statistics: getStatistic,
}

const CONTENT_TYPE: Record<string, string> = {
  reviews: "review",
  best: "best",
  guides: "guide",
  statistics: "statistic",
}

const APPROVED = Object.entries(RECOVERY.slugs).flatMap(([dir, slugs]) =>
  slugs.map((slug) => ({ dir, slug, url: `/${dir}/${slug}` })),
)

function readList(): DirLists {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "noindex-list.json"), "utf8")).directories
}

function publishedOf(dir: string, slug: string): boolean | undefined {
  const file = path.join(ROOT, "content", dir, `${slug}.json`)
  if (!fs.existsSync(file)) return undefined
  return JSON.parse(fs.readFileSync(file, "utf8")).published
}

function approvedOf(dir: string): string[] {
  return [...(RECOVERY.slugs[dir] || [])].sort()
}

function diff(a: string[], b: string[]): string[] {
  const excluded = new Set(b)
  return a.filter((s) => !excluded.has(s))
}

describe("INDEX-01 approved recovery set", () => {
  it("1 and 2. the approved 52 are all keep, with only the approved INDEX-02A wave-1 growth on top", () => {
    const dirs = readList()
    expect(APPROVED).toHaveLength(52)
    expect(new Set(APPROVED.map((e) => e.url)).size).toBe(52)

    for (const { dir, slug } of APPROVED) {
      expect(dirs[dir], `${dir} missing from noindex-list.json`).toBeDefined()
      expect(dirs[dir].keep, `${dir}/${slug} must be keep`).toContain(slug)
      expect(dirs[dir].noindex, `${dir}/${slug} must have left noindex`).not.toContain(slug)
      expect(isNoindexed(dir, slug), `${dir}/${slug} still served noindex`).toBe(false)
    }

    for (const [dir, counts] of Object.entries(RECOVERY.unchangedDirectories)) {
      const wave1 = H02_INDEX02A_RECOVERY.slugs[dir]
      if (wave1) {
        expect(dirs[dir].keep, `${dir} keep must carry the approved wave-1 growth`).toHaveLength(
          counts.keep + wave1.length,
        )
        expect(dirs[dir].noindex, `${dir} noindex must carry the approved wave-1 shrink`).toHaveLength(
          counts.noindex - wave1.length,
        )
      } else {
        expect(dirs[dir].keep, `${dir} keep changed`).toHaveLength(counts.keep)
        expect(dirs[dir].noindex, `${dir} noindex changed`).toHaveLength(counts.noindex)
      }
    }
    for (const [dir, slugs] of Object.entries(RECOVERY.slugs)) {
      expect(dirs[dir].keep).toHaveLength(RECOVERY.after.keep[dir])
      expect(dirs[dir].noindex).toHaveLength(RECOVERY.after.noindex[dir])
      expect(slugs.length).toBe(RECOVERY.after.keep[dir] - RECOVERY.baseline.keep[dir])
    }
  })

  it("3. no unpublished record is declared keep", () => {
    const dirs = readList()
    const collisions: string[] = []
    for (const [dir, list] of Object.entries(dirs)) {
      for (const slug of list.keep) {
        if (publishedOf(dir, slug) === false) collisions.push(`${dir}/${slug}`)
      }
    }
    expect(collisions).toEqual([])
  })

  it("14. every recovered URL resolves to a live published route", () => {
    for (const { dir, slug, url } of APPROVED) {
      expect(RESOLVERS[dir](slug), `${url} has no content record`).not.toBeNull()
      expect(getContentTitle(CONTENT_TYPE[dir], slug), `${url} does not resolve`).not.toBeNull()
      expect(
        fs.existsSync(path.join(ROOT, "src", "app", dir, "[slug]", "page.tsx")),
        `${dir} route missing`,
      ).toBe(true)
    }
  })

  it(
    "10, 11 and 13. every recovered URL renders index, follow, self-canonical and without xRobotsTag",
    async () => {
      for (const { dir, slug, url } of APPROVED) {
        const meta = (await ROUTES[dir].generateMetadata({
          params: Promise.resolve({ slug }),
        })) as PageMeta
        expect(meta.robots?.index, `${url} index`).toBe(true)
        expect(meta.robots?.follow, `${url} follow`).toBe(true)
        expect(meta.alternates?.canonical, `${url} canonical`).toBe(`${SITE}${url}`)
        expect(meta.xRobotsTag, `${url} xRobotsTag`).toBeUndefined()
      }
    },
    60000,
  )

  it("13. no application source file sets an X-Robots-Tag", () => {
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (entry.name !== "test") walk(full)
        } else if (/\.(ts|tsx)$/.test(entry.name)) {
          const src = fs.readFileSync(full, "utf8")
          if (/xRobotsTag|X-Robots-Tag/i.test(src)) offenders.push(path.relative(ROOT, full))
        }
      }
    }
    walk(path.join(ROOT, "src"))
    expect(offenders).toEqual([])
  })

  it("12. the sitemap carries all 52 and no noindexed URL", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    expect(new Set(paths).size).toBe(576)
    for (const { url } of APPROVED) expect(paths, `${url} missing from sitemap`).toContain(url)

    const overlap = paths.filter((p) => {
      const segs = p.split("/").filter(Boolean)
      if (segs.length !== 2) return false
      return isNoindexed(segs[0], segs[1])
    })
    expect(overlap).toEqual([])
  })

  it("7 and 8. /search and /dashboard stay noindexed", () => {
    expect((searchMetadata as PageMeta).robots).toMatchObject({ index: false, follow: false })
    expect((dashboardMetadata as PageMeta).robots).toMatchObject({ index: false, follow: false })
  })

  it("9. /authors/pilotstack-team stays noindexed", async () => {
    expect(isPublicAuthor("pilotstack-team")).toBe(false)
    const meta = (await AuthorsPage.generateMetadata({
      params: Promise.resolve({ slug: "pilotstack-team" }),
    })) as PageMeta
    expect(meta.robots?.index).toBe(false)
  })
})

let hasGit = false
try {
  hasGit =
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: ROOT, encoding: "utf8" }).trim() === "true"
} catch {
  hasGit = false
}

function baselineList(): { directories: DirLists; allFiles: AllFile[] } {
  return listAt(RECOVERY.baselineCommit)
}

function listAt(commit: string): { directories: DirLists; allFiles: AllFile[] } {
  const raw = execFileSync("git", ["show", `${commit}:noindex-list.json`], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 1 << 25,
  })
  return JSON.parse(raw)
}

const WAVE1_KEYS = Object.entries(H02_INDEX02A_RECOVERY.slugs).flatMap(([dir, slugs]) =>
  slugs.map((slug) => `${dir}/${slug}`),
)

describe.skipIf(!hasGit)("INDEX-01 transition against the pinned baseline", () => {
  it("1, 2, 16 and 17. the INDEX-01 commit moved exactly the approved 52, and wave 1 moved exactly the approved 31", () => {
    const index01 = listAt("3ee40abe275506dc46c3969e4bbdc9be1fc3366c")
    const baseline = baselineList()

    for (const dir of Object.keys(index01.directories)) {
      const before = baseline.directories[dir]
      const after = index01.directories[dir]
      expect(diff(after.keep, before.keep), `${dir} INDEX-01 keep additions`).toEqual(approvedOf(dir))
      expect(diff(before.keep, after.keep), `${dir} INDEX-01 keep removals`).toEqual([])
      expect(diff(before.noindex, after.noindex), `${dir} INDEX-01 noindex removals`).toEqual(approvedOf(dir))
      expect(diff(after.noindex, before.noindex), `${dir} INDEX-01 noindex additions`).toEqual([])
    }

    const current = readList()
    const preWave = index01.directories
    for (const dir of Object.keys(current)) {
      const wave1Of = [...(H02_INDEX02A_RECOVERY.slugs[dir] || [])].sort()
      expect(diff(current[dir].keep, preWave[dir].keep).sort(), `${dir} wave-1 keep additions`).toEqual(wave1Of)
      expect(diff(preWave[dir].keep, current[dir].keep), `${dir} wave-1 keep removals`).toEqual([])
      expect(diff(preWave[dir].noindex, current[dir].noindex).sort(), `${dir} wave-1 noindex removals`).toEqual(wave1Of)
      expect(diff(current[dir].noindex, preWave[dir].noindex), `${dir} wave-1 noindex additions`).toEqual([])
    }
    expect(WAVE1_KEYS).toHaveLength(31)
    expect(new Set(WAVE1_KEYS).size).toBe(31)
  })

  it("4, 5 and 6. the 135 thin, 97 duplicate and 171 no-evidence pages stay noindexed bar the approved 31", () => {
    const current = readList()
    const baseline = baselineList()
    const approvedKeys = new Set(APPROVED.map((e) => `${e.dir}/${e.slug}`))
    const classes: Record<string, string[]> = { B: [], C: [], D: [], E: [], A: [], unpublished: [], other: [] }

    for (const file of baseline.allFiles) {
      const key = `${file.dir}/${file.slug}`
      const list = baseline.directories[file.dir]
      if (!list) continue
      if (list.keep.includes(file.slug)) {
        classes.A.push(key)
        continue
      }
      if (!list.noindex.includes(file.slug)) {
        classes.other.push(key)
        continue
      }
      if (publishedOf(file.dir, file.slug) === false) {
        classes.unpublished.push(key)
        continue
      }
      if (file.isDuplicate) classes.D.push(key)
      else if (file.words < 300) classes.C.push(key)
      else if (approvedKeys.has(key)) classes.B.push(key)
      else classes.E.push(key)
    }

    expect(classes.B).toHaveLength(RECOVERY.approvedCount)
    expect(classes.C).toHaveLength(RECOVERY.classification.thin)
    expect(classes.D).toHaveLength(RECOVERY.classification.duplicate)
    expect(classes.E).toHaveLength(RECOVERY.classification.noEvidence)
    expect([...classes.B].sort()).toEqual([...approvedKeys].sort())

    // Phase INDEX-02A wave 1 overrides exactly the approved 31 rows: 2 thin
    // alternatives and 29 duplicate-flagged comparisons re-audited as RECOVER.
    const wave1 = new Set(WAVE1_KEYS)
    const classOf = new Map<string, string>()
    for (const cls of ["B", "C", "D", "E"] as const) for (const key of classes[cls]) classOf.set(key, cls)
    const wave1Classes = [...wave1].map((key) => classOf.get(key) ?? "not-classified")
    expect(wave1Classes.filter((cls) => cls === "C")).toHaveLength(2)
    expect(wave1Classes.filter((cls) => cls === "D")).toHaveLength(29)
    expect(wave1Classes.filter((cls) => cls === "E")).toHaveLength(0)
    expect(classes.C.filter((key) => wave1.has(key))).toHaveLength(2)
    expect(classes.D.filter((key) => wave1.has(key))).toHaveLength(29)

    for (const key of [...classes.C, ...classes.D, ...classes.E]) {
      const [dir, slug] = key.split("/")
      if (wave1.has(key)) {
        expect(current[dir].keep, `${key} is approved keep under INDEX-02A wave 1`).toContain(slug)
        expect(current[dir].noindex, `${key} must have left noindex`).not.toContain(slug)
      } else {
        expect(current[dir].noindex, `${key} must stay noindexed`).toContain(slug)
        expect(current[dir].keep, `${key} must not be keep`).not.toContain(slug)
      }
    }
    expect(classes.C.filter((key) => !wave1.has(key))).toHaveLength(RECOVERY.classification.thin - 2)
    expect(classes.D.filter((key) => !wave1.has(key))).toHaveLength(RECOVERY.classification.duplicate - 29)
    for (const key of classes.A) {
      const [dir, slug] = key.split("/")
      expect(current[dir].keep, `${key} must stay indexable`).toContain(slug)
    }
  })

  it("15. no content file changed", () => {
    const changed = execFileSync("git", ["diff", "--name-only", RECOVERY.baselineCommit, "--", "content"], {
      cwd: ROOT,
      encoding: "utf8",
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    expect(changed).toEqual([])
  })

  it("the protected SEO surfaces are byte-identical to the baseline", () => {
    const changed = execFileSync(
      "git",
      [
        "diff",
        "--name-only",
        RECOVERY.baselineCommit,
        "--",
        "src/app/robots.ts",
        "src/app/sitemap.ts",
        "src/app/sitemap-html/page.tsx",
        "src/lib/metadata.ts",
        "src/lib/noindex.ts",
        "src/app/search/page.tsx",
        "src/app/dashboard/page.tsx",
        "next.config.ts",
        "public/robots.txt",
      ],
      { cwd: ROOT, encoding: "utf8" },
    )
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    expect(changed).toEqual([])
  })

  it("only the intended files changed overall", () => {
    const changed = execFileSync("git", ["diff", "--name-only", RECOVERY.baselineCommit], {
      cwd: ROOT,
      encoding: "utf8",
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    const allowed = [
      "noindex-list.json",
      "src/lib/content/h01-contract.ts",
      "src/lib/content/h02-contract.ts",
      "src/test/h01-contract.test.ts",
      "src/test/h02-contract.test.ts",
      "src/test/phase5k-noindex-parity.test.ts",
      "src/test/phase5m-author-discovery.test.ts",
      "src/test/review-dates.test.ts",
      "src/test/author-image-integrity.test.tsx",
      "src/test/phase5o-b1-internal-links.test.ts",
      "src/test/phase5o-b2-internal-links-rendering.test.ts",
      "src/test/index01-noindex-recovery.test.ts",
      // pre-existing local audit artefact that must never be staged
      "_gsc-indexation-recovery-final.md",
    ]
    expect(changed.filter((file) => !allowed.includes(file))).toEqual([])
    expect(changed).toContain("noindex-list.json")
  })
})
