"use client"

import Script from "next/script"
import { LazyAd } from "./lazy-ad"

const BANNER_SCRIPT = "https://prizefamily.com/bwXyVos.dKGmlo0rY/WDcb/tehm-9cuyZXU/ljkBPmT/clymOkT-Av3INkj-U/tAN/zqIE5hM/D/c/2ROUQx"

export function HilltopBanner({ id = "hilltop-banner" }: { id?: string }) {
  return (
    <LazyAd id={id} minHeight={250} className="ad-slot flex justify-center">
      <Script id={`${id}-script`} strategy="lazyOnload">
        {`(function(x){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=x||{};s.src="${BANNER_SCRIPT}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`}
      </Script>
    </LazyAd>
  )
}
