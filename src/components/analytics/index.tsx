"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-WZ6LVYH8ML"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    clarity?: (...args: unknown[]) => void
  }
}

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return
    window.gtag("config", GA_ID, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

export function GAScript() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}

          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });

          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            link_attribution: true
          });
        `}
      </Script>
    </>
  )
}
