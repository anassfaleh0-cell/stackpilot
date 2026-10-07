"use strict"

/**
 * PilotStack brand asset source of truth — Concept 1 (Modern & Clean).
 *
 * Symbol: three stacked geometric layers, blue → indigo → purple.
 * All public/brand-assets artwork is generated from this module so every
 * logo variant stays visually identical across the site and the press kit.
 */

const BRAND = {
  blue: "#2563EB",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  navy: "#0F172A",
  neutral: "#F8FAFC",
  darkBlue: "#3B82F6",
  darkIndigo: "#818CF8",
  darkPurple: "#A78BFA",
  darkInk: "#F8FAFC",
  darkAccent: "#60A5FA",
  mutedOnDark: "#94A3B8",
}

const TAGLINE = "Better tools. Smarter decisions."

/** Three stacked layers on a 64×64 grid (mirrors LOGO_LAYERS in the React component). */
const LAYERS = [
  "M32 8 58 13 32 18 6 13Z",
  "M32 27 58 32 32 37 6 32Z",
  "M32 46 58 51 32 56 6 51Z",
]

const TONES = {
  light: [BRAND.blue, BRAND.indigo, BRAND.purple],
  dark: [BRAND.darkBlue, BRAND.darkIndigo, BRAND.darkPurple],
  mono: [BRAND.navy, BRAND.navy, BRAND.navy],
}

const FONT = "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif"

function paths(colors, indent = "  ") {
  return LAYERS.map(
    (d, i) =>
      `${indent}<path d="${d}" fill="${colors[i]}" stroke="${colors[i]}" stroke-width="4" stroke-linejoin="round"/>`
  ).join("\n")
}

function svg({ width, height, viewBox, body, title }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox || `0 0 ${width} ${height}`}" width="${width}" height="${height}"${title ? ` role="img" aria-label="${title}"` : ' aria-hidden="true"'}>
${title ? `  <title>${title}</title>\n` : ""}${body}
</svg>
`
}

/** Symbol only — favicon / app-icon mark. `pad` adds internal breathing room. */
function symbolSvg({ tone = "light", size = 64, background = null, pad = 0, title } = {}) {
  const colors = TONES[tone]
  const groups = (indent) => `<g fill="none">\n${paths(colors, indent + "  ")}\n${indent}</g>`

  if (!background && pad === 0) {
    return svg({ width: size, height: size, viewBox: "0 0 64 64", body: groups(""), title })
  }

  const scale = pad > 0 ? (64 - pad * 2) / 64 : 1
  const offset = (64 - 64 * scale) / 2
  const body = [
    background ? `  <rect width="64" height="64" fill="${background}"/>` : null,
    `  <g transform="translate(${offset} ${offset}) scale(${scale})">`,
    groups("    "),
    `  </g>`,
  ]
    .filter(Boolean)
    .join("\n")
  return svg({ width: size, height: size, viewBox: "0 0 64 64", body, title })
}

function wordmark({ x, y, size, anchor = "start", ink, accent, letterSpacing = -2 }) {
  return `  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" letter-spacing="${letterSpacing}"><tspan fill="${ink}" font-weight="600">Pilot</tspan><tspan fill="${accent}" font-weight="800">Stack</tspan></text>`
}

function inks(tone) {
  if (tone === "dark") return { ink: BRAND.darkInk, accent: BRAND.darkAccent }
  if (tone === "mono") return { ink: BRAND.navy, accent: BRAND.navy }
  return { ink: BRAND.navy, accent: BRAND.blue }
}

/** Horizontal lockup: [symbol] PilotStack */
function horizontalSvg({ tone = "light", width = 288 } = {}) {
  const { ink, accent } = inks(tone)
  const body = [
    `  <g fill="none">`,
    paths(TONES[tone], "    "),
    `  </g>`,
    wordmark({ x: 80, y: 46, size: 40, ink, accent }),
  ].join("\n")
  return svg({ width, height: 64, body, title: "PilotStack" })
}

/** Stacked lockup: symbol above wordmark. */
function verticalSvg({ tone = "light" } = {}) {
  const { ink, accent } = inks(tone)
  const body = [
    `  <g fill="none" transform="translate(88 0)">`,
    paths(TONES[tone], "    "),
    `  </g>`,
    wordmark({ x: 120, y: 122, size: 40, anchor: "middle", ink, accent }),
  ].join("\n")
  return svg({ width: 240, height: 144, body, title: "PilotStack" })
}

/** Social / OpenGraph card: navy field, symbol, wordmark, tagline. */
function cardSvg({ width = 1200, height = 630 } = {}) {
  const symbolSize = 128
  const symbolY = Math.round(height * 0.26)
  const wordY = symbolY + symbolSize + 92
  const ruleY = wordY + 34
  const tagY = ruleY + 52

  const body = [
    `  <defs>`,
    `    <linearGradient id="psBg" x1="0%" y1="0%" x2="100%" y2="100%">`,
    `      <stop offset="0%" stop-color="#0F172A"/><stop offset="100%" stop-color="#1E293B"/>`,
    `    </linearGradient>`,
    `    <linearGradient id="psRule" x1="0%" y1="0%" x2="100%" y2="0%">`,
    `      <stop offset="0%" stop-color="${BRAND.blue}"/><stop offset="50%" stop-color="${BRAND.indigo}"/><stop offset="100%" stop-color="${BRAND.purple}"/>`,
    `    </linearGradient>`,
    `    <radialGradient id="psGlow" cx="50%" cy="0%" r="85%">`,
    `      <stop offset="0%" stop-color="${BRAND.indigo}" stop-opacity="0.32"/><stop offset="100%" stop-color="${BRAND.indigo}" stop-opacity="0"/>`,
    `    </radialGradient>`,
    `  </defs>`,
    `  <rect width="${width}" height="${height}" fill="url(#psBg)"/>`,
    `  <rect width="${width}" height="${height}" fill="url(#psGlow)"/>`,
    `  <g transform="translate(${width / 2 - symbolSize / 2} ${symbolY}) scale(${symbolSize / 64})">`,
    `  <g fill="none">`,
    paths(TONES.light, "    "),
    `  </g>`,
    `  </g>`,
    wordmark({
      x: width / 2,
      y: wordY,
      size: 84,
      anchor: "middle",
      ink: BRAND.darkInk,
      accent: BRAND.darkAccent,
      letterSpacing: -3,
    }),
    `  <rect x="${width / 2 - 60}" y="${ruleY}" width="120" height="4" rx="2" fill="url(#psRule)"/>`,
    `  <text x="${width / 2}" y="${tagY}" text-anchor="middle" font-family="${FONT}" font-size="30" fill="${BRAND.mutedOnDark}" letter-spacing="0.5">${TAGLINE}</text>`,
  ].join("\n")

  return svg({ width, height, body })
}

module.exports = {
  BRAND,
  TAGLINE,
  LAYERS,
  TONES,
  FONT,
  paths,
  svg,
  symbolSvg,
  horizontalSvg,
  verticalSvg,
  cardSvg,
  wordmark,
}
