import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { siteConfig } from "@/lib/constants"

const appDir = path.join(process.cwd(), "src", "app")

function routeExists(segments: string[], currentDir = appDir): boolean {
  if (segments.length === 0) return existsSync(path.join(currentDir, "page.tsx"))

  let entries: string[]
  try {
    entries = readdirSync(currentDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  } catch {
    return false
  }

  const [segment, ...rest] = segments
  const literal = entries.find((entry) => entry === segment)
  if (literal && routeExists(rest, path.join(currentDir, literal))) return true

  // Dynamic route segments such as [slug] serve concrete URLs in the sitemap.
  for (const entry of entries.filter((name) => /^\[[^/]+\]$/.test(name))) {
    if (routeExists(rest, path.join(currentDir, entry))) return true
  }

  // Route groups do not contribute a URL segment.
  for (const entry of entries.filter((name) => /^\([^/]+\)$/.test(name))) {
    if (routeExists(segments, path.join(currentDir, entry))) return true
  }

  return false
}

describe("sitemap route coverage", () => {
  it("only lists URLs backed by an App Router page", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    const missing = paths.filter((pathname) => !routeExists(pathname === "/" ? [] : pathname.split("/").filter(Boolean)))

    expect(missing, `Sitemap URLs without a matching page route:\n${missing.join("\n")}`).toEqual([])
  })

  it("uses the production canonical hostname", () => {
    for (const entry of sitemap()) {
      expect(new URL(entry.url).hostname).toBe(new URL(siteConfig.url).hostname)
    }
  })
})
