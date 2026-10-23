import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import sitemap from "@/app/sitemap"
import { REDIRECTED_ALTERNATIVE_SLUGS, REDIRECTED_BEST_SLUGS } from "@/lib/sitemap/redirected-content"
import SitemapPage from "@/app/sitemap-html/page"
import robots from "@/app/robots"
import { siteConfig, toolPages, editorialLinks } from "@/lib/constants"
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
  generateStaticParams?: () => { slug: string }[] | Promise<{ slug: string }[]>
}
type Family = { dir?: string; route: string; mod: PageModule }

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

type RecordEntry = { file: string; slug: string; fieldSlug: string; published: unknown; publicationStatus: unknown }

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
        publicationStatus: data.publicationStatus,
      }
    })
}

function collectHrefs(node: unknown, hrefs: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) collectHrefs(child, hrefs)
    return hrefs
  }
  if (typeof node !== "object" || node === null) return hrefs
  const element = node as { props?: { href?: unknown; children?: unknown } }
  if (typeof element.props?.href === "string") hrefs.push(element.props.href)
  collectHrefs(element.props?.children, hrefs)
  return hrefs
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

describe("robots SEO policy", () => {
  it("publishes the canonical sitemap and allows crawling of public content", () => {
    const policy = robots()
    expect(policy.sitemap).toBe(`${siteConfig.url}/sitemap.xml`)
    const rules = Array.isArray(policy.rules) ? policy.rules : [policy.rules]
    const wildcard = rules.find((rule) => rule.userAgent === "*")
    expect(wildcard?.allow).toBe("/")
    expect(wildcard?.disallow).toEqual(expect.arrayContaining(["/api/", "/admin/", "/dashboard", "/search", "/_global-error"]))
  })
})

