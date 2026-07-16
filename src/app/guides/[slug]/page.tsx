import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, HowToSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getGuide } from "@/lib/content/registry"
import { getAllGuides } from "@/lib/content/registry"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  return createMetadata({ title: guide.title, description: guide.description, path: `/guides/${slug}` })
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: guide.title, href: `/guides/${slug}` }]} />
      <HowToSchema name={guide.title} description={guide.description} steps={guide.sections.map((s) => ({ name: s.title, text: s.body }))} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: guide.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">{guide.category}</Badge>
              <Badge variant={guide.difficulty === "Beginner" ? "success" : guide.difficulty === "Intermediate" ? "warning" : "danger"}>
                {guide.difficulty}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{guide.title}</h1>
            <p className="text-lg text-muted mb-2">{guide.description}</p>
            <p className="text-sm text-muted mb-12">By {guide.author} · {guide.sections.length} sections · {guide.readingTime} min read</p>
            <div className="space-y-8">
              {guide.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shrink-0">{i + 1}</span>
                    {section.title}
                  </h2>
                  {section.type === "list" && section.items ? (
                    <ul className="space-y-2 pl-9">
                      {section.items.map((item, j) => (
                        <li key={j} className="text-muted leading-relaxed flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted leading-relaxed pl-9">{section.body}</p>
                  )}
                </section>
              ))}
            </div>
          </div>
        </Container>
      </article>
    </>
  )
}
