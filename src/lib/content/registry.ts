import type { ReviewContent, ComparisonContent, GuideContent, GlossaryContent, BlogContent, CategoryKnowledge } from "@/types/content"
import fs from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.resolve(process.cwd(), "content")

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as T
}

function readDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  } catch {
    return []
  }
}

export function getReview(slug: string): ReviewContent | null {
  const file = path.join(CONTENT_DIR, "reviews", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<ReviewContent>(file)
}

export function getAllReviews(): ReviewContent[] {
  return readDir(path.join(CONTENT_DIR, "reviews"))
    .map((f) => readJson<ReviewContent>(path.join(CONTENT_DIR, "reviews", f)))
    .sort((a, b) => b.rating - a.rating)
}

export function getComparison(slug: string): ComparisonContent | null {
  const file = path.join(CONTENT_DIR, "comparisons", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<ComparisonContent>(file)
}

export function getAllComparisons(): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .map((f) => readJson<ComparisonContent>(path.join(CONTENT_DIR, "comparisons", f)))
}

export function getGuide(slug: string): GuideContent | null {
  const file = path.join(CONTENT_DIR, "guides", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<GuideContent>(file)
}

export function getAllGuides(): GuideContent[] {
  return readDir(path.join(CONTENT_DIR, "guides"))
    .map((f) => readJson<GuideContent>(path.join(CONTENT_DIR, "guides", f)))
}

export function getGlossaryTerm(slug: string): GlossaryContent | null {
  const file = path.join(CONTENT_DIR, "glossary", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<GlossaryContent>(file)
}

export function getAllGlossaryTerms(): GlossaryContent[] {
  return readDir(path.join(CONTENT_DIR, "glossary"))
    .map((f) => readJson<GlossaryContent>(path.join(CONTENT_DIR, "glossary", f)))
    .sort((a, b) => a.term.localeCompare(b.term))
}

export function getBlogPost(slug: string): BlogContent | null {
  const file = path.join(CONTENT_DIR, "blog", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<BlogContent>(file)
}

export function getAllBlogPosts(): BlogContent[] {
  return readDir(path.join(CONTENT_DIR, "blog"))
    .map((f) => readJson<BlogContent>(path.join(CONTENT_DIR, "blog", f)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getCategory(slug: string): CategoryKnowledge | null {
  const file = path.join(CONTENT_DIR, "categories", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<CategoryKnowledge>(file)
}

export function getAllCategories(): CategoryKnowledge[] {
  return readDir(path.join(CONTENT_DIR, "categories"))
    .map((f) => readJson<CategoryKnowledge>(path.join(CONTENT_DIR, "categories", f)))
}

export function getContentTitle(type: string, slug: string): string | null {
  switch (type) {
    case "review": return getReview(slug)?.name ?? null
    case "comparison": return getComparison(slug)?.title ?? null
    case "guide": return getGuide(slug)?.title ?? null
    case "blog": return getBlogPost(slug)?.title ?? null
    case "glossary": return getGlossaryTerm(slug)?.term ?? null
    default: return null
  }
}

export function searchContent(query: string): {
  reviews: ReviewContent[]
  comparisons: ComparisonContent[]
  guides: GuideContent[]
  glossary: GlossaryContent[]
  blog: BlogContent[]
} {
  const q = query.toLowerCase()
  const match = (text: string) => text.toLowerCase().includes(q)
  return {
    reviews: getAllReviews().filter((r) => match(r.name) || match(r.description)),
    comparisons: getAllComparisons().filter((c) => match(c.title) || match(c.description)),
    guides: getAllGuides().filter((g) => match(g.title) || match(g.description)),
    glossary: getAllGlossaryTerms().filter((t) => match(t.term) || match(t.definition)),
    blog: getAllBlogPosts().filter((b) => match(b.title) || match(b.description)),
  }
}
