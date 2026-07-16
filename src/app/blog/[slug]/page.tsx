import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getBlogPost } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const { getAllBlogPosts } = await import("@/lib/content/registry")
  return getAllBlogPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return createMetadata({ title: post.title, description: post.description, path: `/blog/${slug}` })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${slug}` }]} />
      <ArticleSchema title={post.title} description={post.description} publishedAt={post.publishedAt} author={post.author} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">{post.category}</Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
            <p className="text-lg text-muted mb-6">{post.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted mb-12 pb-6 border-b border-border">
              <span>{post.author}</span>
              <span>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
            <div className="prose prose-slate max-w-none leading-relaxed">
              {post.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 text-foreground/80">{paragraph.trim()}</p>
              ))}
            </div>
          </div>
        </Container>
      </article>
    </>
  )
}
