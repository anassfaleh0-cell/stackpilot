import { site } from "@/lib/constants"
import { getAllBlogPosts, getAllReviews, getAllGuides, getAllComparisons } from "@/lib/content/registry"

export async function GET() {
  const posts = getAllBlogPosts()
  const reviews = getAllReviews()
  const guides = getAllGuides()
  const comparisons = getAllComparisons()

  const reviewItems = reviews
    .map(
      (r) => `
    <item>
      <title>${escapeXml(r.name)} Review: Pricing, Features, Pros & Cons</title>
      <description>${escapeXml(r.description)}</description>
      <link>${site.url}/reviews/${r.slug}</link>
      <guid>${site.url}/reviews/${r.slug}</guid>
      <pubDate>${new Date(r.lastReviewed).toUTCString()}</pubDate>
      <category>${escapeXml(r.category)}</category>
      <category>Software Review</category>
    </item>`
    )
    .join("")

  const comparisonItems = comparisons
    .map(
      (c) => `
    <item>
      <title>${escapeXml(c.title)}</title>
      <description>${escapeXml(c.description)}</description>
      <link>${site.url}/comparisons/${c.slug}</link>
      <guid>${site.url}/comparisons/${c.slug}</guid>
      <pubDate>${new Date(c.lastUpdated).toUTCString()}</pubDate>
      <category>${escapeXml(c.category)}</category>
      <category>Software Comparison</category>
    </item>`
    )
    .join("")

  const guideItems = guides
    .map(
      (g) => `
    <item>
      <title>${escapeXml(g.title)}</title>
      <description>${escapeXml(g.description)}</description>
      <link>${site.url}/guides/${g.slug}</link>
      <guid>${site.url}/guides/${g.slug}</guid>
      <pubDate>${new Date(g.lastUpdated).toUTCString()}</pubDate>
      <category>${escapeXml(g.category)}</category>
      <category>Guide</category>
    </item>`
    )
    .join("")

  const blogItems = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${site.url}/blog/${post.slug}</link>
      <guid>${site.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.author)}</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(site.name)}</title>
      <description>${escapeXml("Software reviews, comparisons, guides, and expert insights — helping businesses choose the right tools.")}</description>
      <link>${site.url}</link>
      <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${reviewItems}
      ${comparisonItems}
      ${guideItems}
      ${blogItems}
    </channel>
  </rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
