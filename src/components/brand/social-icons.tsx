import { site } from "@/lib/constants"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.949 7.266a1.44 1.44 0 1 1-.002 2.88 1.44 1.44 0 0 1 .002-2.88zm-11.88 0a1.44 1.44 0 1 1-.002 2.88 1.44 1.44 0 0 1 .002-2.88zm6.004 7.56c-1.641 0-3.15-.646-4.274-1.682a.414.414 0 0 1 .578-.592c.91.837 2.281 1.388 3.696 1.388 1.416 0 2.787-.551 3.697-1.388a.414.414 0 1 1 .578.592c-1.124 1.036-2.634 1.682-4.275 1.682zm4.008 1.273a.542.542 0 0 1 .164.373c0 .422-.626.733-1.398.733-.772 0-1.398-.311-1.398-.733 0-.146.06-.282.164-.373-.33-.09-.7-.141-1.082-.146-.48-.007-.952.06-1.384.19a.542.542 0 0 1 .164.373c0 .422-.626.733-1.398.733-.772 0-1.398-.311-1.398-.733 0-.146.06-.283.164-.373-.33-.089-.7-.14-1.082-.146-.802-.013-1.56.15-2.21.454a.542.542 0 0 1 .164-.372c0-.422-.626-.733-1.398-.733-.772 0-1.398.311-1.398.733 0 .422.626.733 1.398.733.261 0 .498-.034.7-.092.415.51 1.11.85 1.9.85.772 0 1.398-.311 1.398-.733 0-.146-.06-.282-.164-.373.31-.085.644-.134.99-.137.48-.007.952.06 1.384.19a.542.542 0 0 1 .164.373c0 .422.626.733 1.398.733.772 0 1.398-.311 1.398-.733 0-.146-.06-.283-.164-.373.817-.223 1.525-.63 2.046-1.145z" />
    </svg>
  )
}

export function SocialHeaderIcons() {
  return (
    <>
      <a
        href={site.links.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
        aria-label="PilotStack on Reddit"
      >
        <RedditIcon className="h-4 w-4" />
      </a>
      <a
        href={site.links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
        aria-label="PilotStack on X"
      >
        <XIcon className="h-4 w-4" />
      </a>
    </>
  )
}

export function SocialFooterIcons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href={site.links.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="PilotStack on Reddit"
      >
        <RedditIcon className="h-4 w-4" />
      </a>
      <a
        href={site.links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="PilotStack on X"
      >
        <XIcon className="h-4 w-4" />
      </a>
    </div>
  )
}

export function SocialLinkList() {
  return (
    <ul className="space-y-3">
      <li>
        <a
          href={site.links.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label="PilotStack on Reddit"
        >
          <RedditIcon className="h-4 w-4 shrink-0" />
          <span>Reddit</span>
        </a>
      </li>
      <li>
        <a
          href={site.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label="PilotStack on X"
        >
          <XIcon className="h-4 w-4 shrink-0" />
          <span>X</span>
        </a>
      </li>
    </ul>
  )
}
