import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"

describe("contact CTA used in place of an inactive newsletter", () => {
  it("does not collect email addresses while no mailing-list provider is configured", () => {
    render(<NewsletterSignup />)

    expect(screen.getByRole("heading", { name: "Contact PilotStack" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "contact@pilotstack.online" })).toHaveAttribute(
      "href",
      "mailto:contact@pilotstack.online",
    )
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /subscribe/i })).not.toBeInTheDocument()
  })

  it("keeps the footer variant honest and compact", () => {
    render(<NewsletterSignup variant="footer" />)

    expect(screen.getByRole("heading", { name: "Questions or corrections?" })).toBeInTheDocument()
    expect(screen.getByText(/email our team/i)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })
})
