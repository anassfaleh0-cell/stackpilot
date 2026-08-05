"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

const PUSH_SCRIPT = "https://prizefamily.com/b/XXVvs.dDGDlU0SYRW/cw/neQma9Ku/ZyUClRkgPDTlcLyWOsT/A-3ROsDZEWtGNizjIr5-MvDgc/4GNhQy"

export function HilltopPush() {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const arm = () => setArmed(true)
    const timer = window.setTimeout(arm, 5000)
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const
    events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, arm))
    }
  }, [])

  if (!armed) return null

  return (
    <Script id="hilltop-push" strategy="lazyOnload">
      {`(function(x){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=x||{};s.src="${PUSH_SCRIPT}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`}
    </Script>
  )
}
