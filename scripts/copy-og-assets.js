// Postinstall script: Copies missing assets to @vercel/og's compiled directory.
// Next.js 16.2.10's bundled @vercel/og 0.11.1 is missing resvg.wasm and Geist
// font files from its own directory. This script copies them from sources.
const fs = require("fs")
const path = require("path")

const ogDir = path.join(__dirname, "..", "node_modules", "next", "dist", "compiled", "@vercel", "og")
const resvgPkg = path.join(__dirname, "..", "node_modules", "@resvg", "resvg-wasm")
const fontsDir = path.join(__dirname, "..", "public", "fonts")

const copies = [
  [path.join(resvgPkg, "index_bg.wasm"), path.join(ogDir, "resvg.wasm")],
  [path.join(fontsDir, "Geist-Regular.ttf"), path.join(ogDir, "Geist-Regular.ttf")],
  [path.join(fontsDir, "Geist-Bold.ttf"), path.join(ogDir, "Geist-Bold.ttf")],
]

for (const [src, dest] of copies) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-og-assets] SKIP (source missing) ${src}`)
    continue
  }
  if (!fs.existsSync(path.dirname(dest))) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
  }
  fs.copyFileSync(src, dest)
  const st = fs.statSync(dest)
  console.log(`[copy-og-assets] OK ${st.size}B -> ${dest}`)
}
