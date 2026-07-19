"use client"

import dynamic from "next/dynamic"
import Script from "next/script"

const CookieConsent = dynamic(() => import("@/components/analytics/cookie-consent").then((m) => ({ default: m.CookieConsent })), { ssr: false })

const ReadingProgress = dynamic(() => import("@/components/layout/reading-progress").then((m) => ({ default: m.ReadingProgress })), { ssr: false })

const Analytics = dynamic(() => import("@/components/analytics").then((m) => ({ default: m.Analytics })), { ssr: false })

export function ClientLayout() {
  return (
    <>
      <ReadingProgress />
      <CookieConsent />
      <Analytics />
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="261263"
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </>
  )
}