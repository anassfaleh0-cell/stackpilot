import { describe, expect, it } from "vitest"
import robots from "@/app/robots"

describe("robots.txt crawler access rules", () => {
  it("blocks internal and search paths for the wildcard crawler group", () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    const wildcard = rules.find((rule) => rule.userAgent === "*")
    expect(wildcard?.disallow).toEqual(["/api/", "/admin/", "/dashboard", "/search", "/_global-error"])
  })

  it("does not let named crawlers bypass internal-path restrictions", () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    for (const rule of rules) {
      if (rule.userAgent === "*") continue
      expect(rule.disallow).toEqual(["/api/", "/admin/", "/dashboard", "/search", "/_global-error"])
    }
  })

  it("publishes the canonical sitemap URL", () => {
    expect(robots().sitemap).toBe("https://pilotstack.online/sitemap.xml")
  })
})
