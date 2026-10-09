import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"

describe("XML sitemap URL integrity", () => {
  it("does not emit duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url)
    const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index)
    expect(duplicates).toEqual([])
  })

  it("uses the canonical apex domain for every URL", () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls.every((url) => url.startsWith("https://pilotstack.online/") || url === "https://pilotstack.online")).toBe(true)
  })
})
