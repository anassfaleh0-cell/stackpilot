import { afterEach, describe, expect, it, vi } from "vitest"
import { POST } from "@/app/api/newsletter/route"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("newsletter signup", () => {
  it("does not claim a subscription was saved without a mailing-list provider", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const body = new URLSearchParams({ email: "reader@example.com" })
    const request = new Request("https://pilotstack.online/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-forwarded-for": "198.51.100.221",
      },
      body,
    })

    const response = await POST(request)
    const location = response.headers.get("location")

    expect(response.status).toBe(307)
    expect(location).toContain("error=newsletter-unavailable")
    expect(location).not.toContain("subscribed=true")
    expect(log).not.toHaveBeenCalled()
  })
})
