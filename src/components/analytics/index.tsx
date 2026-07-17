"use client"

import { useEffect } from "react"

export function Analytics() {
  useEffect(() => {
    const consent = localStorage.getItem("stackpilot-cookie-consent")
    if (consent !== "accepted") return

    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (gaId && !document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
      const script = document.createElement("script")
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      script.async = true
      document.head.appendChild(script)

      const inline = document.createElement("script")
      inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,link_attribution:true});`
      document.head.appendChild(inline)
    }

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
    if (clarityId && !document.querySelector(`script[src*="clarity.ms"]`)) {
      const script = document.createElement("script")
      script.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarityId}');`
      document.head.appendChild(script)
    }
  }, [])

  return null
}
