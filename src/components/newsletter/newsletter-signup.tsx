import { Mail } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "exit"
  className?: string
}

export function NewsletterSignup({ variant = "inline", className = "" }: NewsletterSignupProps) {
  const isFooter = variant === "footer"

  return (
    <div className={`${isFooter ? "" : "rounded-xl border border-border bg-card p-5"} ${className}`.trim()}>
      <div className="flex items-center gap-2 mb-2">
        <Mail size={16} className="text-primary" />
        <h3 className={isFooter ? "font-semibold mb-2 text-sm" : "font-semibold text-sm"}>
          {isFooter ? "Stay informed" : "Newsletter updates"}
        </h3>
      </div>
      <p className={isFooter ? "text-xs text-muted-foreground mb-2" : "text-xs text-muted-foreground mb-3"}>
        Newsletter sign-up is temporarily unavailable. We are not collecting email addresses here yet; please check back later.
      </p>
      <a href="mailto:hello@pilotstack.online" className="text-xs font-medium text-primary hover:underline">
        Contact us about updates
      </a>
    </div>
  )
}
