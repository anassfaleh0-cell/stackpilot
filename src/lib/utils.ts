import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return typeof date === "string" ? date : ""
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function toISODate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toISOString().slice(0, 10)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str
  const trimmed = str.slice(0, maxLength)
  const lastSpace = trimmed.lastIndexOf(" ")
  if (lastSpace < 1) return trimmed + "..."
  return trimmed.slice(0, lastSpace) + "..."
}

export function truncateDesc(str: string, maxLength: number = 160) {
  return truncate(str, maxLength)
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.pilotstack.online"}${path}`
}
