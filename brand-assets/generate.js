"use strict"

/**
 * Generates the downloadable PilotStack brand kit (brand-assets/{svg,png,ico,social}).
 * Run with: node brand-assets/generate.js
 */

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const {
  BRAND,
  TAGLINE,
  FONT,
  paths,
  svg,
  symbolSvg,
  horizontalSvg,
  verticalSvg,
  cardSvg,
} = require("./logo-source")

const BASE = __dirname
const SVG_DIR = path.join(BASE, "svg")
const PNG_DIR = path.join(BASE, "png")
const ICO_DIR = path.join(BASE, "ico")
const SOC_DIR = path.join(BASE, "social")

for (const dir of [SVG_DIR, PNG_DIR, ICO_DIR, SOC_DIR]) {
  fs.mkdirSync(dir, { recursive: true })
}

function write(dir, name, contents) {
  fs.writeFileSync(path.join(dir, name), contents)
  console.log(`wrote brand-assets/${path.relative(BASE, path.join(dir, name))}`)
}

/** Centered [symbol] PilotStack lockup sized to fit a banner of any ratio. */
function bannerSvg({ width, height, symbolH, font, tagline = false, background = null }) {
  const scale = symbolH / 64
  const textW = font * 4.9
  const gap = Math.round(symbolH * 0.38)
  const total = symbolH + gap + textW
  const startX = Math.round((width - total) / 2)
  const centerY = height / 2
  const baseline = Math.round(centerY + font * 0.35)

  const body = [
    background
      ? `  <rect width="${width}" height="${height}" fill="${background}"/>`
      : `  <rect width="${width}" height="${height}" fill="${BRAND.navy}"/>`,
    `  <rect width="${width}" height="${height}" fill="url(#psBannerGlow)"/>`,
    `  <g transform="translate(${startX} ${centerY - symbolH / 2}) scale(${scale})">`,
    `  <g fill="none">`,
    paths(["#3B82F6", "#818CF8", "#A78BFA"], "    "),
    `  </g>`,
    `  </g>`,
    `  <text x="${startX + symbolH + gap}" y="${baseline}" font-family="${FONT}" font-size="${font}"><tspan fill="${BRAND.darkInk}" font-weight="600">Pilot</tspan><tspan fill="${BRAND.darkAccent}" font-weight="800">Stack</tspan></text>`,
    tagline
      ? `  <text x="${startX + symbolH + gap}" y="${baseline + Math.round(font * 0.85)}" font-family="${FONT}" font-size="${Math.round(font * 0.34)}" fill="${BRAND.mutedOnDark}">${TAGLINE}</text>`
      : "",
    `</svg>`,
  ]
    .filter(Boolean)
    .join("\n")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="psBannerGlow" cx="35%" cy="0%" r="90%">
      <stop offset="0%" stop-color="${BRAND.indigo}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${BRAND.indigo}" stop-opacity="0"/>
    </radialGradient>
  </defs>
${body}`
}

async function buildIco(svgSource, sizes) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(sizes.length, 4)

  const entries = []
  const images = []
  let cursor = 6 + sizes.length * 16
  for (const size of sizes) {
    const png = await sharp(Buffer.from(svgSource))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0)
    entry.writeUInt8(size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(0, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(cursor, 12)
    entries.push(entry)
    images.push(png)
    cursor += png.length
  }
  // ICO layout: header, then the full directory, then the image data blobs.
  return Buffer.concat([header, ...entries, ...images])
}

async function png(svgSource, { width, height, density } = {}) {
  const pipeline = sharp(Buffer.from(svgSource), density ? { density } : undefined)
  if (width && height) pipeline.resize(width, height)
  return pipeline.png().toBuffer()
}

async function run() {
  // ── SVG ──
  write(SVG_DIR, "favicon.svg", symbolSvg({ size: 64 }))
  write(SVG_DIR, "logo-light.svg", horizontalSvg({ width: 288 }))
  write(SVG_DIR, "logo-dark.svg", horizontalSvg({ tone: "dark", width: 288 }))
  write(SVG_DIR, "logo-horizontal.svg", horizontalSvg({ width: 288 }))
  write(SVG_DIR, "logo-stacked.svg", verticalSvg())
  write(SVG_DIR, "logo-monochrome.svg", horizontalSvg({ tone: "mono", width: 288 }))

  // ── PNG ──
  const appIcon = symbolSvg({ tone: "dark", size: 512, background: BRAND.navy, pad: 6 })
  const og = cardSvg()

  write(PNG_DIR, "apple-touch-icon.png", await png(appIcon, { width: 180, height: 180 }))
  write(PNG_DIR, "icon-192.png", await png(appIcon, { width: 192, height: 192 }))
  write(PNG_DIR, "icon-512.png", await png(appIcon, { width: 512, height: 512 }))
  write(PNG_DIR, "og-image.png", await png(og, { width: 1200, height: 630 }))
  write(PNG_DIR, "twitter-card.png", await png(og, { width: 1200, height: 630 }))

  // ── ICO ──
  write(ICO_DIR, "favicon.ico", await buildIco(symbolSvg({ size: 64 }), [16, 32, 48, 64]))

  // ── Social ──
  const socials = [
    ["github-social-preview.png", 1280, 640, 150, 76, true],
    ["twitter-header.png", 1500, 500, 130, 70, true],
    ["reddit-banner.png", 4000, 128, 72, 40, false],
    ["linkedin-banner.png", 1128, 191, 92, 52, false],
  ]
  for (const [name, width, height, symbolH, font, tagline] of socials) {
    const source = bannerSvg({ width, height, symbolH, font, tagline })
    write(SOC_DIR, name, await png(source, { width, height, density: 96 }))
  }
  const avatar = svg({
    width: 256,
    height: 256,
    title: "PilotStack",
    body: [
      `  <rect width="256" height="256" fill="${BRAND.navy}"/>`,
      `  <g transform="translate(48 48) scale(2.5)">`,
      `  <g fill="none">`,
      paths(["#3B82F6", "#818CF8", "#A78BFA"], "    "),
      `  </g>`,
      `  </g>`,
    ].join("\n"),
  })
  write(SOC_DIR, "reddit-avatar.png", await png(avatar, { width: 256, height: 256 }))

  console.log("\nBrand kit generated.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
