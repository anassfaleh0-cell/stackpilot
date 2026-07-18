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
  company?: CompanyInfo
}

export interface CompanyInfo {
  founded: number
  headquarters: string
  customers: string
  employeeCount: string
  industries: string[]
  targetUsers: string[]
  pricingModel: string
  deployment: string[]
  securityCertifications: string[]
  compliance: string[]
  integrations: string[]
  apiAvailable: boolean
  aiFeatures: string[]
  mobileApps: string[]
  learningCurve: string
  migrationComplexity: "Low" | "Medium" | "High"
  supportQuality: string
  releaseFrequency: string
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

export interface CategoryKnowledge {
  slug: string
  name: string
  description: string
  longDescription: string
  marketOverview: string
  buyerConsiderations: string[]
  commonMistakes: string[]
  decisionFactors: { factor: string; importance: "Critical" | "High" | "Medium"; description: string }[]
  buyerJourney: {
    awareness: string
    consideration: string
    decision: string
  }
  pricingOverview: string
  bestFor: {
    smb: string
    enterprise: string
    free: string
  }
  relatedCategories: string[]
  internalLinks?: { label: string; href: string }[]
  faqs: FAQItem[]
}

export interface AlternativeContent {
  slug: string
  title: string
  description: string
  category: string
  toolSlug: string
  toolName: string
  alternatives: { slug: string; name: string; rating: number; description: string }[]
  sections: ContentSection[]
  selectionCriteria: string[]
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides?: string[]
  relatedPosts?: string[]
  lastUpdated: string
}

export interface UseCaseContent {
  slug: string
  title: string
  description: string
  category: string
  useCase: string
  useCaseDescription: string
  recommendations: { toolSlug: string; toolName: string; rating: number; bestFor: string; keyFeatures: string[] }[]
  selectionCriteria: { factor: string; importance: "Critical" | "High" | "Medium"; description: string }[]
  commonPitfalls: string[]
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides?: string[]
  lastUpdated: string
}

export interface IndustryContent {
  slug: string
  title: string
  description: string
  industry: string
  industryOverview: string
  softwareNeeds: string[]
  recommendations: { category: string; toolSlug: string; toolName: string; rating: number; bestFor: string }[]
  implementationTips: string[]
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides?: string[]
  lastUpdated: string
}

export interface ResearchContent {
  slug: string
  title: string
  description: string
  category: "Pricing" | "Adoption" | "Market Share" | "Productivity" | "Security" | "AI" | "Benchmark" | "Trends"
  reportType: string
  keyFindings: string[]
  sections: ContentSection[]
  methodology: string
  dataSources: { name: string; url: string }[]
  publishedAt: string
  updatedAt?: string
  author: string
  readingTime: number
  relatedComparisons?: string[]
  relatedGuides?: string[]
  relatedPosts?: string[]
}

export interface StatisticContent {
  slug: string
  title: string
  description: string
  category: string
  stats: { value: string; label: string; source: string; sourceUrl?: string }[]
  sections: { title: string; stats: { value: string; label: string; source: string; sourceUrl?: string }[]; body?: string }[]
  publishedAt: string
  updatedAt?: string
  relatedComparisons?: string[]
  relatedGuides?: string[]
}

export interface BestContent {
  slug: string
  title: string
  description: string
  category: string
  criteria: string[]
  picks: { rank: number; toolSlug: string; toolName: string; rating: number; priceRange: string; bestFor: string; pros: string[]; cons: string[] }[]
  pricingSummary: string
  comparisonTable: { columns: string[]; rows: string[][] }
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides: string[]
  relatedPosts: string[]
  lastUpdated: string
  author: string
}

export interface HubContent {
  slug: string
  title: string
  description: string
  audience: string
  challenges: string[]
  recommendations: { category: string; toolSlug: string; toolName: string; rating: number; bestFor: string }[]
  comparisonMatrix: { columns: string[]; rows: string[][] }
  faqs: FAQItem[]
  relatedComparisons: string[]
  relatedGuides: string[]
  relatedPosts: string[]
  lastUpdated: string
}

export interface Subcategory {
  slug: string
  name: string
  description: string
}

export type PricingTier = "Free" | "Freemium" | "Paid" | "Free Trial" | "Contact for Pricing"

export interface EntityLink {
  slug: string
  name: string
  type: "review" | "comparison" | "guide" | "blog" | "glossary"
  relation: string
}

export interface EntityNode {
  slug: string
  name: string
  type: "software" | "category" | "concept"
  relationships: EntityRelationship[]
}

export interface EntityRelationship {
  targetSlug: string
  targetType: string
  relation: string
}
