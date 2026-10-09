import { describe, expect, it } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getComparison } from "@/lib/content/registry"

describe("content indexability guards", () => {
  it("honors the explicit noindex manifest", () => {
    expect(isNoindexed("guides", "api-development-tools-guide")).toBe(true)
    expect(isNoindexed("guides", "not-a-real-guide")).toBe(false)
  })

  it("does not expose a comparison explicitly marked unpublished", () => {
    expect(getComparison("activecampaign-vs-adobe-express")).toBeNull()
    expect(getComparison("adp-vs-airtable")).toBeNull()
  })
})
