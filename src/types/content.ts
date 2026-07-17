export interface ReviewContent {
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  subcategory?: string
  website?: string
  pricing: PricingTier
  priceRange?: string
  rating: number
  reviewCount: number
  pros: string[]
  cons: string[]
  features: ReviewFeature[]
  ratings: CategoryRating[]
  screenshots?: string[]
  logo?: string
  content: ContentSection[]
  faqs: FAQItem[]
  alternatives: string[]
  relatedGuides: string[]
  relatedComparisons?: string[]
  relatedPosts?: string[]
  lastReviewed: string
  author: string
}

export interface ReviewFeature {
  name: string
  description: string
  available: boolean
  category?: string
}

export interface CategoryRating {
  label: string
  score: number
}

export interface ContentSection {
  title: string
  body: string
  type?: "text" | "list" | "table" | "quote" | "tip" | "warning" | "checklist" | "diagram"
  items?: string[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ComparisonContent {
  slug: string
  title: string
  description: string
  category: string
  tool1: string
  tool2: string
  tool1Slug: string
  tool2Slug: string
  winner: string | null
  features: ComparisonFeature[]
  verdict: string
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides?: string[]
  relatedPosts?: string[]
  lastUpdated: string
}

export interface ComparisonFeature {
  name: string
  tool1: boolean | string
  tool1Detail?: string
  tool2: boolean | string
  tool2Detail?: string
}

export interface GuideContent {
  slug: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  readingTime: number
  sections: GuideSection[]
  author: string
  lastUpdated: string
  relatedTools: string[]
  relatedGuides: string[]
  relatedComparisons?: string[]
  relatedPosts?: string[]
}

export interface GuideSection {
  title: string
  body: string
  type?: "text" | "tip" | "warning" | "list" | "checklist" | "table"
  items?: string[]
  columns?: string[]
  rows?: string[][]
}

export interface BlogContent {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  body: string
  author: string
  publishedAt: string
  updatedAt?: string
  readingTime: number
  relatedPosts: string[]
  relatedGuides?: string[]
  relatedComparisons?: string[]
  relatedGlossary?: string[]
}

export interface GlossaryContent {
  slug: string
  term: string
  description: string
  definition: string
  extendedDefinition: string
  category: string
  examples?: string[]
  relatedTerms: string[]
}

export interface CategoryContent {
  slug: string
  name: string
  description: string
  subcategories: Subcategory[]
  relatedCategories: string[]
}

export interface Subcategory {
  slug: string
  name: string
  description: string
}

export type PricingTier = "Free" | "Freemium" | "Paid" | "Free Trial" | "Contact for Pricing"

export interface PageTemplate {
  name: string
  description: string
  sections: string[]
  seoTemplate: {
    title: string
    description: string
    h1: string
  }
}
