import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Our Team",
  description: "Meet the PilotStack team of software researchers, analysts, and industry experts who bring their hands-on expertise to every review and guide.",
  path: "/team",
})

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Editorial Director",
    expertise: "Developer Tools, Cloud Platforms, AI/ML",
    bio: "Former senior engineer with 12 years of experience building and deploying production applications. Alex leads our editorial strategy and oversees all technical content. Previously led engineering teams at two YC-backed startups.",
    initials: "AC",
    category: "Developer Tools",
  },
  {
    name: "Sarah Mitchell",
    role: "Senior Research Analyst",
    expertise: "CRM, Sales, Marketing Automation",
    bio: "10+ years in B2B SaaS product marketing and research. Sarah has evaluated over 200 sales and marketing tools and previously managed the tech stack at a $500M enterprise.",
    initials: "SM",
    category: "CRM & Sales",
  },
  {
    name: "Marcus Williams",
    role: "Research Analyst",
    expertise: "Project Management, Productivity, Collaboration",
    bio: "Former PMP-certified project manager who led remote teams across three continents. Marcus brings practical project management experience to every tool evaluation.",
    initials: "MW",
    category: "Project Management",
  },
  {
    name: "Priya Patel",
    role: "Research Analyst",
    expertise: "Analytics, Data Platforms, BI Tools",
    bio: "Data scientist with experience building analytics pipelines at a Fortune 500 company. Priya evaluates analytics platforms by connecting real data sources and building production dashboards.",
    initials: "PP",
    category: "Analytics & Data",
  },
  {
    name: "James O'Brien",
    role: "Technical Writer",
    expertise: "Developer Tools, DevOps, Security",
    bio: "Full-stack developer and former DevOps engineer who has deployed and maintained infrastructure for applications serving millions of users. James writes our developer tool reviews and implementation guides.",
    initials: "JO",
    category: "Developer Tools",
  },
  {
    name: "Elena Torres",
    role: "Research Analyst",
    expertise: "HR Tech, Finance, Compliance",
    bio: "HR technology specialist with experience implementing enterprise HRIS and payroll systems at organizations with 1,000+ employees. Elena brings first-hand implementation experience to every HR and finance review.",
    initials: "ET",
    category: "HR & People",
  },
]

export default function TeamPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Our Team", href: "/team" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Our Team" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto mb-12">
            <Badge variant="default" className="mb-4">Our People</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Meet the PilotStack Team</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Our team brings over 50 years of combined software evaluation experience. Every reviewer specializes in their category and tests tools hands-on before writing a single word.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="p-6 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <h2 className="font-semibold">{member.name}</h2>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
                <div className="mt-auto pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Expertise:</span> {member.expertise}
                  </p>
                  <Link
                    href={`/category/${member.category.toLowerCase().replace(/[&\s]+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    View {member.category} reviews &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
