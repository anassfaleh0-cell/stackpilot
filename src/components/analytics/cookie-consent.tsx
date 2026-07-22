"use client"

import { useState, useEffect, useRef } from "react"

const COOKIE_CONSENT_KEY = "pilotstack-cookie-consent"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-WZ6LVYH8ML"
const CLARITY_ID = "xooildcs2r"

type ConsentPrefs = {
  analytics: boolean
  advertising: boolean
}

const ALL_ON: ConsentPrefs = { analytics: true, advertising: true }
const ALL_OFF: ConsentPrefs = { analytics: false, advertising: false }

function getStoredPrefs(): { accepted: boolean; prefs: ConsentPrefs } | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.accepted !== undefined && parsed?.prefs) return parsed
    if (parsed === "accepted") return { accepted: true, prefs: ALL_ON }
    if (parsed === "declined") return { accepted: false, prefs: ALL_OFF }
    return null
  } catch {
    return null
  }
}

function updateConsent(prefs: ConsentPrefs) {
  if (typeof window.gtag !== "function") return
  window.gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.advertising ? "granted" : "denied",
    ad_user_data: prefs.advertising ? "granted" : "denied",
    ad_personalization: prefs.advertising ? "granted" : "denied",
  })
}

function injectGAScript() {
  if (document.getElementById("ga-gtag")) return
  const s = document.createElement("script")
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  s.async = true
  s.id = "ga-gtag"
  s.onload = () => {
    if (typeof window.gtag === "function") {
      window.gtag("js", new Date())
      window.gtag("config", GA_ID, {
        send_page_view: true,
        anonymize_ip: true,
        link_attribution: true,
      })
    }
  }
  document.head.appendChild(s)
}

function injectClarityScript() {
  if (document.getElementById("clarity-dynamic")) return
  const s = document.createElement("script")
  s.id = "clarity-dynamic"
  s.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`
  document.head.appendChild(s)
}

function injectScripts(prefs: ConsentPrefs) {
  if (prefs.analytics) {
    injectGAScript()
    injectClarityScript()
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [draft, setDraft] = useState<ConsentPrefs>(ALL_OFF)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = getStoredPrefs()
    if (stored) {
      updateConsent(stored.prefs)
      if (stored.accepted) {
        injectScripts(stored.prefs)
      }
    } else {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const firstBtn = dialogRef.current?.querySelector<HTMLButtonElement>("button")
      firstBtn?.focus()
    }
  }, [visible])

  function handleAccept() {
    const prefs = ALL_ON
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: true, prefs }))
    updateConsent(prefs)
    injectScripts(prefs)
    setVisible(false)
  }

  function handleReject() {
    const prefs = ALL_OFF
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: false, prefs }))
    updateConsent(prefs)
    setVisible(false)
  }

  function handleCustomizeSave() {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: true, prefs: draft }))
    updateConsent(draft)
    injectScripts(draft)
    setVisible(false)
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
        {!customizing ? (
          <>
            <div className="text-xs leading-relaxed text-muted-foreground">
              We use essential cookies for site functionality. We also use analytics cookies to understand how visitors use our site.{" "}
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
                onClick={() => { setCustomizing(true); setDraft(ALL_OFF) }}
                className="h-10 px-3 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:bg-muted-bg transition-colors"
              >
                Customize
              </button>
              <button
                onClick={handleReject}
                className="flex-1 h-10 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:bg-muted-bg transition-colors"
              >
                Reject All
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-medium mb-3">Cookie Preferences</div>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 text-xs text-muted-foreground">
                <input type="checkbox" checked disabled className="accent-primary size-3.5" />
                <span>Essential (Functional) — Always required</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(e) => setDraft((p) => ({ ...p, analytics: e.target.checked }))}
                  className="accent-primary size-3.5"
                />
                <span>Analytics (GA4, Clarity) — Helps us improve</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-muted-foreground opacity-50">
                <input type="checkbox" disabled className="accent-primary size-3.5" />
                <span>Advertising — Coming soon</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCustomizeSave}
                className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setCustomizing(false)}
                className="h-10 px-3 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:bg-muted-bg transition-colors"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
