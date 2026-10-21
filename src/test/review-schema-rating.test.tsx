import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { ReviewSchema } from "@/components/seo/json-ld"

describe("ReviewSchema", () => {
  it("omits Review structured data when no real rating is available", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewSchema, {
        name: "Example Software",
        description: "A factual summary of the software.",
        url: "https://pilotstack.online/reviews/example",
      }),
    )

    expect(html).toBe("")
  })

  it("emits the supplied rating without inventing a score", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewSchema, {
        name: "Example Software",
        description: "A factual summary of the software.",
        url: "https://pilotstack.online/reviews/example",
        rating: 4.2,
        datePublished: "2026-10-01",
      }),
    )

    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(match).not.toBeNull()
    const schema = JSON.parse(match![1])
    expect(schema["@type"]).toBe("Review")
    expect(schema.reviewRating.ratingValue).toBe(4.2)
    expect(schema.datePublished).toBe("2026-10-01")
  })

  it.each([0, -1, 5.1, Number.NaN, Number.POSITIVE_INFINITY])(
    "omits invalid rating %s",
    (rating) => {
      const html = renderToStaticMarkup(
        React.createElement(ReviewSchema, {
          name: "Example Software",
          description: "A factual summary of the software.",
          url: "https://pilotstack.online/reviews/example",
          rating,
        }),
      )

      expect(html).toBe("")
    },
  )
})
