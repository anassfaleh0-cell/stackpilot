"use client"

import { site } from "@/lib/constants"

function XShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

export function SocialShare({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">Share</span>
      <a
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Share on X"
      >
        <XShareIcon />
      </a>
    </div>
  )
}
