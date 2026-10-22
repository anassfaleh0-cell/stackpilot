import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"

describe("newsletter signup availability", () => {
  it("does not collect email addresses while no mailing-list provider is configured", () => {
    render(<NewsletterSignup />)

    expect(screen.getByText(/newsletter sign-up is temporarily unavailable/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /contact us about updates/i })).toHaveAttribute(
      "href",
      "mailto:hello@pilotstack.online",
    )
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /subscribe/i })).not.toBeInTheDocument()
  })

  it("keeps the footer variant honest and compact", () => {
    render(<NewsletterSignup variant="footer" />)

    expect(screen.getByRole("heading", { name: "Stay informed" })).toBeInTheDocument()
    expect(screen.getByText(/we are not collecting email addresses here yet/i)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })
})
