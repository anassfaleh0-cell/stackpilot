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

  it("uses a real raster social preview and does not claim an unverified social account", () => {
    const metadata = createMetadata({
      title: "Project Management Software Review",
      description: "Clear criteria and trade-offs for selecting a project management tool.",
      path: "/reviews/linear",
    })
    expect(metadata.openGraph.images[0].url).toBe("https://pilotstack.online/og.png")
    expect(metadata.twitter.images).toEqual(["https://pilotstack.online/og.png"])
    expect(metadata.twitter).not.toHaveProperty("creator")
    expect(metadata.twitter).not.toHaveProperty("site")
  })

  it("does not emit unfinished ellipses or exceed SEO field limits", () => {
    const metadata = createMetadata({
      title: "Long software comparison title ".repeat(5),
      description: "A detailed feature comparison of several products with evidence and concrete buyer considerations. ".repeat(5),
      path: "/comparisons/example",
    })
    expect(metadata.title.length).toBeLessThanOrEqual(60)
    expect(metadata.description.length).toBeLessThanOrEqual(155)
    expect(metadata.title).not.toMatch(/…|\\.\\.\\.$/)
    expect(metadata.description).not.toMatch(/…|\\.\\.\\.$/)
  })

  it("removes dangling site separators from truncated SEO titles", () => {
    const title = "Marketing & SEO Software: Compare Tools by Workflow | PilotStack"
    const shortened = truncateAtWordBoundary(title, 60)
    expect(shortened).toBe("Marketing & SEO Software: Compare Tools by Workflow")
    expect(shortened).not.toMatch(/[|:;,–—-]$/)
  })

  it("truncates long metadata at a word boundary", () => {
    expect(truncateAtWordBoundary("A short title", 20)).toBe("A short title")
    expect(truncateAtWordBoundary("A practical software comparison guide", 24)).toBe("A practical software")
  })
})
