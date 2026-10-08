import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import sitemap from "@/app/sitemap"
import { PUBLIC_AUTHOR_SLUGS } from "@/lib/authors"
import * as Alternatives from "@/app/alternatives/[slug]/page"
import * as Authors from "@/app/authors/[slug]/page"
import * as Best from "@/app/best/[slug]/page"
import * as Blog from "@/app/blog/[slug]/page"
import * as Category from "@/app/category/[slug]/page"
import * as Comparisons from "@/app/comparisons/[slug]/page"
import * as Glossary from "@/app/glossary/[slug]/page"
import * as Guides from "@/app/guides/[slug]/page"
import * as Hubs from "@/app/hubs/[slug]/page"
import * as Industries from "@/app/industries/[slug]/page"
import * as Research from "@/app/research/[slug]/page"
import * as Reviews from "@/app/reviews/[slug]/page"
import * as Statistics from "@/app/statistics/[slug]/page"
import * as Tools from "@/app/tools/[slug]/page"
import * as UseCases from "@/app/use-cases/[slug]/page"

type Props = { params: Promise<{ slug: string }> }
type PageModule = {
  default: (props: Props) => Promise<unknown>
  generateStaticParams?: () => { slug: string }[]
}
type Family = { dir: string; route: string; mod: PageModule }

const FAMILIES: Family[] = [
  { dir: "alternatives", route: "alternatives", mod: Alternatives },
  { dir: "best", route: "best", mod: Best },
  { dir: "blog", route: "blog", mod: Blog },
  { dir: "categories", route: "category", mod: Category },
  { dir: "comparisons", route: "comparisons", mod: Comparisons },
  { dir: "glossary", route: "glossary", mod: Glossary },
  { dir: "guides", route: "guides", mod: Guides },
  { dir: "hubs", route: "hubs", mod: Hubs },
  { dir: "industries", route: "industries", mod: Industries },
  { dir: "research", route: "research", mod: Research },
  { dir: "reviews", route: "reviews", mod: Reviews },
  { dir: "statistics", route: "statistics", mod: Statistics },
  { dir: "use-cases", route: "use-cases", mod: UseCases },
]

const CODE_FAMILIES: Family[] = [
  { dir: "", route: "authors", mod: Authors },
  { dir: "", route: "tools", mod: Tools },
]

const ALL_FAMILIES = [...FAMILIES, ...CODE_FAMILIES]
const CONTENT_ROOT = path.join(process.cwd(), "content")
const APP_ROOT = path.join(process.cwd(), "src", "app")
const UNKNOWN_SLUG = "no-such-record-on-this-site"

type RecordEntry = { file: string; slug: string; fieldSlug: string; published: unknown }

function recordsOf(dir: string): RecordEntry[] {
  const folder = path.join(CONTENT_ROOT, dir)
  if (!fs.existsSync(folder)) return []
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(folder, file), "utf8")) as Record<string, unknown>
      return {
        file,
        slug: file.replace(/\.json$/, ""),
        fieldSlug: typeof data.slug === "string" ? data.slug : "",
        published: data.published,
      }
    })
}

function render(family: Family, slug: string): Promise<unknown> {
  return family.mod.default({ params: Promise.resolve({ slug }) })
}

function isNotFound(error: unknown): boolean {
  const err = error as { digest?: string; message?: string } | null
  const text = `${err?.digest ?? ""} ${err?.message ?? ""}`
  return /NEXT_NOT_FOUND|NEXT_HTTP_ERROR_FALLBACK|404/.test(text)
}

async function expectResolves(family: Family, slug: string): Promise<void> {
  let resolved = false
  try {
    await render(family, slug)
    resolved = true
  } catch (error) {
    throw new Error(`${slug}: route /${family.route}/${slug} 404'd -> ${String(error)}`)
  }
  expect(resolved).toBe(true)
}

async function expect404(family: Family, slug: string): Promise<void> {
  try {
    await render(family, slug)
  } catch (error) {
    expect(isNotFound(error), `${slug} must 404 with Next's notFound() but threw ${String(error)}`).toBe(true)
    return
  }
  throw new Error(`${slug}: route /${family.route}/${slug} rendered a page but must 404`)
}

