import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const contentFamilies = ["best", "blog", "guides", "alternatives", "use-cases", "industries", "statistics"]

describe("Cloudflare published-route prerender safety", () => {
  for (const family of contentFamilies) {
    it(`prerenders all committed ${family} pages without on-demand Worker fallback`, () => {
      const route = fs.readFileSync(path.join(process.cwd(), "src/app", family, "[slug]", "page.tsx"), "utf8")
      expect(route).toMatch(/export const dynamic = "force-static"/)
      expect(route).toMatch(/export const dynamicParams = false/)
      expect(route).toMatch(/export function generateStaticParams\(\)/)
      expect(route).not.toMatch(/if \(process\.env\.BUILD_TARGET !== "cloudflare"\) return \[\]/)
    })
  }
})
