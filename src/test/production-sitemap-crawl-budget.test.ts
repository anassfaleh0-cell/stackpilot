import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("production sitemap crawl stays opt-in and CPU-safe", () => {
  it("does not launch a full sitemap crawl after every Cloudflare deployment", () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/pilotstack-sitemap-route-audit.yml"), "utf8")
    expect(workflow).toMatch(/workflow_dispatch:/)
    expect(workflow).not.toMatch(/workflow_run:/)
    expect(workflow).toMatch(/cancel-in-progress: true/)
    expect(workflow).toContain('CHECK_SITEMAP_URLS: "1"')
  })

  it("serializes and paces the optional production route crawl", () => {
    const smoke = fs.readFileSync(path.join(process.cwd(), "scripts/production-smoke-check.cjs"), "utf8")
    expect(smoke).toContain("const concurrency = Math.min(IS_LIVE_PRODUCTION ? 1 : 4, targets.length)")
    expect(smoke).toContain("if (IS_LIVE_PRODUCTION) await new Promise((resolve) => setTimeout(resolve, 1000))")
    expect(smoke).not.toMatch(/searchParams\.set\(["']__content_check/)
  })
})
