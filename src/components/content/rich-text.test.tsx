import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { RichText } from "./rich-text"

describe("RichText", () => {
  it("renders first-party and official vendor references as links", () => {
    const html = renderToStaticMarkup(
      <RichText text={'Read <a href="https://docs.stripe.com/connect">Connect documentation</a> and <a href="/reviews/stripe">the Stripe review</a>.'} />,
    )
    expect(html).toContain('href="https://docs.stripe.com/connect"')
    expect(html).toContain('href="/reviews/stripe"')
    expect(html).toContain("Connect documentation")
    expect(html).not.toContain("&lt;a")
  })

  it("does not create clickable links from unsafe schemes or protocol-relative URLs", () => {
    const html = renderToStaticMarkup(
      <RichText text={'Do not open <a href="javascript:alert(1)">bad</a>, <a href="data:text/html;base64,Zg==">payload</a> or <a href="//untrusted.example">redirect</a>.'} />,
    )
    expect(html).toContain("bad")
    expect(html).toContain("payload")
    expect(html).toContain("redirect")
    expect(html).not.toContain('href="javascript:')
    expect(html).not.toContain('href="data:')
    expect(html).not.toContain('href="//')
  })

  it("links bare vendor citations in FAQs while retaining sentence punctuation", () => {
    const html = renderToStaticMarkup(
      <RichText text={"Official reference: https://docs.stripe.com/connect. Verify regional eligibility."} />,
    )
    expect(html).toContain('href="https://docs.stripe.com/connect"')
    expect(html).toContain("https://docs.stripe.com/connect</a>.")
    expect(html).toContain(" Verify regional eligibility.")
  })

  it("retains the plain text around a source link", () => {
    const html = renderToStaticMarkup(
      <RichText text={'Verify <a href="https://www.jotform.com/help/408-understanding-your-account-usage-and-limits/">current form limits</a> before publishing.'} />,
    )
    expect(html).toContain("Verify ")
    expect(html).toContain("current form limits")
    expect(html).toContain(" before publishing.")
  })
})
