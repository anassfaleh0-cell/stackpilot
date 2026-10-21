import { afterEach, describe, expect, it, vi } from "vitest"
import { POST } from "@/app/api/newsletter/route"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("newsletter signup", () => {
  it("returns a non-success JSON response when the UI submits without a mailing-list provider", async () => {
    const request = new Request("https://pilotstack.online/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.222",
      },
      body: JSON.stringify({ email: "reader@example.com" }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.error).toContain("no subscription was saved")
    expect(body.success).toBeUndefined()
  })

  it("rejects invalid JSON email submissions before reporting provider unavailability", async () => {
    const request = new Request("https://pilotstack.online/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.223",
      },
      body: JSON.stringify({ email: "not-an-email" }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toContain("valid email")
  })

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

    expect(response.status).toBe(302)
    expect(location).toContain("error=newsletter-unavailable")
    expect(location).not.toContain("subscribed=true")
    expect(log).not.toHaveBeenCalled()
  })
})
