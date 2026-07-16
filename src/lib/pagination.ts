export interface PaginationParams {
  page: number
  perPage: number
  total: number
}

export interface PaginationResult {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  start: number
  end: number
}

export function getPagination(params: PaginationParams): PaginationResult {
  const { page, perPage, total } = params
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const start = (safePage - 1) * perPage
  const end = Math.min(start + perPage, total)

  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    start,
    end,
  }
}

export function getPaginationRange(current: number, totalPages: number, delta = 2): (number | "ellipsis")[] {
  if (totalPages <= 1) return [1]

  const range: (number | "ellipsis")[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(totalPages - 1, current + delta)

  range.push(1)
  if (left > 2) range.push("ellipsis")
  for (let i = left; i <= right; i++) range.push(i)
  if (right < totalPages - 1) range.push("ellipsis")
  if (totalPages > 1) range.push(totalPages)

  return range
}
