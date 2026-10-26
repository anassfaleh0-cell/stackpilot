import Link from "next/link"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Crosshair, Shield } from "lucide-react"

export interface ComparisonGridItem {
  slug: string
  title: string
  category: string
  winner?: string | null
  winnerStatus?: "verified" | "provisional" | "recorded"
  description: string
}

export function ComparisonGrid({ items }: { items: ComparisonGridItem[] }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((cmp) => (
          <Link key={cmp.slug} href={`/comparisons/${cmp.slug}`} className="group card-hover">
            <Card className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary">{cmp.category}</Badge>
                {cmp.winner ? (
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <Shield size={12} /> {cmp.winnerStatus === "verified"
                      ? `${cmp.winner} wins`
                      : cmp.winnerStatus === "provisional"
                        ? `${cmp.winner} · provisional pick`
                        : `${cmp.winner} · recorded pick, verify category fit`}
                  </span>
                ) : (
                  <Crosshair size={16} className="text-muted-foreground" />
                )}
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">{cmp.title}</CardTitle>
              <CardDescription className="mt-1.5">{cmp.description}</CardDescription>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                View comparison <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
