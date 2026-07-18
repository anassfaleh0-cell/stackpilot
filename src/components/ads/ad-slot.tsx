"use client"

import { useId } from "react"

const AD_SIZES = {
  "leaderboard": { width: 728, height: 90 },
  "rectangle": { width: 300, height: 250 },
  "skyscraper": { width: 160, height: 600 },
  "large-leaderboard": { width: 970, height: 90 },
  "half-page": { width: 300, height: 600 },
} as const

type AdSize = keyof typeof AD_SIZES

interface AdSlotProps {
  size: AdSize
  className?: string
  slotId?: string
}

export function AdSlot({ size, className = "", slotId }: AdSlotProps) {
  const id = useId()
  const dims = AD_SIZES[size]
  const sid = slotId || `ad-${id}`

  return (
    <div
      id={sid}
      className={className}
      style={{
        width: dims.width,
        height: dims.height,
        minWidth: dims.width,
        minHeight: dims.height,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  )
}
