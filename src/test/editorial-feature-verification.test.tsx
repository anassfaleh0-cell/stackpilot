import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { EditorialFeatureMatrix } from "@/components/editorial/editorial-features"

const features = [
  {
    name: "Central policy controls",
    description: "Verify this capability in the current vendor documentation.",
    available: true,
    category: "Core",
  },
]

describe("editorial feature verification state", () => {
  it("does not present stored feature flags as confirmed when the profile is unverified", () => {
    const html = renderToStaticMarkup(
      React.createElement(EditorialFeatureMatrix, {
        features,
        slug: "sentinelone",
        category: "Security & Compliance",
        verified: false,
      })
    )

    expect(html).toContain("Availability not verified")
    expect(html).toContain("Unverified")
    expect(html).not.toContain("1/1 available")
    expect(html).not.toContain(">Available</span>")
  })

  it("shows availability counts only when the profile is verified", () => {
    const html = renderToStaticMarkup(
      React.createElement(EditorialFeatureMatrix, {
        features,
        slug: "example-product",
        category: "Security & Compliance",
        verified: true,
      })
    )

    expect(html).toContain("1/1 available")
    expect(html).toContain(">Available</span>")
    expect(html).not.toContain("Availability not verified")
  })
})
