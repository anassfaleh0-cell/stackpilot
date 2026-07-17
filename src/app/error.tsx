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
        <p className="text-muted mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white h-10 px-6 text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground h-10 px-6 text-sm font-medium hover:bg-muted transition-colors">
            Go home
          </Link>
          <Link href="/reviews" className="inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground h-10 px-6 text-sm font-medium hover:bg-muted transition-colors">
            Browse reviews
          </Link>
        </div>
      </div>
    </div>
  )
}
