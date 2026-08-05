"use client"

import { useRef } from "react"
import { LazyAd } from "./lazy-ad"

const BANNER_SCRIPT = "https://prizefamily.com/bwXyVos.dKGmlo0rY/WDcb/tehm-9cuyZXU/ljkBPmT/clymOkT-Av3INkj-U/tAN/zqIE5hM/D/c/2ROUQx"

export function HilltopBanner({ id = "hilltop-banner" }: { id?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  return (
    <LazyAd
      id={id}
      className="ad-slot flex justify-center"
      onVisible={() => {
        const host = hostRef.current
        if (!host || mountedRef.current) return
        mountedRef.current = true
        const s = document.createElement("script") as HTMLScriptElement & {
          settings?: Record<string, unknown>
        }
        s.settings = { appendTo: `#${id}`, options: { uniqueID: `${id}-unit` } }
        s.async = true
        s.referrerPolicy = "no-referrer-when-downgrade"
        s.src = BANNER_SCRIPT
        host.appendChild(s)
      }}
    >
      <div ref={hostRef} />
    </LazyAd>
  )
}
