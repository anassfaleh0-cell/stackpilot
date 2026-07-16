import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Blog",
  description: "Expert insights, tutorials, and analysis on software tools, productivity, and technology trends.",
  path: "/blog",
})

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Blog" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Blog</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Insights &amp; analysis</h1>
            <p className="text-lg text-muted">Expert perspectives on software tools, productivity strategies, and technology trends.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full hover:border-primary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted">{post.readingTime} min read</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="mt-1.5">{post.description}</CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                    <span>{post.author}</span>
                    <span>·</span>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
