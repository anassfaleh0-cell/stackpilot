"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const COOKIE_CONSENT_KEY = "pilotstack-cookie-consent"

type ConsentState = "accepted" | "declined" | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored)
    } else {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setConsent("accepted")
    setVisible(false)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      })
    }
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setConsent("declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-slide-up"
    >
      <div className="rounded-xl border border-border bg-card p-4 shadow-modal">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xs leading-relaxed text-muted-foreground">
            We use essential cookies for site functionality and analytics cookies (with your consent) to understand how visitors use our site.{" "}
            <a href="/privacy" className="text-primary hover:underline">Learn more</a>.
          </div>
          <button
            onClick={() => setVisible(false)}
            className="shrink-0 h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleAccept}
            className="flex-1 h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 h-8 rounded-lg border border-border text-muted-foreground text-xs font-medium hover:bg-muted-bg transition-colors"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  )
}
