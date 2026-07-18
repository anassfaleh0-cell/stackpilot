"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ""
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || ""

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    window.gtag("config", GA_ID, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export function GAScript() {
  if (!GA_ID) return null
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
        }}
      />
    </>
  )
}

export function ClarityScript() {
  if (!CLARITY_ID) return null
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  )
}
