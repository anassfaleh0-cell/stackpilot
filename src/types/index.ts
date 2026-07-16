export interface Tool {
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  website: string
  pricing: "Free" | "Freemium" | "Paid" | "Free Trial"
  priceRange?: string
  rating: number
  reviewCount: number
  pros: string[]
  cons: string[]
  features: Feature[]
  alternatives: string[]
  screenshots?: string[]
  logo?: string
}

export interface Feature {
  name: string
  description: string
  available: boolean
}

export interface Comparison {
  slug: string
  title: string
  description: string
  tools: [string, string]
  category: string
  winner?: string
  readingTime: number
}

export interface Guide {
  slug: string
  title: string
  description: string
  category: string
  readingTime: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  sections: string[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  author: string
  publishedAt: string
  updatedAt?: string
  readingTime: number
  tags: string[]
}

export interface GlossaryTerm {
  slug: string
  term: string
  definition: string
  category: string
  relatedTerms: string[]
}

export interface Category {
  name: string
  slug: string
  count: number
}
