import { describe, it, expect, afterEach } from "vitest"
import { isIndexableUrl, submitUrl } from "@/lib/indexnow"
import { POST as revalidatePost } from "@/app/api/revalidate/route"
import { site } from "@/lib/constants"

// Phase P5O contract.
// The site's engine-submission surfaces (/api/indexnow, /api/revalidate) used to accept
// any URL from any caller: /api/revalidate returned 200 with no secret configured, and
// both endpoints forwarded arbitrary URLs to IndexNow under pilotstack.online. Only
// canonical-origin, sitemap-declared indexable URLs may leave the site.

const INDEXABLE = `${site.url}/comparisons/gitlab-vs-bitbucket`
const NOINDEXED = `${site.url}/search`
const UNPUBLISHED = `${site.url}/comparisons/not-a-real-comparison`

const jsonPost = (body: unknown) =>
  new Request(`${site.url}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

describe("P5O: isIndexableUrl gates engine egress", () => {
  it("accepts the canonical origin and an indexable sitemap URL", () => {
    expect(isIndexableUrl(site.url)).toBe(true)
    expect(isIndexableUrl(`${site.url}/`)).toBe(true)
    expect(isIndexableUrl(INDEXABLE)).toBe(true)
  })

  it("tolerates a trailing slash on an indexable path", () => {
    expect(isIndexableUrl(`${site.url}/guides/`)).toBe(true)
  })

  it("rejects the non-canonical www mirror and HTTP origin", () => {
    expect(isIndexableUrl(`https://www.pilotstack.online/comparisons/gitlab-vs-bitbucket`)).toBe(false)
    expect(isIndexableUrl(`http://www.pilotstack.online/comparisons/gitlab-vs-bitbucket`)).toBe(false)
    expect(isIndexableUrl(`http://pilotstack.online/`)).toBe(false)
  })

  it("rejects third-party hosts", () => {
    expect(isIndexableUrl("https://example.com/comparisons/gitlab-vs-bitbucket")).toBe(false)
    expect(isIndexableUrl("https://pilotstack.online.evil.test/")).toBe(false)
  })

  it("rejects noindexed content", () => {
    expect(isIndexableUrl(NOINDEXED)).toBe(false)
    expect(isIndexableUrl(`${site.url}/dashboard`)).toBe(false)
  })

  it("rejects unpublished content that intentionally returns 404", () => {
    expect(isIndexableUrl(UNPUBLISHED)).toBe(false)
  })

  it("rejects query strings, fragments and malformed input", () => {
    expect(isIndexableUrl(`${site.url}/?utm_source=x`)).toBe(false)
    expect(isIndexableUrl(`${site.url}/#top`)).toBe(false)
    expect(isIndexableUrl("not a url")).toBe(false)
    expect(isIndexableUrl("")).toBe(false)
  })
})

describe("P5O: submitUrl never leaves the site with a non-indexable URL", () => {
  it("short-circuits to false without a network call", async () => {
    await expect(submitUrl(UNPUBLISHED)).resolves.toBe(false)
    await expect(submitUrl(NOINDEXED)).resolves.toBe(false)
    await expect(submitUrl("https://example.com/x")).resolves.toBe(false)
  })
})

describe("P5O: /api/revalidate fails closed without a configured secret", () => {
  afterEach(() => {
    delete process.env.REVALIDATION_SECRET
  })

  it("rejects a caller when REVALIDATION_SECRET is not configured", async () => {
    delete process.env.REVALIDATION_SECRET
    const res = await revalidatePost(jsonPost({ path: "/" }))
    expect(res.status).toBe(401)
  })

  it("rejects a mismatched secret", async () => {
    process.env.REVALIDATION_SECRET = "expected-secret"
    const res = await revalidatePost(jsonPost({ path: "/", secret: "wrong" }))
    expect(res.status).toBe(401)
  })

  it("rejects a caller that omits the secret", async () => {
    process.env.REVALIDATION_SECRET = "expected-secret"
    const res = await revalidatePost(jsonPost({ path: "/" }))
    expect(res.status).toBe(401)
  })
})
