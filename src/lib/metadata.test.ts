import { afterEach, describe, expect, it, vi } from "vitest"
import { createMetadata } from "@/lib/metadata"
import { absoluteUrl } from "@/lib/utils"

afterEach(() => vi.unstubAllEnvs())

describe("createMetadata robots directives", () => {
  it("keeps pages followable by default", () => {
    const metadata = createMetadata({ title: "Test", description: "Description" })
    expect(metadata.robots.index).toBe(true)
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.robots.googleBot.follow).toBe(true)
  })

  it("turns follow off when noFollow is true", () => {
    const metadata = createMetadata({ title: "Test", description: "Description", noFollow: true })
    expect(metadata.robots.follow).toBe(false)
    expect(metadata.robots.googleBot.follow).toBe(false)
  })

  it("keeps index and follow controls independent", () => {
    const metadata = createMetadata({ title: "Test", description: "Description", noIndex: true, noFollow: false })
    expect(metadata.robots.index).toBe(false)
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.alternates.canonical).toBe("https://pilotstack.online")
  })
})

describe("absoluteUrl canonical fallback", () => {
  it("uses the apex domain when no site URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
    expect(absoluteUrl("/guides/example")).toBe("https://pilotstack.online/guides/example")
  })
})
