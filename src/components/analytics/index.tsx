"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-WZ6LVYH8ML"
const CLARITY_ID = "xooildcs2r"

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

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      if (!link?.href) return
      const isAffiliate = link.rel === "nofollow" || link.href.includes("affiliate") || link.href.includes("ref=") || link.href.includes("tag=")
      const isOutbound = link.hostname !== window.location.hostname
      if (isAffiliate && window.gtag) {
        window.gtag("event", "affiliate_click", { affiliate_url: link.href, link_text: link.textContent?.slice(0, 100) })
      }
      if (isOutbound && window.gtag) {
        window.gtag("event", "outbound_click", { outbound_url: link.href, link_text: link.textContent?.slice(0, 100) })
      }
    }
    document.addEventListener("click", handler, { passive: true })
    return () => document.removeEventListener("click", handler)
  }, [])

  return null
}

export function ClarityScript() {
  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  )
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
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });

          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
            anonymize_ip: true,
            link_attribution: true
          });
        `}
      </Script>
    </>
  )
}
