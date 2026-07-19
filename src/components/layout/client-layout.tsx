"use client"

import dynamic from "next/dynamic"

const CookieConsent = dynamic(() => import("@/components/analytics/cookie-consent").then((m) => ({ default: m.CookieConsent })), { ssr: false })

const ReadingProgress = dynamic(() => import("@/components/layout/reading-progress").then((m) => ({ default: m.ReadingProgress })), { ssr: false })

const Analytics = dynamic(() => import("@/components/analytics").then((m) => ({ default: m.Analytics })), { ssr: false })

export function ClientLayout() {
  return (
    <>
      <ReadingProgress />
      <CookieConsent />
      <Analytics />
    </>
  )
}