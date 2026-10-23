interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "exit"
  className?: string
}

export function NewsletterSignup({ variant = "inline", className = "" }: NewsletterSignupProps) {
  const isFooter = variant === "footer"

  return (
    <div className={`${isFooter ? "" : "rounded-xl border border-border bg-card p-5"} ${className}`.trim()}>
      <h3 className={isFooter ? "font-semibold mb-2 text-sm" : "font-semibold text-sm mb-2"}>
        {isFooter ? "Questions or corrections?" : "Contact PilotStack"}
      </h3>
      <p className={isFooter ? "text-xs text-muted-foreground mb-2" : "text-xs text-muted-foreground mb-3"}>
        For questions about software research, factual corrections, or business inquiries, email our team.
      </p>
      <a href="mailto:contact@pilotstack.online" className="text-xs font-medium text-primary hover:underline">
        contact@pilotstack.online
      </a>
    </div>
  )
}
