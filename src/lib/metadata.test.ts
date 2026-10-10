import { describe, expect, it } from "vitest"
import { createMetadata } from "./metadata"

describe("createMetadata robots directives", () => {
  it("allows crawling by default", () => {
    const metadata = createMetadata({ title: "Example", description: "Example description" })
    expect(metadata.robots.index).toBe(true)
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.robots.googleBot.index).toBe(true)
    expect(metadata.robots.googleBot.follow).toBe(true)
  })

  it("maps noFollow=true to follow=false", () => {
    const metadata = createMetadata({
      title: "Example",
      description: "Example description",
      noFollow: true,
    })
    expect(metadata.robots.follow).toBe(false)
    expect(metadata.robots.googleBot.follow).toBe(false)
  })

  it("keeps links followable when noFollow=false", () => {
    const metadata = createMetadata({
      title: "Example",
      description: "Example description",
      noFollow: false,
    })
    expect(metadata.robots.follow).toBe(true)
    expect(metadata.robots.googleBot.follow).toBe(true)
  })
})
