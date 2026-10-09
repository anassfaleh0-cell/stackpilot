"use client"

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("pilotstack:open-cookie-settings"))}
      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
    >
      Cookie settings
    </button>
  )
}
