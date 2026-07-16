import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"

export const metadata: Metadata = { title: "Page Not Found | StackPilot" }

export default function NotFound() {
  return (
    <Container className="flex flex-1 items-center justify-center py-32">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted-bg">
            <Compass size={32} className="text-muted" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-lg text-muted mb-8">
          This page doesn&apos;t exist. It may have been moved or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-10 px-6 text-sm font-medium transition-all duration-200"
          >
            Go home
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200"
          >
            Browse reviews
          </Link>
        </div>
      </div>
    </Container>
  )
}
