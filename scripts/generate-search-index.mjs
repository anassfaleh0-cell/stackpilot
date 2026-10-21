import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const outputPath = path.join(root, "src", "lib", "search", "generated-index.json")
const sources = [
  { dir: "reviews", type: "review", title: "name", description: "tagline" },
  { dir: "comparisons", type: "comparison", title: "title", description: "description" },
  { dir: "guides", type: "guide", title: "title", description: "description" },
  { dir: "glossary", type: "glossary", title: "term", description: "definition" },
  { dir: "blog", type: "blog", title: "title", description: "description" },
]
const index = []
for (const source of sources) {
  const directory = path.join(contentRoot, source.dir)
  for (const fileName of fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()) {
    const record = JSON.parse(fs.readFileSync(path.join(directory, fileName), "utf8"))
    if (record.publicationStatus === "draft") continue
    const slug = String(record.slug || fileName.replace(/\.json$/, "")).trim()
    const title = String(record[source.title] || "").trim()
    if (!slug || !title) continue
    index.push({
      title,
      description: String(record[source.description] || "").trim(),
      url: `/${source.dir}/${slug}`,
      category: String(record.category || "General").trim(),
      type: source.type,
    })
  }
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(index))
console.log(`Generated search index with ${index.length} content records`)
