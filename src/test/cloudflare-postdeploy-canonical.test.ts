import { describe, expect, it } from "vitest"
import fs from "node:fs"

const workflow = fs.readFileSync(".github/workflows/cloudflare-production-deploy.yml", "utf8")

describe("Cloudflare post-deployment validation", () => {
  it("checks ordinary canonical review URLs without bypassing prerender cache", () => {
    expect(workflow).toContain("for review in xero notion chatgpt; do")
    expect(workflow).toContain('fetch_status "https://pilotstack.online/reviews/$review"')
    expect(workflow).not.toContain("__content_check")
    expect(workflow).not.toContain("Cache-Control: no-cache")
  })

  it("retries transient Worker CPU errors instead of failing at first 503", () => {
    expect(workflow).toContain('if ! [[ "$code" =~ ^(000|408|429|5[0-9][0-9])$ ]]; then')
    expect(workflow).toContain('test "$code" = "200"')
  })

  it("does not claim cache freshness when the purge fails", () => {
    expect(workflow).toContain("cannot certify that edge-cached HTML is from the new deploy")
    expect(workflow).not.toContain("post-deploy checks use unique query strings")
  })
})
