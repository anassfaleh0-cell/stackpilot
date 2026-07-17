import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Clock, User } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Blog",
  description: "Expert insights, hands-on tutorials, and in-depth analysis on software tools, productivity strategies, and technology trends to help your business stay ahead.",
  path: "/blog",
})

export default function BlogPage() {
  const posts = getAllBlogPosts()

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <CollectionPageSchema name="Blog" description="Expert insights, tutorials, and analysis on software tools and technology trends" url={`${site.url}/blog`} />
      <ItemListSchema items={posts.map(p => ({ name: p.title, url: `${site.url}/blog/${p.slug}` }))} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Blog" }]} />
      </Container>

      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="waves" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Blog</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Insights &amp; analysis</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Expert perspectives on software tools, productivity strategies, and technology trends.
            </p>
          </SectionHeader>
        </Container>
      </section>

      <Section>
        <Container>
          {/* Featured post */}
          {featured && (
            <div className="mb-12">
              <Link href={`/blog/${featured.slug}`} className="group card-hover block">
                <Card className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default">{featured.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {featured.readingTime} min read
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 text-pretty">{featured.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {featured.author}
                    </span>
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* Rest of posts */}
          {rest.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {post.readingTime} min
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="mt-1.5">{post.description}</CardDescription>
                  <div className="mt-auto pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    <span>·</span>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
