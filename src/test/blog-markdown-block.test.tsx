import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { BlogMarkdownBlock } from "@/components/content/blog-markdown-block"

describe("blog Markdown blocks", () => {
  it("renders all list items instead of dropping lines after the first", () => {
    const html = renderToStaticMarkup(
      React.createElement(BlogMarkdownBlock, {
        block: "- First requirement\n- Second requirement\n- Third requirement",
        keyBase: "list",
      }),
    )

    expect(html).toContain("<ul")
    expect(html).toContain("First requirement")
    expect(html).toContain("Second requirement")
    expect(html).toContain("Third requirement")
  })

  it("renders ordered steps, table rows, and Markdown links", () => {
    const list = renderToStaticMarkup(
      React.createElement(BlogMarkdownBlock, {
        block: "1. Define the workflow\n2. [Check the cost](/tools/tco-calculator)",
        keyBase: "steps",
      }),
    )
    const table = renderToStaticMarkup(
      React.createElement(BlogMarkdownBlock, {
        block: "| Plan | Cost |\n|---|---|\n| Basic | Confirm with vendor |\n| Team | Check seat minimum |",
        keyBase: "table",
      }),
    )

    expect(list).toContain("<ol")
    expect(list).toContain("Define the workflow")
    expect(list).toContain('href="/tools/tco-calculator"')
    expect(table).toContain("<table")
    expect(table).toContain("Basic")
    expect(table).toContain("Team")
  })

  it("renders headings and keeps multiple paragraph lines", () => {
    const heading = renderToStaticMarkup(
      React.createElement(BlogMarkdownBlock, { block: "## Evaluation criteria", keyBase: "heading" }),
    )
    const paragraph = renderToStaticMarkup(
      React.createElement(BlogMarkdownBlock, { block: "First line of prose.\nSecond line of prose.", keyBase: "paragraph" }),
    )

    expect(heading).toContain("<h2")
    expect(heading).toContain("Evaluation criteria")
    expect(paragraph).toContain("First line of prose.")
    expect(paragraph).toContain("Second line of prose.")
    expect(paragraph).toContain("<br")
  })
})
