import type { CategoryKnowledge } from "@/types/content"
import fs from "node:fs"
import path from "node:path"

const CATEGORY_DIR = path.resolve(process.cwd(), "content/categories")

export function getCategoryKnowledge(slug: string): CategoryKnowledge | null {
  const file = path.join(CATEGORY_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, "utf-8")
  return JSON.parse(raw) as CategoryKnowledge
}
