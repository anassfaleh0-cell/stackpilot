export interface EditorialPalette {
  primary: string
  secondary: string
  accent: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
  glassBg: string
  glassBorder: string
  subtle1: string
  subtle2: string
  dotColor: string
  glowColor: string
}

const palettes: Record<string, EditorialPalette> = {
  "AI & Machine Learning": {
    primary: "#6366F1", secondary: "#818CF8", accent: "#A5B4FC",
    gradientFrom: "#EEF2FF", gradientVia: "#E0E7FF", gradientTo: "#C7D2FE",
    glassBg: "rgba(99,102,241,0.06)", glassBorder: "rgba(99,102,241,0.15)",
    subtle1: "rgba(99,102,241,0.08)", subtle2: "rgba(99,102,241,0.04)",
    dotColor: "#6366F1", glowColor: "#A5B4FC",
  },
  "Project Management": {
    primary: "#0EA5E9", secondary: "#38BDF8", accent: "#7DD3FC",
    gradientFrom: "#F0F9FF", gradientVia: "#E0F2FE", gradientTo: "#BAE6FD",
    glassBg: "rgba(14,165,233,0.06)", glassBorder: "rgba(14,165,233,0.15)",
    subtle1: "rgba(14,165,233,0.08)", subtle2: "rgba(14,165,233,0.04)",
    dotColor: "#0EA5E9", glowColor: "#7DD3FC",
  },
  "CRM & Sales": {
    primary: "#10B981", secondary: "#34D399", accent: "#6EE7B7",
    gradientFrom: "#ECFDF5", gradientVia: "#D1FAE5", gradientTo: "#A7F3D0",
    glassBg: "rgba(16,185,129,0.06)", glassBorder: "rgba(16,185,129,0.15)",
    subtle1: "rgba(16,185,129,0.08)", subtle2: "rgba(16,185,129,0.04)",
    dotColor: "#10B981", glowColor: "#6EE7B7",
  },
  "Marketing & SEO": {
    primary: "#F59E0B", secondary: "#FBBF24", accent: "#FCD34D",
    gradientFrom: "#FFFBEB", gradientVia: "#FEF3C7", gradientTo: "#FDE68A",
    glassBg: "rgba(245,158,11,0.06)", glassBorder: "rgba(245,158,11,0.15)",
    subtle1: "rgba(245,158,11,0.08)", subtle2: "rgba(245,158,11,0.04)",
    dotColor: "#F59E0B", glowColor: "#FCD34D",
  },
  "Design & Creative": {
    primary: "#EC4899", secondary: "#F472B6", accent: "#F9A8D4",
    gradientFrom: "#FDF2F8", gradientVia: "#FCE7F3", gradientTo: "#FBCFE8",
    glassBg: "rgba(236,72,153,0.06)", glassBorder: "rgba(236,72,153,0.15)",
    subtle1: "rgba(236,72,153,0.08)", subtle2: "rgba(236,72,153,0.04)",
    dotColor: "#EC4899", glowColor: "#F9A8D4",
  },
  "Developer Tools": {
    primary: "#8B5CF6", secondary: "#A78BFA", accent: "#C4B5FD",
    gradientFrom: "#F5F3FF", gradientVia: "#EDE9FE", gradientTo: "#DDD6FE",
    glassBg: "rgba(139,92,246,0.06)", glassBorder: "rgba(139,92,246,0.15)",
    subtle1: "rgba(139,92,246,0.08)", subtle2: "rgba(139,92,246,0.04)",
    dotColor: "#8B5CF6", glowColor: "#C4B5FD",
  },
  "Analytics & Data": {
    primary: "#06B6D4", secondary: "#22D3EE", accent: "#67E8F9",
    gradientFrom: "#ECFEFF", gradientVia: "#CFFAFE", gradientTo: "#A5F3FC",
    glassBg: "rgba(6,182,212,0.06)", glassBorder: "rgba(6,182,212,0.15)",
    subtle1: "rgba(6,182,212,0.08)", subtle2: "rgba(6,182,212,0.04)",
    dotColor: "#06B6D4", glowColor: "#67E8F9",
  },
  "HR & People": {
    primary: "#F97316", secondary: "#FB923C", accent: "#FDBA74",
    gradientFrom: "#FFF7ED", gradientVia: "#FFEDD5", gradientTo: "#FED7AA",
    glassBg: "rgba(249,115,22,0.06)", glassBorder: "rgba(249,115,22,0.15)",
    subtle1: "rgba(249,115,22,0.08)", subtle2: "rgba(249,115,22,0.04)",
    dotColor: "#F97316", glowColor: "#FDBA74",
  },
  "Finance & Accounting": {
    primary: "#059669", secondary: "#10B981", accent: "#34D399",
    gradientFrom: "#ECFDF5", gradientVia: "#D1FAE5", gradientTo: "#A7F3D0",
    glassBg: "rgba(5,150,105,0.06)", glassBorder: "rgba(5,150,105,0.15)",
    subtle1: "rgba(5,150,105,0.08)", subtle2: "rgba(5,150,105,0.04)",
    dotColor: "#059669", glowColor: "#34D399",
  },
  "Productivity": {
    primary: "#6366F1", secondary: "#818CF8", accent: "#A5B4FC",
    gradientFrom: "#EEF2FF", gradientVia: "#E0E7FF", gradientTo: "#C7D2FE",
    glassBg: "rgba(99,102,241,0.06)", glassBorder: "rgba(99,102,241,0.15)",
    subtle1: "rgba(99,102,241,0.08)", subtle2: "rgba(99,102,241,0.04)",
    dotColor: "#6366F1", glowColor: "#A5B4FC",
  },
  "Security & Compliance": {
    primary: "#DC2626", secondary: "#EF4444", accent: "#FCA5A5",
    gradientFrom: "#FEF2F2", gradientVia: "#FEE2E2", gradientTo: "#FECACA",
    glassBg: "rgba(220,38,38,0.06)", glassBorder: "rgba(220,38,38,0.15)",
    subtle1: "rgba(220,38,38,0.08)", subtle2: "rgba(220,38,38,0.04)",
    dotColor: "#DC2626", glowColor: "#FCA5A5",
  },
  "Communication": {
    primary: "#14B8A6", secondary: "#2DD4BF", accent: "#5EEAD4",
    gradientFrom: "#F0FDFA", gradientVia: "#CCFBF1", gradientTo: "#99F6E4",
    glassBg: "rgba(20,184,166,0.06)", glassBorder: "rgba(20,184,166,0.15)",
    subtle1: "rgba(20,184,166,0.08)", subtle2: "rgba(20,184,166,0.04)",
    dotColor: "#14B8A6", glowColor: "#5EEAD4",
  },
}

const defaultPalette: EditorialPalette = {
  primary: "#6366F1", secondary: "#818CF8", accent: "#A5B4FC",
  gradientFrom: "#EEF2FF", gradientVia: "#E0E7FF", gradientTo: "#C7D2FE",
  glassBg: "rgba(99,102,241,0.06)", glassBorder: "rgba(99,102,241,0.15)",
  subtle1: "rgba(99,102,241,0.08)", subtle2: "rgba(99,102,241,0.04)",
  dotColor: "#6366F1", glowColor: "#A5B4FC",
}

export function getPalette(category: string): EditorialPalette {
  return palettes[category] || defaultPalette
}
