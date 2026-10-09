import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ArticleSchema } from "@/components/seo/json-ld"

function parseArticle(author: string) {
  const markup = renderToStaticMarkup(
    <ArticleSchema
      title="Example review"
      description="A documented example."
      publishedAt="2026-10-01"
      author={author}
      url="https://pilotstack.online/example"
    />,
  )
  const json = markup.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
  if (!json) throw new Error("Article JSON-LD script was not rendered")
  return JSON.parse(json)
}

describe("editorial author structured data", () => {
  it("represents the publication byline as an Organization, not a fictional Person", () => {
    const schema = parseArticle("PilotStack Team")
    expect(schema.author).toMatchObject({ "@type": "Organization", name: "PilotStack" })
  })

  it("preserves Person authors when an individual author is explicitly supplied", () => {
    const schema = parseArticle("Jane Example")
    expect(schema.author).toEqual({ "@type": "Person", name: "Jane Example" })
  })
})
