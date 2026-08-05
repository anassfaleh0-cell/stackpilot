"use client"

import { useSyncExternalStore } from "react"
import Script from "next/script"
import { LazyAd } from "./lazy-ad"

const SLIDER_SCRIPT = "https://prizefamily.com/b.XxVxsZduGclv0aYIWWc-/xe/mf9Au/ZbUGlRkSP-TIczyRO/TMAo4vM/TOM/tqNPzYIc5NMDDwgnxxNKy/ZVsfawWw1GpYdCDK0JxR"

function subscribe(callback: () => void) {
  const desktop = window.matchMedia("(min-width: 1024px)")
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  desktop.addEventListener("change", callback)
  motion.addEventListener("change", callback)
  return () => {
    desktop.removeEventListener("change", callback)
    motion.removeEventListener("change", callback)
  }
}

function getSnapshot() {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function HilltopVideoSlider({ id = "hilltop-video-slider" }: { id?: string }) {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, () => false)

  if (!allowed) return null

  return (
    <LazyAd id={id}>
      <Script id={`${id}-script`} strategy="lazyOnload">
        {`(function(x){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=x||{};s.src="${SLIDER_SCRIPT}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`}
      </Script>
    </LazyAd>
  )
}
