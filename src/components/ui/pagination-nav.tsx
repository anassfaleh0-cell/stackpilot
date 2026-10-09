import Link from "next/link"
import { getPaginationRange, type PaginationResult } from "@/lib/pagination"

export function PaginationNav({ basePath, pagination }: { basePath: string; pagination: PaginationResult }) {
  if (pagination.total === 0) return null
  const href = (page: number) => page <= 1 ? basePath : `${basePath}?page=${page}`
  const range = getPaginationRange(pagination.page, pagination.totalPages)

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{pagination.start + 1}–{pagination.end}</span> of {pagination.total}
      </p>
      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1">
          {pagination.hasPrev && (
            <Link rel="prev" href={href(pagination.page - 1)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted-bg">Previous</Link>
          )}
          {range.map((item, index) => item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className="px-2 py-2 text-sm text-muted-foreground">…</span>
          ) : (
            <Link key={item} href={href(item)} aria-current={item === pagination.page ? "page" : undefined}
              className={item === pagination.page ? "rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white" : "rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted-bg"}>
              {item}
            </Link>
          ))}
          {pagination.hasNext && (
            <Link rel="next" href={href(pagination.page + 1)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted-bg">Next</Link>
          )}
        </div>
      )}
    </nav>
  )
}
