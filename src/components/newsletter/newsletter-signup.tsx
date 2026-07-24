"use client"

import { useState, useEffect } from "react"
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "exit"
  className?: string
}

export function NewsletterSignup({ variant = "inline", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setMessage("Thanks! Check your inbox to confirm.")
        setEmail("")
      } else {
        const data = await res.json()
        setStatus("error")
        setMessage(data.error || "Something went wrong. Try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  if (variant === "footer") {
    return (
      <div className={className}>
        <h3 className="font-semibold mb-2 text-sm">Stay informed</h3>
        <p className="text-xs text-muted-foreground mb-3">Get the latest software reviews and research delivered to your inbox.</p>
        {status === "success" ? (
          <div className="flex items-center gap-2 text-xs text-success"><CheckCircle2 size={14} /> {message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Email address for newsletter" required className="flex-1 min-w-0 h-8 px-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
            <button type="submit" disabled={status === "submitting"} className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">{status === "submitting" ? "..." : "Subscribe"}</button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Mail size={16} className="text-primary" />
        <h3 className="font-semibold text-sm">Software insights weekly</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">New reviews, comparisons, and industry analysis every week.</p>
      {status === "success" ? (
        <div className="flex items-center gap-2 text-sm text-success"><CheckCircle2 size={16} /> {message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Email address for newsletter" required className="flex-1 min-w-0 h-9 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
          <button type="submit" disabled={status === "submitting"} className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
            {status === "submitting" ? "..." : <><span>Subscribe</span><ArrowRight size={14} /></>}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-xs text-error mt-1">{message}</p>}
    </div>
  )
}
