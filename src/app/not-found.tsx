import Link from "next/link"
import { Container } from "@/components/ui/container"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"

export const metadata: Metadata = { title: "Page Not Found" }

function LogoMark() {
  return (
    <img src="/logo.svg" alt="" className="h-8 w-8" width={32} height={32} aria-hidden="true" />
  )
}

export default function NotFound() {
  return (
    <Container className="flex flex-1 items-center justify-center py-32">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted-bg">
            <LogoMark />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          This page doesn&apos;t exist. It may have been moved or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="button-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover h-10 px-6 text-sm font-medium transition-all duration-200"
          >
            Go home
          </Link>
          <Link
            href="/reviews"
            className="button-press inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200"
          >
            Browse reviews
          </Link>
        </div>
      </div>
    </Container>
  )
}
