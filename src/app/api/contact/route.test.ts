import { afterEach, describe, expect, it, vi } from "vitest"
import { POST } from "@/app/api/contact/route"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function request(ip: string) {
  return new Request("https://pilotstack.online/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      name: "Test Visitor",
      email: "visitor@example.com",
      subject: "general",
      message: "This is a valid test contact message.",
    }),
  })
}

describe("contact form delivery", () => {
  it("does not claim success when email delivery is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    vi.stubEnv("CONTACT_FROM_EMAIL", "")

    const response = await POST(request("198.51.100.201"))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.success).toBeUndefined()
    expect(body.error).toContain("contact@pilotstack.online")
  })

  it("only reports success after the email provider accepts the message", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key")
    vi.stubEnv("CONTACT_FROM_EMAIL", "PilotStack <contact@example.com>")
    vi.stubEnv("CONTACT_TO_EMAIL", "contact@pilotstack.online")
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const response = await POST(request("198.51.100.202"))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.resend.com/emails")
    expect(options.headers.Authorization).toBe("Bearer test-key")
    expect(JSON.parse(options.body).reply_to).toBe("visitor@example.com")
  })

  it("returns a delivery error if the provider rejects the message", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key")
    vi.stubEnv("CONTACT_FROM_EMAIL", "PilotStack <contact@example.com>")
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })))

    const response = await POST(request("198.51.100.203"))
    const body = await response.json()

    expect(response.status).toBe(502)
    expect(body.success).toBeUndefined()
    expect(body.error).toContain("email contact@pilotstack.online")
  })
})
