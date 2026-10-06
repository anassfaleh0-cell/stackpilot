import fs from "node:fs"
import path from "node:path"
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { AuthorAvatar, authorInitials } from "@/components/editorial/author-avatar"
import { PUBLIC_AUTHOR_SLUGS, isPublicAuthor } from "@/lib/authors"
import sitemap from "@/app/sitemap"
import authorPage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/authors/[slug]/page"

const ROOT = process.cwd()
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8")
const exists = (rel: string) => fs.existsSync(path.join(ROOT, rel))

const AUTHORS_INDEX = "src/app/authors/page.tsx"
const AUTHOR_PROFILE = "src/app/authors/[slug]/page.tsx"
const AUTHOR_AVATAR = "src/components/editorial/author-avatar.tsx"
const EDITORIAL_EXPERT = "src/components/editorial/editorial-expert.tsx"
const BLOG_POST = "src/app/blog/[slug]/page.tsx"
const TEAM_PAGE = "src/app/team/page.tsx"
const TEAM_AUTHOR_DOC = "content/authors/pilotstack-team.md"

const AUTHOR_SURFACES = [AUTHORS_INDEX, AUTHOR_PROFILE, EDITORIAL_EXPERT, BLOG_POST, TEAM_PAGE]

const PUBLIC_AUTHORS = [...PUBLIC_AUTHOR_SLUGS]
const params = (slug: string) => ({ params: Promise.resolve({ slug }) })
const displayName = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

type AuthorMeta = {
  title?: string
  description?: string
  robots?: { index?: boolean; follow?: boolean }
  alternates?: { canonical?: string }
  openGraph?: { images?: { url?: string }[] }
}

