"use client"

import { useState, useEffect, useRef } from "react"

const COOKIE_CONSENT_KEY = "pilotstack-cookie-consent"

type ConsentState = "accepted" | "declined" | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null)
  const [visible, setVisible] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored)
    } else {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const acceptBtn = dialogRef.current?.querySelector<HTMLButtonElement>("button:first-of-type")
      acceptBtn?.focus()
    }
  }, [visible])

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setConsent("accepted")
    setVisible(false)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      })
    }
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setConsent("declined")
    setVisible(false)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      })
    }
  }

  if (!visible) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-slide-up"
    >
      <div className="rounded-xl border border-border bg-card p-4 shadow-modal">
        <div className="text-xs leading-relaxed text-muted-foreground">
          We use essential cookies for site functionality and analytics cookies to understand how visitors use our site.{" "}
          <a href="/privacy" className="text-primary hover:underline">Learn more</a>.
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleAccept}
            className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 h-10 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:bg-muted-bg transition-colors"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  )
}
