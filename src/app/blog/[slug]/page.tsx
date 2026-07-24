import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, BlogPostingSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getBlogPost, getContentTitle } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllReviews } from "@/lib/content/registry"
import { EditorialHero, EditorialCallout, GlassCard, InfoCard } from "@/components/dynamic"
import { RelatedContent } from "@/components/dynamic-client"
import { BrandDivider } from "@/components/brand/patterns"
import { Clock, User, Calendar, Star } from "lucide-react"

export async function generateStaticParams() {
  const { getAllBlogPosts } = await import("@/lib/content/registry")
  return getAllBlogPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return createMetadata({ title: post.title, description: post.description, path: `/blog/${slug}`, ogType: "article", publishedAt: post.publishedAt, updatedAt: post.updatedAt, articleTags: post.tags, articleSection: post.category })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const allReviews = getAllReviews()
  const relatedReviews = allReviews.filter((r) =>
    post.body.toLowerCase().includes(r.name.toLowerCase())
  ).slice(0, 3)

  const paragraphs = post.body.split("\n\n").filter(Boolean)
  const midPoint = Math.floor(paragraphs.length / 2)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${slug}` }]} />
      <BlogPostingSchema title={post.title} description={post.description} publishedAt={post.publishedAt} updatedAt={post.updatedAt} author={post.author} url={`${site.url}/blog/${post.slug}`} />
      <WebPageSchema name={post.title} description={post.description} url={`${site.url}/blog/${slug}`} mainEntity={{ "@type": "Thing", name: post.tags[0] || post.category, description: post.description }} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title }]} />
      </Container>

      {/* Hero */}
      <div className="mb-6 px-4 sm:px-8">
        <EditorialHero
          slug={post.slug}
          title={post.title}
          subtitle={post.description}
          category={post.category}
          variant="blog"
          className="w-full min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]"
        />
      </div>

      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="default">{post.category}</Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <p className="text-lg text-muted-foreground mb-6 text-pretty">{post.description}</p>

            {/* Author bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime} min read
              </span>
            </div>

            {/* Quick info cards */}
            <div className="grid sm:grid-cols-3 gap-3 mb-10">
              <InfoCard icon={<Clock size={16} stroke="var(--primary)" />} value={`${post.readingTime} min`} title="Reading Time" />
              <InfoCard icon={
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3" />
                </svg>
              } value={post.category} title="Category" />
              <InfoCard icon={
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              } value={post.tags.length > 0 ? post.tags[0] : "Featured"} title="Topic" />
            </div>

            {/* First half of content */}
            <div className="space-y-5 leading-relaxed text-foreground/85">
              {paragraphs.slice(0, midPoint).map((paragraph, i) => (
                <p key={i}>{paragraph.trim()}</p>
              ))}
            </div>

            {/* Pull quote (midpoint callout) */}
            <div className="my-10">
              <div className="pull-quote">
                {paragraphs[midPoint]?.slice(0, 150).trim() || "Key insight from this analysis."}
              </div>
            </div>

            {/* Second half of content */}
            <div className="mt-6 space-y-5 leading-relaxed text-foreground/85">
              {paragraphs.slice(midPoint + 1).map((paragraph, i) => (
                <p key={i}>{paragraph.trim()}</p>
              ))}
            </div>

            <BrandDivider />

            {/* Key Takeaways */}
            <div className="mt-4 mb-10">
              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-semibold text-sm">Key Takeaways</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">1</span>
                      <span className="text-muted-foreground">In-depth analysis of {post.category.toLowerCase()} tools and trends</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">2</span>
                      <span className="text-muted-foreground">Practical recommendations for {post.tags.slice(0, 2).join(" and ").toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">3</span>
                      <span className="text-muted-foreground">Based on real testing and expert evaluation by {post.author}</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </div>

            {/* Related Reviews */}
            {relatedReviews.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <h2 className="text-xl font-bold tracking-tight mb-4">Related Reviews</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {relatedReviews.map((r) => (
                    <Link key={r.slug} href={`/reviews/${r.slug}`} className="card-hover rounded-xl border border-border bg-card p-4 block">
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="fill-accent text-accent" />
                        <span className="text-xs text-muted-foreground">{r.rating}/5</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Block */}
            <div className="mt-10 rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary font-bold shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Written by {post.author}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {post.author} is a software expert at PilotStack, specializing in {post.category.toLowerCase()} tools and technology evaluation.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </p>
                </div>
              </div>
            </div>

            <RelatedContent
              items={[
                ...(post.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
                ...(post.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
                ...(post.relatedGlossary || []).map(s => ({ slug: s, type: "glossary" as const, title: getContentTitle("glossary", s) ?? undefined })),
              ]}
              title="Related Resources"
            />
          </div>
        </Container>
      </article>
    </>
  )
}