afterEach(() => cleanup())

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function localAssetExists(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false
  const clean = publicPath.split(/[?#]/)[0]
  return exists(path.join("public", clean))
}

describe("AI-1: every intended public author has an approved neutral fallback", () => {
  it("keeps all publicly listed authors on the index and the profile route", () => {
    const index = read(AUTHORS_INDEX)
    const profile = read(AUTHOR_PROFILE)
    for (const slug of PUBLIC_AUTHORS) {
      expect(index).toContain(`"${slug}"`)
      expect(profile).toContain(`"${slug}"`)
    }
    expect(isPublicAuthor("pilotstack-team")).toBe(false)
  })

  it("declares no author photo, only the explicit neutral fallback value", () => {
    const profile = read(AUTHOR_PROFILE)
    const avatars = [...profile.matchAll(/avatar:\s*([^,\n]+)/g)].map((m) => m[1].trim())
    expect(avatars.length).toBeGreaterThanOrEqual(PUBLIC_AUTHORS.length + 1)
    for (const value of avatars) expect(value).toBe("null")
    expect(profile).not.toMatch(/avatar:\s*["'][^"']+["']/)
  })

  it("renders initials instead of an image when no verified portrait exists", () => {
    const { container } = render(<AuthorAvatar name="Sarah Chen" />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.textContent).toBe("SC")
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
  })

  it("derives stable initials for every author identity", () => {
    expect(authorInitials("Sarah Chen")).toBe("SC")
    expect(authorInitials("Marcus Rivera")).toBe("MR")
    expect(authorInitials("Emily Nakamura")).toBe("EN")
    expect(authorInitials("PilotStack Team")).toBe("PT")
  })
})

describe("AI-2: no author image path points to a missing asset", () => {
  it("resolves every avatar path declared in source or content to a real public file", () => {
    const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "content"))].filter((f) =>
      /\.(tsx?|md|json)$/.test(f),
    )
    const declared: string[] = []
    for (const file of files) {
      const source = fs.readFileSync(file, "utf8")
      for (const match of source.matchAll(/avatar:\s*["']([^"']+)["']/g)) declared.push(match[1])
    }
    for (const value of declared) {
      expect(value.startsWith("/"), `avatar path must be a local absolute path: ${value}`).toBe(true)
      expect(localAssetExists(value), `avatar asset missing from public/: ${value}`).toBe(true)
    }
  })

  it("leaves no reference to the removed author image directory", () => {
    const removed = ["/images", "authors"].join("/")
    for (const file of [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "content"))]) {
      if (!/\.(tsx?|md|json)$/.test(file)) continue
      expect(fs.readFileSync(file, "utf8")).not.toContain(removed)
    }
  })

  it("keeps every image the author surfaces render inside public/", () => {
    for (const rel of AUTHOR_SURFACES) {
      const source = read(rel)
      for (const match of source.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)) {
        expect(localAssetExists(match[1]), `${rel} renders a missing image: ${match[1]}`).toBe(true)
      }
    }
  })

  it("never points an author surface at an external image host", () => {
    for (const rel of [...AUTHOR_SURFACES, AUTHOR_AVATAR, TEAM_AUTHOR_DOC]) {
      const source = read(rel)
      expect(source).not.toMatch(/src=["']https?:\/\//)
      expect(source).not.toMatch(/avatar:\s*https?:\/\//)
    }
  })
})

describe("AI-3: author image alt behaviour", () => {
  it("uses the author display name as alt text for a real portrait", () => {
    const { container } = render(<AuthorAvatar name="Sarah Chen" src="/logo-icon.svg" />)
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute("alt", "Sarah Chen")
  })

  it("allows an explicit alt override without keyword stuffing", () => {
    const { container } = render(<AuthorAvatar name="Sarah Chen" src="/logo-icon.svg" alt="Sarah Chen" />)
    expect(container.querySelector("img")).toHaveAttribute("alt", "Sarah Chen")
  })

  it("marks the initials fallback decorative because the author name sits beside it", () => {
    const { container } = render(<AuthorAvatar name="Emily Nakamura" />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
  })

  it("gives every img rendered by an author surface an alt attribute", () => {
    for (const rel of AUTHOR_SURFACES) {
      const source = read(rel)
      for (const match of source.matchAll(/<img\b[^>]*>/g)) {
        expect(match[0], `${rel} renders an img without alt: ${match[0]}`).toContain("alt=")
      }
    }
  })
})

describe("AI-4: no author surface renders a broken image", () => {
  it("routes every author avatar through the shared AuthorAvatar component", () => {
    for (const rel of AUTHOR_SURFACES) {
      expect(read(rel), `${rel} must render author avatars through AuthorAvatar`).toContain("<AuthorAvatar")
    }
  })

  it("removes the hand-rolled avatar markup that used to diverge per surface", () => {
    for (const rel of AUTHOR_SURFACES) {
      const source = read(rel)
      expect(source).not.toContain("author.name.charAt(0)")
      expect(source).not.toContain("post.author.charAt(0)")
      expect(source).not.toContain("bg-gradient-to-br from-primary to-secondary text-white")
    }
    expect(read(AUTHOR_AVATAR)).toContain("authorInitials")
  })

  it("renders no img element when the fallback is active, so no request can 404", () => {
    for (const name of ["Sarah Chen", "Marcus Rivera", "Emily Nakamura", "PilotStack Team"]) {
      const { container } = render(<AuthorAvatar name={name} />)
      expect(container.querySelector("img")).toBeNull()
      expect(container.textContent?.trim()).toHaveLength(2)
    }
  })
})

describe("AI-5: author avatar dimensions and layout stay stable", () => {
  it("keeps one fixed box size per size variant", () => {
    const { container: sm } = render(<AuthorAvatar name="Sarah Chen" size="sm" />)
    const { container: md } = render(<AuthorAvatar name="Sarah Chen" size="md" />)
    const { container: lg } = render(<AuthorAvatar name="Sarah Chen" size="lg" />)
    expect(sm.firstElementChild?.className).toContain("h-10 w-10")
    expect(md.firstElementChild?.className).toContain("h-12 w-12")
    expect(lg.firstElementChild?.className).toContain("h-20 w-20")
  })

  it("declares intrinsic width and height on a real portrait to protect layout", () => {
    const { container } = render(<AuthorAvatar name="Sarah Chen" src="/logo-icon.svg" size="lg" />)
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("width", "80")
    expect(img).toHaveAttribute("height", "80")
    expect(img).toHaveAttribute("loading", "lazy")
  })

  it("uses a predictable square aspect ratio on every author surface", () => {
    expect(read(AUTHORS_INDEX)).toContain('size="md"')
    expect(read(AUTHOR_PROFILE)).toContain('size="lg"')
    expect(read(EDITORIAL_EXPERT)).toContain('size="sm"')
    expect(read(BLOG_POST)).toContain('size="md"')
    expect(read(TEAM_PAGE)).toContain('size="md"')
  })
})

describe("AI-6: existing author routes keep returning 200", () => {
  it("prerenders every author route with dynamicParams disabled", () => {
    const slugs = generateStaticParams().map((p) => p.slug)
    expect(slugs).toEqual(expect.arrayContaining([...PUBLIC_AUTHORS, "pilotstack-team"]))
    expect(dynamicParams).toBe(false)
    expect(typeof authorPage).toBe("function")
  })

  it.runIf(process.env.VERIFY_LIVE === "1")("answers 200 for every author route in production", async () => {
    for (const route of ["/authors", ...PUBLIC_AUTHORS.map((s) => `/authors/${s}`), "/authors/pilotstack-team"]) {
      const response = await fetch(`https://www.pilotstack.online${route}`, { redirect: "follow" })
      expect(response.status, `${route} should answer 200`).toBe(200)
    }
  })
})

describe("AI-7: existing author SEO contracts remain unchanged", () => {
  it("serves publicly listed authors as index, follow with their existing identity metadata", async () => {
    for (const slug of PUBLIC_AUTHORS) {
      const meta = (await generateMetadata(params(slug))) as AuthorMeta
      expect(meta.robots).toMatchObject({ index: true, follow: true })
      expect(meta.title).toContain(displayName(slug))
      expect(meta.description).toContain(displayName(slug))
      expect(meta.alternates?.canonical).toMatch(new RegExp(`/authors/${slug}$`))
      expect(meta.openGraph?.images?.[0]?.url).toMatch(/\/og\.svg$/)
    }
  })

  it("keeps the unlisted team identity on the site's exclusion convention", async () => {
    const meta = (await generateMetadata(params("pilotstack-team"))) as AuthorMeta
    expect(meta.robots).toMatchObject({ index: false, follow: false })
  })

  it("emits exactly the public author paths into the frozen sitemap", () => {
    const authorPaths = sitemap()
      .map((entry) => new URL(entry.url).pathname)
      .filter((p) => p.startsWith("/authors/"))
    expect(authorPaths).toHaveLength(PUBLIC_AUTHORS.length)
    expect(authorPaths).not.toContain("/authors/pilotstack-team")
    expect(sitemap()).toHaveLength(661)
  })

  it("adds no Person JSON-LD image the site cannot resolve", () => {
    expect(read(AUTHORS_INDEX)).not.toContain("PersonSchema")
    expect(read(AUTHOR_PROFILE)).not.toContain("PersonSchema")
    expect(read(AUTHOR_PROFILE)).not.toContain('"image"')
    expect(read(AUTHORS_INDEX)).not.toContain('"image"')
  })
})
