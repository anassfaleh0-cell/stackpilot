"use client"

import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-32 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-subtle text-error text-2xl font-bold">
            !
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="button-press inline-flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark shadow-button h-10 px-6 text-sm font-medium transition-all duration-200"
          >
            Try again
          </button>
          <Link href="/" className="button-press inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground h-10 px-6 text-sm font-medium hover:bg-muted-bg transition-all duration-200">
            Go home
          </Link>
          <Link href="/reviews" className="button-press inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground h-10 px-6 text-sm font-medium hover:bg-muted-bg transition-all duration-200">
            Browse reviews
          </Link>
        </div>
      </div>
    </div>
  )
}
