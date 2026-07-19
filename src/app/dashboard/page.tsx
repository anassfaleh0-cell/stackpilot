import { Container } from "@/components/ui/container"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Dashboard — Growth & Traffic Metrics",
  description: "PilotStack growth monitoring dashboard tracking search performance, authority, revenue, and technical metrics.",
  path: "/dashboard",
})
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { Search, MousePointerClick, Eye, Percent, MapPin, Users, Link, ExternalLink, Mail, Globe, Building2, Cpu, DollarSign, BarChart3, Gauge, Zap, Layers, Activity } from "lucide-react"

const sections = [
  {
    title: "Search Console Metrics",
    cards: [
      { label: "Indexed Pages", value: "0", subtitle: "pages in Google index", icon: Search },
      { label: "Organic Clicks", value: "0", subtitle: "clicks (last 28 days)", icon: MousePointerClick },
      { label: "Impressions", value: "0", subtitle: "impressions (last 28 days)", icon: Eye },
      { label: "Avg CTR", value: "0%", subtitle: "click-through rate", icon: Percent },
      { label: "Avg Position", value: "0", subtitle: "average position", icon: MapPin },
    ],
    grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  },
  {
    title: "Traffic & Engagement",
    cards: [
      { label: "Organic Traffic", value: "0", subtitle: "monthly visitors", icon: Users },
      { label: "Affiliate Clicks", value: "0", subtitle: "clicks tracked", icon: Link },
      { label: "Outbound Clicks", value: "0", subtitle: "external link clicks", icon: ExternalLink },
      { label: "Newsletter Subs", value: "0", subtitle: "email subscribers", icon: Mail },
    ],
    grid: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  },
  {
    title: "Authority Metrics",
    cards: [
      { label: "Backlinks", value: "0", subtitle: "total backlinks", icon: Globe },
      { label: "Referring Domains", value: "0", subtitle: "unique domains", icon: Building2 },
      { label: "AI Citations", value: "0", subtitle: "AI tool mentions", icon: Cpu },
    ],
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    title: "Revenue & Monetization",
    cards: [
      { label: "Affiliate Revenue", value: "$0", subtitle: "monthly commission", icon: DollarSign },
      { label: "Ad Revenue", value: "$0", subtitle: "network revenue", icon: BarChart3 },
      { label: "RPM", value: "$0.00", subtitle: "revenue per 1k visits", icon: Gauge },
    ],
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    title: "Core Web Vitals",
    cards: [
      { label: "LCP", value: "—", subtitle: "Largest Contentful Paint", icon: Zap },
      { label: "FID/INP", value: "—", subtitle: "Interaction to Next Paint", icon: Layers },
      { label: "CLS", value: "—", subtitle: "Cumulative Layout Shift", icon: Activity },
      { label: "Page Speed", value: "—", subtitle: "overall score", icon: Gauge },
    ],
    grid: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  },
]

export default function DashboardPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Dashboard", href: "/dashboard" }]} />
      <Container className="pt-8 pb-20">
        <Breadcrumbs items={[{ name: "Dashboard" }]} />
        <div className="flex items-center justify-between mt-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Growth &amp; Traffic Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitoring search performance, authority, revenue, and technical metrics.</p>
          </div>
          <Button variant="default" size="lg">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {sections.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-4">{section.title}</h2>
            <div className={`grid ${section.grid} gap-3`}>
              {section.cards.map((card) => {
                const Icon = card.icon
                return (
                  <Card key={card.label} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-muted-bg border border-border">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">{card.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{card.subtitle}</div>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}

        <div className="mt-12 p-6 rounded-xl bg-muted-bg border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Connect Google Search Console, Google Analytics, and backlink data sources to populate these metrics.
          </p>
        </div>
      </Container>
    </>
  )
}