describe("route families", () => {
  it("uses only absolute same-origin canonical sitemap URLs without query strings or fragments", () => {
    const entries = sitemap()
    const expectedOrigin = new URL(siteConfig.url).origin
    for (const entry of entries) {
      const parsed = new URL(entry.url)
      expect(parsed.origin, `sitemap URL must use canonical origin: ${entry.url}`).toBe(expectedOrigin)
      expect(parsed.search, `sitemap URL must not contain query params: ${entry.url}`).toBe("")
      expect(parsed.hash, `sitemap URL must not contain fragments: ${entry.url}`).toBe("")
      expect(parsed.pathname.startsWith("/"), `sitemap URL must use an absolute path: ${entry.url}`).toBe(true)
    }
  })

  it("keeps HTML and XML sitemap URL coverage aligned", () => {
    const xmlPaths = new Set(sitemap().map(entry => new URL(entry.url).pathname))
    const htmlHrefs = new Set(collectHrefs(SitemapPage()))
    const canonicalHtmlPaths = new Set([...htmlHrefs].map(canonicalPath))
    const missingFromHtml = [...xmlPaths].map(canonicalPath).filter(pathname => !canonicalHtmlPaths.has(pathname))
    const canonicalPath = (pathname: string) => pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
    const canonicalXmlPaths = new Set([...xmlPaths].map(canonicalPath))
    const extraHtmlLinks = [...htmlHrefs].map(canonicalPath).filter(pathname => pathname.startsWith("/") && !canonicalXmlPaths.has(pathname))
    expect(missingFromHtml, "every XML sitemap URL should be discoverable from the HTML sitemap").toEqual([])
    expect(extraHtmlLinks, "the HTML sitemap should not link to URLs excluded from the XML sitemap").toEqual([])
  })

  it("includes tool pages, public author profiles, and editorial resources in the HTML sitemap", () => {
    const hrefs = new Set(collectHrefs(SitemapPage()))
    for (const tool of toolPages) {
      expect(hrefs.has(`/tools/${tool.slug}`), `tool page missing from HTML sitemap: ${tool.slug}`).toBe(true)
    }
    for (const slug of PUBLIC_AUTHOR_SLUGS) {
      expect(hrefs.has(`/authors/${slug}`), `author page missing from HTML sitemap: ${slug}`).toBe(true)
    }
    for (const link of editorialLinks) {
      expect(hrefs.has(link.href), `editorial resource missing from HTML sitemap: ${link.href}`).toBe(true)
    }
  })

  it("includes every published glossary entry in the HTML sitemap", () => {
    const hrefs = new Set(collectHrefs(SitemapPage()))
    for (const record of recordsOf("glossary")) {
      if (record.publicationStatus === "draft") continue
      expect(hrefs.has(`/glossary/${record.slug}`), `published glossary entry missing from HTML sitemap: ${record.slug}`).toBe(true)
    }
  })

  it("does not link unpublished records from the HTML sitemap", () => {
    const hrefs = new Set(collectHrefs(SitemapPage()))
    for (const family of FAMILIES) {
      if (!family.dir) continue
      for (const record of recordsOf(family.dir)) {
        if (record.publicationStatus === "draft") {
          expect(hrefs.has(`/${family.route}/${record.slug}`), `HTML sitemap must omit unpublished content: ${family.route}/${record.slug}`).toBe(false)
        }
      }
    }
  })

  it("only lists sitemap URLs backed by an App Router page", () => {
    const missing: string[] = []
    for (const entry of sitemap()) {
      const segments = new URL(entry.url).pathname.split("/").filter(Boolean)
      const staticPage = segments.length
        ? path.join(APP_ROOT, ...segments, "page.tsx")
        : path.join(APP_ROOT, "page.tsx")
      const dynamicPage = segments.length
        ? path.join(APP_ROOT, ...segments.slice(0, -1), "[slug]", "page.tsx")
        : staticPage
      if (!fs.existsSync(staticPage) && !fs.existsSync(dynamicPage)) {
        missing.push(new URL(entry.url).pathname)
      }
    }
    expect(missing, "sitemap must not advertise missing App Router pages").toEqual([])
  })

  it("emits unique URLs in the XML sitemap", () => {
    const urls = sitemap().map((entry) => entry.url)
    const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index)
    expect(duplicates).toEqual([])
  })

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
      for (const record of recordsOf(family.dir ?? "")) {
        if (record.fieldSlug !== record.slug) mismatched.push(`${family.dir}/${record.file} slug=${record.fieldSlug}`)
        if (seen.has(record.fieldSlug)) duplicated.push(`${family.dir}/${record.fieldSlug}`)
        seen.add(record.fieldSlug)
      }
    }
    expect(mismatched).toEqual([])
    expect(duplicated).toEqual([])
  })

  it("excludes explicitly drafted content from the sitemap across every content family", () => {
    const paths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
    for (const family of FAMILIES) {
      for (const record of recordsOf(family.dir ?? "")) {
        if (record.publicationStatus === "draft") {
          expect(paths.has(`/${family.route}/${record.slug}`), `unpublished content must not be listed: ${family.route}/${record.slug}`).toBe(false)
        }
      }
    }
  })

  it("keeps every content record represented by an indexable sitemap URL", () => {
    const paths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
    for (const family of FAMILIES) {
      for (const record of recordsOf(family.dir ?? "")) {
        if (record.publicationStatus === "draft") continue
        if (family.route === "alternatives" && REDIRECTED_ALTERNATIVE_SLUGS.has(record.slug)) continue
        if (family.route === "best" && REDIRECTED_BEST_SLUGS.has(record.slug)) continue
        expect(paths.has(`/${family.route}/${record.slug}`), `missing sitemap URL for ${family.route}/${record.slug}`).toBe(true)
      }
    }
  })

  it("keeps the current GSC 404 examples resolvable as real content", async () => {
    const gscExamples: Array<{ route: string; mod: PageModule; slugs: string[] }> = [
      { route: "comparisons", mod: Comparisons, slugs: ["square-vs-xero", "cloudflare-pages-vs-firebase", "circleci-vs-netlify", "expensify-vs-sage-intacct", "google-meet-vs-slack", "gitlab-vs-jfrog"] },
      { route: "best", mod: Best, slugs: ["best-marketing-seo-startups", "best-ai-video-tools", "best-developer-tools-agencies", "best-business-intelligence"] },
    ]
    for (const family of gscExamples) {
      for (const slug of family.slugs) await expectResolves(family, slug)
    }
  }, 120000)

  it("renders every author and tool the site ships", async () => {
    for (const slug of PUBLIC_AUTHOR_SLUGS) await expectResolves({ route: "authors", mod: Authors }, slug)
    const toolParams = await Tools.generateStaticParams!()
    for (const param of toolParams) await expectResolves({ route: "tools", mod: Tools }, param.slug)
  })

  it("404s unknown slugs in every route family", async () => {
    for (const family of ALL_FAMILIES) await expect404(family, UNKNOWN_SLUG)
  })

  it("lists only records that resolve in the sitemap", async () => {
    const entries = sitemap()
    const origin = new URL(entries[0].url).origin
    const byRoute = new Map<string, Map<string, unknown>>(
      FAMILIES.map((family) => [family.route, new Map(recordsOf(family.dir ?? "").map((record) => [record.slug, record.published]))]),
    )
    const codeSlugs = new Map<string, Set<string>>([
      ["authors", new Set<string>([...PUBLIC_AUTHOR_SLUGS])],
      ["tools", new Set<string>((await Tools.generateStaticParams?.() ?? []).map((param) => param.slug))],
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
        expect(records.has(slug), `${entry.url} must map to a current content record`).toBe(true)
        continue
      }
      const code = codeSlugs.get(route)
      if (code) expect(code.has(slug), `${entry.url} has no route source`).toBe(true)
    }
  })

  it("pins dynamicParams to false on slug routes with build-time params", () => {
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
    expect(pinned.sort()).toEqual(["authors/[slug]/page.tsx", "comparisons/[slug]/page.tsx", "reviews/[slug]/page.tsx"].sort())
  })
})
