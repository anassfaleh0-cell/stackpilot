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
    primary: "#5472E8", secondary: "#7C93F5", accent: "#A5B5F9",
    gradientFrom: "rgba(84,114,232,0.06)", gradientVia: "rgba(84,114,232,0.04)", gradientTo: "rgba(84,114,232,0.02)",
    glassBg: "rgba(84,114,232,0.06)", glassBorder: "rgba(84,114,232,0.12)",
    subtle1: "rgba(84,114,232,0.08)", subtle2: "rgba(84,114,232,0.04)",
    dotColor: "#5472E8", glowColor: "#A5B5F9",
  },
  "Project Management": {
    primary: "#0F766E", secondary: "#2DD4BF", accent: "#5EEAD4",
    gradientFrom: "rgba(15,118,110,0.06)", gradientVia: "rgba(15,118,110,0.04)", gradientTo: "rgba(15,118,110,0.02)",
    glassBg: "rgba(15,118,110,0.06)", glassBorder: "rgba(15,118,110,0.12)",
    subtle1: "rgba(15,118,110,0.08)", subtle2: "rgba(15,118,110,0.04)",
    dotColor: "#0F766E", glowColor: "#5EEAD4",
  },
  "CRM & Sales": {
    primary: "#0F766E", secondary: "#34D399", accent: "#6EE7B7",
    gradientFrom: "rgba(15,118,110,0.06)", gradientVia: "rgba(15,118,110,0.04)", gradientTo: "rgba(15,118,110,0.02)",
    glassBg: "rgba(15,118,110,0.06)", glassBorder: "rgba(15,118,110,0.12)",
    subtle1: "rgba(15,118,110,0.08)", subtle2: "rgba(15,118,110,0.04)",
    dotColor: "#0F766E", glowColor: "#6EE7B7",
  },
  "Marketing & SEO": {
    primary: "#B45309", secondary: "#D97706", accent: "#FBBF24",
    gradientFrom: "rgba(180,83,9,0.06)", gradientVia: "rgba(180,83,9,0.04)", gradientTo: "rgba(180,83,9,0.02)",
    glassBg: "rgba(180,83,9,0.06)", glassBorder: "rgba(180,83,9,0.12)",
    subtle1: "rgba(180,83,9,0.08)", subtle2: "rgba(180,83,9,0.04)",
    dotColor: "#B45309", glowColor: "#FBBF24",
  },
  "Design & Creative": {
    primary: "#A21CAF", secondary: "#D946EF", accent: "#F0ABFC",
    gradientFrom: "rgba(162,28,175,0.06)", gradientVia: "rgba(162,28,175,0.04)", gradientTo: "rgba(162,28,175,0.02)",
    glassBg: "rgba(162,28,175,0.06)", glassBorder: "rgba(162,28,175,0.12)",
    subtle1: "rgba(162,28,175,0.08)", subtle2: "rgba(162,28,175,0.04)",
    dotColor: "#A21CAF", glowColor: "#F0ABFC",
  },
  "Developer Tools": {
    primary: "#6D28D9", secondary: "#A78BFA", accent: "#C4B5FD",
    gradientFrom: "rgba(109,40,217,0.06)", gradientVia: "rgba(109,40,217,0.04)", gradientTo: "rgba(109,40,217,0.02)",
    glassBg: "rgba(109,40,217,0.06)", glassBorder: "rgba(109,40,217,0.12)",
    subtle1: "rgba(109,40,217,0.08)", subtle2: "rgba(109,40,217,0.04)",
    dotColor: "#6D28D9", glowColor: "#C4B5FD",
  },
  "Analytics & Data": {
    primary: "#1D4ED8", secondary: "#60A5FA", accent: "#93C5FD",
    gradientFrom: "rgba(29,78,216,0.06)", gradientVia: "rgba(29,78,216,0.04)", gradientTo: "rgba(29,78,216,0.02)",
    glassBg: "rgba(29,78,216,0.06)", glassBorder: "rgba(29,78,216,0.12)",
    subtle1: "rgba(29,78,216,0.08)", subtle2: "rgba(29,78,216,0.04)",
    dotColor: "#1D4ED8", glowColor: "#93C5FD",
  },
  "HR & People": {
    primary: "#C2410C", secondary: "#EA580C", accent: "#FBBF74",
    gradientFrom: "rgba(194,65,12,0.06)", gradientVia: "rgba(194,65,12,0.04)", gradientTo: "rgba(194,65,12,0.02)",
    glassBg: "rgba(194,65,12,0.06)", glassBorder: "rgba(194,65,12,0.12)",
    subtle1: "rgba(194,65,12,0.08)", subtle2: "rgba(194,65,12,0.04)",
    dotColor: "#C2410C", glowColor: "#FBBF74",
  },
  "Finance & Accounting": {
    primary: "#047857", secondary: "#34D399", accent: "#6EE7B7",
    gradientFrom: "rgba(4,120,87,0.06)", gradientVia: "rgba(4,120,87,0.04)", gradientTo: "rgba(4,120,87,0.02)",
    glassBg: "rgba(4,120,87,0.06)", glassBorder: "rgba(4,120,87,0.12)",
    subtle1: "rgba(4,120,87,0.08)", subtle2: "rgba(4,120,87,0.04)",
    dotColor: "#047857", glowColor: "#6EE7B7",
  },
  "Productivity": {
    primary: "#3F58C4", secondary: "#7C93F5", accent: "#A5B5F9",
    gradientFrom: "rgba(63,88,196,0.06)", gradientVia: "rgba(63,88,196,0.04)", gradientTo: "rgba(63,88,196,0.02)",
    glassBg: "rgba(63,88,196,0.06)", glassBorder: "rgba(63,88,196,0.12)",
    subtle1: "rgba(63,88,196,0.08)", subtle2: "rgba(63,88,196,0.04)",
    dotColor: "#3F58C4", glowColor: "#A5B5F9",
  },
  "Security & Compliance": {
    primary: "#B91C1C", secondary: "#EF4444", accent: "#FCA5A5",
    gradientFrom: "rgba(185,28,28,0.06)", gradientVia: "rgba(185,28,28,0.04)", gradientTo: "rgba(185,28,28,0.02)",
    glassBg: "rgba(185,28,28,0.06)", glassBorder: "rgba(185,28,28,0.12)",
    subtle1: "rgba(185,28,28,0.08)", subtle2: "rgba(185,28,28,0.04)",
    dotColor: "#B91C1C", glowColor: "#FCA5A5",
  },
  "Communication": {
    primary: "#0F766E", secondary: "#2DD4BF", accent: "#5EEAD4",
    gradientFrom: "rgba(15,118,110,0.06)", gradientVia: "rgba(15,118,110,0.04)", gradientTo: "rgba(15,118,110,0.02)",
    glassBg: "rgba(15,118,110,0.06)", glassBorder: "rgba(15,118,110,0.12)",
    subtle1: "rgba(15,118,110,0.08)", subtle2: "rgba(15,118,110,0.04)",
    dotColor: "#0F766E", glowColor: "#5EEAD4",
  },
}

const defaultPalette: EditorialPalette = {
  primary: "#3F58C4", secondary: "#7C93F5", accent: "#A5B5F9",
  gradientFrom: "rgba(63,88,196,0.06)", gradientVia: "rgba(63,88,196,0.04)", gradientTo: "rgba(63,88,196,0.02)",
  glassBg: "rgba(63,88,196,0.06)", glassBorder: "rgba(63,88,196,0.12)",
  subtle1: "rgba(63,88,196,0.08)", subtle2: "rgba(63,88,196,0.04)",
  dotColor: "#3F58C4", glowColor: "#A5B5F9",
}

export function getPalette(category: string): EditorialPalette {
  return palettes[category] || defaultPalette
}
