"use strict"

/**
 * Writes the PilotStack brand assets consumed by the website (public/).
 * Run with: node brand-assets/update-public.js
 */

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const { symbolSvg, horizontalSvg, verticalSvg, cardSvg } = require("./logo-source")

const PUBLIC = path.join(__dirname, "..", "public")
const ROOT = path.join(__dirname, "..")

function write(dir, name, contents) {
  const file = path.join(dir, name)
  fs.writeFileSync(file, Buffer.isBuffer(contents) ? contents : contents)
  console.log(`wrote ${path.relative(ROOT, file)}`)
}

/** Builds a multi-resolution ICO (16/32/48/64) from an SVG source. */
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
    entry.writeUInt8(size < 256 ? size : 0, 0)
    entry.writeUInt8(size < 256 ? size : 0, 1)
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

async function run() {
  const favicon = symbolSvg({ size: 64 })
  const icon512 = symbolSvg({ size: 512 })
  const appIconSvg = symbolSvg({ tone: "dark", size: 512, background: "#0F172A", pad: 6 })
  const horizontal = horizontalSvg({ width: 288 })
  const vertical = verticalSvg()
  const monochrome = horizontalSvg({ tone: "mono", width: 288 })
  const dark = horizontalSvg({ tone: "dark", width: 288 })
  const og = cardSvg()

  write(PUBLIC, "favicon.svg", favicon)
  write(PUBLIC, "logo-icon.svg", icon512)
  write(PUBLIC, "logo.svg", horizontal)
  write(PUBLIC, "logo-horizontal.svg", horizontal)
  write(PUBLIC, "logo-vertical.svg", vertical)
  write(PUBLIC, "logo-monochrome.svg", monochrome)
  write(PUBLIC, "logo-dark.svg", dark)
  write(PUBLIC, "apple-touch-icon.svg", appIconSvg)
  write(PUBLIC, "og.svg", og)

  // Canonical master copy used by tooling / downloads.
  fs.writeFileSync(path.join(ROOT, "pilotstack-logo.svg"), horizontal)
  console.log("wrote pilotstack-logo.svg")

  write(PUBLIC, "favicon.ico", await buildIco(favicon, [16, 32, 48, 64]))

  await sharp(Buffer.from(appIconSvg)).resize(180, 180).png().toFile(path.join(PUBLIC, "apple-touch-icon.png"))
  console.log("wrote public/apple-touch-icon.png")

  await sharp(Buffer.from(og)).png().toFile(path.join(PUBLIC, "og.png"))
  console.log("wrote public/og.png")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
