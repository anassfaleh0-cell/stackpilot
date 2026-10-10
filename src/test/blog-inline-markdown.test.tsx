import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { renderBlogInlineMarkdown } from "@/components/content/blog-inline-markdown"

describe("blog inline Markdown", () => {
  it("renders internal and external links and preserves bold text", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        "p",
        null,
        ...renderBlogInlineMarkdown(
          "Read [the guide](/guides/accounting-software-pricing), visit [the vendor](https://example.com/pricing), and verify **current terms**.",
          "test",
        ),
      ),
    )

    expect(html).toContain('href="/guides/accounting-software-pricing"')
    expect(html).toContain(">the guide</a>")
    expect(html).toContain('href="https://example.com/pricing"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).toContain("<strong>current terms</strong>")
  })

  it("does not turn unsupported protocols into clickable links", () => {
    const html = renderToStaticMarkup(
      React.createElement("p", null, ...renderBlogInlineMarkdown("[unsafe](javascript:alert(1))", "unsafe")),
    )

    expect(html).not.toContain('href="javascript:')
    expect(html).toContain("[unsafe](javascript:alert(1))")
  })
})
