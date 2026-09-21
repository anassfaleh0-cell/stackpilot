import { site } from "@/lib/constants"
import { getAllBlogPosts, getAllReviews, getAllGuides, getAllComparisons, getAllResearch } from "@/lib/content/registry"

export async function GET() {
  const reviews = getAllReviews().slice(0, 20)
  const comparisons = getAllComparisons().slice(0, 20)
  const guides = getAllGuides().slice(0, 15)
  const posts = getAllBlogPosts().slice(0, 15)
  const research = getAllResearch().slice(0, 10)

  const reviewItems = reviews
    .map(
      (r) => `
    <item>
      <title>${escapeXml(r.name)} Review (2026): Pricing, Features, Pros &amp; Cons</title>
      <description>${escapeXml(r.description)}</description>
      <content:encoded><![CDATA[<p>${escapeXml(r.description)}</p><p>Read the full hands-on review at ${site.url}/reviews/${r.slug}</p>]]></content:encoded>
      <link>${site.url}/reviews/${r.slug}</link>
      <guid isPermaLink="true">${site.url}/reviews/${r.slug}</guid>
      <pubDate>${new Date(r.lastReviewed).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(r.author)}</dc:creator>
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
      <content:encoded><![CDATA[<p>${escapeXml(c.description)}</p><p>Read the full comparison at ${site.url}/comparisons/${c.slug}</p>]]></content:encoded>
      <link>${site.url}/comparisons/${c.slug}</link>
      <guid isPermaLink="true">${site.url}/comparisons/${c.slug}</guid>
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
      <content:encoded><![CDATA[<p>${escapeXml(g.description)}</p><p>Read the full guide at ${site.url}/guides/${g.slug}</p>]]></content:encoded>
      <link>${site.url}/guides/${g.slug}</link>
      <guid isPermaLink="true">${site.url}/guides/${g.slug}</guid>
      <pubDate>${new Date(g.lastUpdated).toUTCString()}</pubDate>
      <category>${escapeXml(g.category)}</category>
      <category>Buying Guide</category>
    </item>`
    )
    .join("")

  const blogItems = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <content:encoded><![CDATA[<p>${escapeXml(post.description)}</p><p>Read the full article at ${site.url}/blog/${post.slug}</p>]]></content:encoded>
      <link>${site.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("")

  const researchItems = research
    .map(
      (r) => `
    <item>
      <title>${escapeXml(r.title)}</title>
      <description>${escapeXml(r.description)}</description>
      <content:encoded><![CDATA[<p>${escapeXml(r.description)}</p><p>Read the full research report at ${site.url}/research/${r.slug}</p>]]></content:encoded>
      <link>${site.url}/research/${r.slug}</link>
      <guid isPermaLink="true">${site.url}/research/${r.slug}</guid>
      <pubDate>${new Date(r.publishedAt || r.updatedAt || new Date().toISOString()).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(r.author || "PilotStack Team")}</dc:creator>
      <category>${escapeXml(r.category)}</category>
      <category>Research Report</category>
    </item>`
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml("In-depth software reviews, expert comparisons, and actionable guides to help businesses choose, implement, and optimize the right tools for every need.")}</description>
    <link>${site.url}</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${site.url}/favicon.svg</url>
      <title>${escapeXml(site.name)}</title>
      <link>${site.url}</link>
    </image>
    ${reviewItems}
    ${comparisonItems}
    ${guideItems}
    ${blogItems}
    ${researchItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
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
