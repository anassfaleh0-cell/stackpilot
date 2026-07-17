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
    primary: "#0D9488", secondary: "#2DD4BF", accent: "#5EEAD4",
    gradientFrom: "rgba(13,148,136,0.06)", gradientVia: "rgba(13,148,136,0.04)", gradientTo: "rgba(13,148,136,0.02)",
    glassBg: "rgba(13,148,136,0.06)", glassBorder: "rgba(13,148,136,0.12)",
    subtle1: "rgba(13,148,136,0.08)", subtle2: "rgba(13,148,136,0.04)",
    dotColor: "#0D9488", glowColor: "#5EEAD4",
  },
  "CRM & Sales": {
    primary: "#0C9488", secondary: "#34D399", accent: "#6EE7B7",
    gradientFrom: "rgba(12,148,136,0.06)", gradientVia: "rgba(12,148,136,0.04)", gradientTo: "rgba(12,148,136,0.02)",
    glassBg: "rgba(12,148,136,0.06)", glassBorder: "rgba(12,148,136,0.12)",
    subtle1: "rgba(12,148,136,0.08)", subtle2: "rgba(12,148,136,0.04)",
    dotColor: "#0C9488", glowColor: "#6EE7B7",
  },
  "Marketing & SEO": {
    primary: "#E8952A", secondary: "#F0A030", accent: "#FBBF24",
    gradientFrom: "rgba(232,149,42,0.06)", gradientVia: "rgba(232,149,42,0.04)", gradientTo: "rgba(232,149,42,0.02)",
    glassBg: "rgba(232,149,42,0.06)", glassBorder: "rgba(232,149,42,0.12)",
    subtle1: "rgba(232,149,42,0.08)", subtle2: "rgba(232,149,42,0.04)",
    dotColor: "#E8952A", glowColor: "#FBBF24",
  },
  "Design & Creative": {
    primary: "#D946EF", secondary: "#E879F9", accent: "#F0ABFC",
    gradientFrom: "rgba(217,70,239,0.06)", gradientVia: "rgba(217,70,239,0.04)", gradientTo: "rgba(217,70,239,0.02)",
    glassBg: "rgba(217,70,239,0.06)", glassBorder: "rgba(217,70,239,0.12)",
    subtle1: "rgba(217,70,239,0.08)", subtle2: "rgba(217,70,239,0.04)",
    dotColor: "#D946EF", glowColor: "#F0ABFC",
  },
  "Developer Tools": {
    primary: "#7C3AED", secondary: "#A78BFA", accent: "#C4B5FD",
    gradientFrom: "rgba(124,58,237,0.06)", gradientVia: "rgba(124,58,237,0.04)", gradientTo: "rgba(124,58,237,0.02)",
    glassBg: "rgba(124,58,237,0.06)", glassBorder: "rgba(124,58,237,0.12)",
    subtle1: "rgba(124,58,237,0.08)", subtle2: "rgba(124,58,237,0.04)",
    dotColor: "#7C3AED", glowColor: "#C4B5FD",
  },
  "Analytics & Data": {
    primary: "#2563EB", secondary: "#60A5FA", accent: "#93C5FD",
    gradientFrom: "rgba(37,99,235,0.06)", gradientVia: "rgba(37,99,235,0.04)", gradientTo: "rgba(37,99,235,0.02)",
    glassBg: "rgba(37,99,235,0.06)", glassBorder: "rgba(37,99,235,0.12)",
    subtle1: "rgba(37,99,235,0.08)", subtle2: "rgba(37,99,235,0.04)",
    dotColor: "#2563EB", glowColor: "#93C5FD",
  },
  "HR & People": {
    primary: "#E85D2A", secondary: "#F07A3C", accent: "#FBBF74",
    gradientFrom: "rgba(232,93,42,0.06)", gradientVia: "rgba(232,93,42,0.04)", gradientTo: "rgba(232,93,42,0.02)",
    glassBg: "rgba(232,93,42,0.06)", glassBorder: "rgba(232,93,42,0.12)",
    subtle1: "rgba(232,93,42,0.08)", subtle2: "rgba(232,93,42,0.04)",
    dotColor: "#E85D2A", glowColor: "#FBBF74",
  },
  "Finance & Accounting": {
    primary: "#059669", secondary: "#34D399", accent: "#6EE7B7",
    gradientFrom: "rgba(5,150,105,0.06)", gradientVia: "rgba(5,150,105,0.04)", gradientTo: "rgba(5,150,105,0.02)",
    glassBg: "rgba(5,150,105,0.06)", glassBorder: "rgba(5,150,105,0.12)",
    subtle1: "rgba(5,150,105,0.08)", subtle2: "rgba(5,150,105,0.04)",
    dotColor: "#059669", glowColor: "#6EE7B7",
  },
  "Productivity": {
    primary: "#5472E8", secondary: "#7C93F5", accent: "#A5B5F9",
    gradientFrom: "rgba(84,114,232,0.06)", gradientVia: "rgba(84,114,232,0.04)", gradientTo: "rgba(84,114,232,0.02)",
    glassBg: "rgba(84,114,232,0.06)", glassBorder: "rgba(84,114,232,0.12)",
    subtle1: "rgba(84,114,232,0.08)", subtle2: "rgba(84,114,232,0.04)",
    dotColor: "#5472E8", glowColor: "#A5B5F9",
  },
  "Security & Compliance": {
    primary: "#DC2626", secondary: "#EF4444", accent: "#FCA5A5",
    gradientFrom: "rgba(220,38,38,0.06)", gradientVia: "rgba(220,38,38,0.04)", gradientTo: "rgba(220,38,38,0.02)",
    glassBg: "rgba(220,38,38,0.06)", glassBorder: "rgba(220,38,38,0.12)",
    subtle1: "rgba(220,38,38,0.08)", subtle2: "rgba(220,38,38,0.04)",
    dotColor: "#DC2626", glowColor: "#FCA5A5",
  },
  "Communication": {
    primary: "#0D9488", secondary: "#2DD4BF", accent: "#5EEAD4",
    gradientFrom: "rgba(13,148,136,0.06)", gradientVia: "rgba(13,148,136,0.04)", gradientTo: "rgba(13,148,136,0.02)",
    glassBg: "rgba(13,148,136,0.06)", glassBorder: "rgba(13,148,136,0.12)",
    subtle1: "rgba(13,148,136,0.08)", subtle2: "rgba(13,148,136,0.04)",
    dotColor: "#0D9488", glowColor: "#5EEAD4",
  },
}

const defaultPalette: EditorialPalette = {
  primary: "#5472E8", secondary: "#7C93F5", accent: "#A5B5F9",
  gradientFrom: "rgba(84,114,232,0.06)", gradientVia: "rgba(84,114,232,0.04)", gradientTo: "rgba(84,114,232,0.02)",
  glassBg: "rgba(84,114,232,0.06)", glassBorder: "rgba(84,114,232,0.12)",
  subtle1: "rgba(84,114,232,0.08)", subtle2: "rgba(84,114,232,0.04)",
  dotColor: "#5472E8", glowColor: "#A5B5F9",
}

export function getPalette(category: string): EditorialPalette {
  return palettes[category] || defaultPalette
}
