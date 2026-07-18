"use client"

import { useState, useEffect } from "react"

const COOKIE_CONSENT_KEY = "pilotstack-cookie-consent"

type ConsentChoice = "accepted" | "declined" | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentChoice>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
    setConsent(stored)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setConsent("accepted")
    setVisible(false)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
      })
    }
  }

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setConsent("declined")
    setVisible(false)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      })
    }
  }

  if (!visible || consent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6" role="dialog" aria-label="Cookie consent">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card shadow-elevated p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">Privacy Preference</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies for site functionality and analytics cookies (anonymized) to understand how visitors use our site. We never sell your data.{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="rounded-lg border border-border bg-transparent hover:bg-muted-bg h-9 px-4 text-xs font-medium transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="rounded-lg bg-primary text-white hover:bg-primary-dark h-9 px-4 text-xs font-medium transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
