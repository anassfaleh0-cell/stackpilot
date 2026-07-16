import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getPaginationRange } from "@/lib/pagination"

interface PaginationProps {
  basePath: string
  currentPage: number
  totalPages: number
  total: number
}

export function Pagination({ basePath, currentPage, totalPages, total }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-md hover:bg-muted-bg"
        >
          <ChevronLeft size={14} /> Previous
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-muted">...</span>
          ) : (
            <Link
              key={page}
              href={`${basePath}?page=${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex items-center justify-center min-w-[36px] h-9 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? "bg-primary text-white font-medium"
                  : "text-muted hover:text-foreground hover:bg-muted-bg"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-md hover:bg-muted-bg"
        >
          Next <ChevronRight size={14} />
        </Link>
      )}

      <span className="ml-4 text-xs text-muted">
        {total} total
      </span>
    </nav>
  )
}
