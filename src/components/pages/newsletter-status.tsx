"use client"

import { useEffect, useState } from "react"

export function NewsletterStatus() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setVisible(
      params.get("error") === "newsletter-unavailable" ||
      params.get("subscribed") === "true",
    )
  }, [])

  if (!visible) return null

  return (
    <p role="status" className="mb-4 rounded-lg border border-border bg-muted-bg p-3 text-sm text-muted-foreground">
      Newsletter signup is not configured yet, so no subscription was saved. For now, please email{" "}
      <a href="mailto:contact@pilotstack.online" className="font-medium text-primary hover:underline">
        contact@pilotstack.online
      </a>{" "}
      if you would like to ask about updates.
    </p>
  )
}
