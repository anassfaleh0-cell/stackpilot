export interface AdPlacement {
  name: string
  location: "above-fold" | "below-fold" | "in-content" | "sidebar" | "footer" | "between-sections"
  containerSelector?: string
  afterElement?: string
  beforeElement?: string
  recommendedFormat: "banner" | "native" | "in-feed" | "anchor"
  maxWidth?: number
  maxHeight?: number
  priority: "high" | "medium" | "low"
  notes: string
}

export interface PageAdProfile {
  pageType: string
  placements: AdPlacement[]
}

export const adPlacements: Record<string, PageAdProfile> = {
  home: {
    pageType: "Homepage",
    placements: [
      {
        name: "Below hero banner",
        location: "below-fold",
        afterElement: ".home-hero",
        recommendedFormat: "banner",
        maxWidth: 728,
        maxHeight: 90,
        priority: "high",
        notes: "Visible after hero section, above featured reviews. Standard leaderboard. No CLS impact if height is reserved.",
      },
      {
        name: "Between reviews and guides",
        location: "between-sections",
        containerSelector: ".home-content",
        recommendedFormat: "native",
        maxWidth: 300,
        maxHeight: 250,
        priority: "medium",
        notes: "Between content sections. Medium rectangle. Natural break point.",
      },
    ],
  },
  review: {
    pageType: "Review Detail",
    placements: [
      {
        name: "Sidebar below verdict",
        location: "sidebar",
        afterElement: ".verdict-card",
        recommendedFormat: "native",
        maxWidth: 300,
        maxHeight: 250,
        priority: "high",
        notes: "In sticky sidebar below the verdict/rating. Non-intrusive, visible during scroll. Reserve height to avoid CLS.",
      },
      {
        name: "After FAQ section",
        location: "below-fold",
        afterElement: "#faq",
        recommendedFormat: "banner",
        maxWidth: 728,
        maxHeight: 90,
        priority: "medium",
        notes: "After FAQ, before related content. Natural end-of-content placement.",
      },
      {
        name: "In-content between sections",
        location: "in-content",
        containerSelector: ".review-content",
        recommendedFormat: "in-feed",
        maxWidth: 728,
        maxHeight: 90,
        priority: "low",
        notes: "Between 2nd and 3rd content section. Must reserve height. Use only if content has 4+ sections.",
      },
    ],
  },
  category: {
    pageType: "Category Listing",
    placements: [
      {
        name: "After best pick, before grid",
        location: "between-sections",
        afterElement: ".best-pick",
        recommendedFormat: "banner",
        maxWidth: 728,
        maxHeight: 90,
        priority: "high",
        notes: "Between featured pick and review grid. Natural content transition.",
      },
    ],
  },
  comparison: {
    pageType: "Comparison Detail",
    placements: [
      {
        name: "After verdict card",
        location: "sidebar",
        afterElement: ".comparison-verdict",
        recommendedFormat: "native",
        maxWidth: 300,
        maxHeight: 250,
        priority: "medium",
        notes: "In sidebar area, below summary stats.",
      },
    ],
  },
  guide: {
    pageType: "Guide Detail",
    placements: [
      {
        name: "In-content mid-article",
        location: "in-content",
        containerSelector: ".guide-content",
        recommendedFormat: "in-feed",
        maxWidth: 728,
        maxHeight: 90,
        priority: "low",
        notes: "Only if guide has 4+ sections. Reserve space to prevent CLS.",
      },
    ],
  },
  blog: {
    pageType: "Blog Detail",
    placements: [
      {
        name: "In-content mid-article",
        location: "in-content",
        containerSelector: ".blog-content",
        recommendedFormat: "in-feed",
        maxWidth: 728,
        maxHeight: 90,
        priority: "low",
        notes: "Only for posts with 800+ words. Reserve container height.",
      },
    ],
  },
  listing: {
    pageType: "Listing Page",
    placements: [
      {
        name: "After section header",
        location: "between-sections",
        afterElement: ".listing-header",
        recommendedFormat: "banner",
        maxWidth: 728,
        maxHeight: 90,
        priority: "medium",
        notes: "Between page title/description and first card. Standard leaderboard.",
      },
    ],
  },
}