describe("route families", () => {
  it("covers every content directory and every [slug] route", () => {
    const contentDirs = fs
      .readdirSync(CONTENT_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((dir) => dir !== "provenance" && dir !== "authors")
    expect(contentDirs.filter((dir) => !FAMILIES.some((family) => family.dir === dir))).toEqual([])

    const routeDirs = fs
      .readdirSync(APP_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((route) => fs.existsSync(path.join(APP_ROOT, route, "[slug]", "page.tsx")))
    expect(routeDirs.filter((route) => !ALL_FAMILIES.some((family) => family.route === route))).toEqual([])
  })

  it("keeps every content filename in sync with its slug field", () => {
    const mismatched: string[] = []
    const duplicated: string[] = []
    for (const family of FAMILIES) {
      const seen = new Set<string>()
      for (const record of recordsOf(family.dir)) {
        if (record.fieldSlug !== record.slug) mismatched.push(`${family.dir}/${record.file} slug=${record.fieldSlug}`)
        if (seen.has(record.fieldSlug)) duplicated.push(`${family.dir}/${record.fieldSlug}`)
        seen.add(record.fieldSlug)
      }
    }
    expect(mismatched).toEqual([])
    expect(duplicated).toEqual([])
  })

  it(
    "renders every content record as an indexable page",
    async () => {
      for (const family of FAMILIES) {
        for (const record of recordsOf(family.dir)) {
          await expectResolves(family, record.slug)
        }
      }
    },
    300000,
  )

  it("renders every author and tool the site ships", async () => {
    for (const slug of PUBLIC_AUTHOR_SLUGS) await expectResolves({ route: "authors", mod: Authors }, slug)
    for (const param of Tools.generateStaticParams!()) await expectResolves({ route: "tools", mod: Tools }, param.slug)
  })

  it("does not turn existing content records into 404s because of publication flags", async () => {
    for (const family of FAMILIES) {
      for (const record of recordsOf(family.dir)) {
        await expectResolves(family, record.slug)
      }
    }
  })

  it("404s unknown slugs in every route family", async () => {
    for (const family of ALL_FAMILIES) await expect404(family, UNKNOWN_SLUG)
  })

  it("lists only records that resolve in the sitemap", () => {
    const entries = sitemap()
    const origin = new URL(entries[0].url).origin
    const byRoute = new Map<string, Map<string, unknown>>(
      FAMILIES.map((family) => [family.route, new Map(recordsOf(family.dir).map((record) => [record.slug, record.published]))]),
    )
    const codeSlugs = new Map<string, Set<string>>([
      ["authors", new Set<string>([...PUBLIC_AUTHOR_SLUGS])],
      ["tools", new Set<string>((Tools.generateStaticParams?.() ?? []).map((param) => param.slug))],
    ])

    for (const entry of entries) {
      const url = new URL(entry.url)
      expect(url.origin, `${entry.url} must be on the canonical host`).toBe(origin)
      const segments = url.pathname.split("/").filter(Boolean)
      if (segments.length !== 2) continue
      const [route, slug] = segments
      const records = byRoute.get(route)
      if (records) {
        expect(records.has(slug), `${entry.url} has no content record`).toBe(true)
        expect(records.get(slug), `${entry.url} is published:false and must stay out of the sitemap`).not.toBe(false)
        continue
      }
      const code = codeSlugs.get(route)
      if (code) expect(code.has(slug), `${entry.url} has no route source`).toBe(true)
    }
  })

  it("pins dynamicParams to false on the authors route only", () => {
    const pinned: string[] = []
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name === "page.tsx" && /export\s+const\s+dynamicParams\s*=\s*false/.test(fs.readFileSync(full, "utf8"))) {
          pinned.push(path.relative(APP_ROOT, full).replace(/\\/g, "/"))
        }
      }
    }
    walk(APP_ROOT)
    expect(pinned).toEqual(["authors/[slug]/page.tsx"])
  })
})
