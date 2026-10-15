import { describe, expect, it } from "vitest"
import { createMetadata, truncateAtWordBoundary } from "@/lib/metadata"

describe("metadata helpers", () => {
  it("keeps pages followable by default", () => {
    const metadata = createMetadata({
      title: "A useful software review",
      description: "A practical description for people comparing software.",
      path: "/reviews/example",
    })

    expect(metadata.robots.index).toBe(true)
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.robots.googleBot.index).toBe(true)
    expect(metadata.robots.googleBot.follow).toBe(true)
    expect(metadata.alternates.canonical).toBe("https://pilotstack.online/reviews/example")
  })

  it("only disables following when noFollow is explicitly true", () => {
    const metadata = createMetadata({
      title: "A useful software review",
      description: "A practical description for people comparing software.",
      noFollow: true,
    })

    expect(metadata.robots.index).toBe(true)
    expect(metadata.robots.follow).toBe(false)
    expect(metadata.robots.googleBot.follow).toBe(false)
  })

  it("keeps noIndex separate from link following", () => {
    const metadata = createMetadata({
      title: "A useful software review",
      description: "A practical description for people comparing software.",
      noIndex: true,
    })

    expect(metadata.robots.index).toBe(false)
    expect(metadata.robots.googleBot.index).toBe(false)
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.robots.googleBot.follow).toBe(true)
  })

  it("truncates long metadata at a word boundary", () => {
    expect(truncateAtWordBoundary("A short title", 20)).toBe("A short title")
    expect(truncateAtWordBoundary("A practical software comparison guide", 24)).toBe("A practical software…")
  })
})
