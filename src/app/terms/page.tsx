import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "PilotStack's terms of service govern the use of our website, content, and services. By using PilotStack, you agree to these terms and conditions.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Terms of Service", href: "/terms" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Terms of Service" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
            <p className="text-muted-foreground"><em>Last updated: July 16, 2026</em></p>

            <h2>Acceptance of Terms</h2>
            <p>By accessing or using PilotStack ("the Service", "we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our website. Continued use after any modifications constitutes acceptance of the updated terms.</p>

            <h2>Use of Service</h2>
            <p>You agree to use PilotStack only for lawful purposes and in accordance with these terms. You may not:</p>
            <ul>
              <li>Scrape, crawl, or systematically extract content from our website without prior written permission</li>
              <li>Use the Service for any fraudulent or illegal activity</li>
              <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems</li>
            </ul>

            <h2>Content and Editorial Independence</h2>
            <p>All content on PilotStack, including tool reviews, comparisons, ratings, and recommendations, is provided for informational purposes only. We strive for accuracy through our editorial process (detailed on our <a href="/methodology">Methodology page</a>), but make no warranties about the completeness, timeliness, or reliability of our content.</p>
            <p>Tool ratings and reviews represent the independent opinions of our editorial team. We follow strict editorial guidelines that prohibit sponsors, advertisers, or tool vendors from influencing our ratings or review content.</p>

            <h2>Affiliate Disclosure</h2>
            <p>PilotStack may earn affiliate commissions from some of the products and services we review. When you click an affiliate link on our site and make a purchase, we may receive a commission at no additional cost to you. This does not affect our editorial independence — we do not accept payment for positive reviews, and our ratings are determined solely by our editorial process as described on our <a href="/methodology">Methodology page</a>.</p>
            <p>We only participate in affiliate programs for products we have independently evaluated and would recommend regardless of compensation. Affiliate relationships are disclosed on individual review and comparison pages where applicable.</p>

            <h2>User Submissions</h2>
            <p>If you submit comments, feedback, or other content to PilotStack, you grant us a non-exclusive, royalty-free license to use, display, and distribute that content in connection with the Service. You represent that your submissions do not infringe on any third-party rights.</p>

            <h2>Intellectual Property</h2>
            <p>All content, trademarks, logos, and intellectual property on PilotStack — including but not limited to text, graphics, ratings methodologies, and page layouts — are owned by or licensed to us. You may not reproduce, distribute, modify, or create derivative works without our express written permission. Short excerpts with proper attribution (linking back to the original PilotStack page) for commentary or criticism are permitted under fair use.</p>

            <h2>Disclaimer of Warranties</h2>
            <p>PilotStack is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected. We make no representation that any tool or service reviewed on PilotStack is suitable for your specific needs.</p>

            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, PilotStack and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of or inability to use the Service. Our total liability for any claim arising from these terms shall not exceed $100 USD.</p>

            <h2>Governing Law and Dispute Resolution</h2>
            <p>These Terms of Service are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, with proceedings held in Delaware. You agree to resolve disputes on an individual basis and waive any right to participate in class action lawsuits.</p>

            <h2>Termination</h2>
            <p>We reserve the right to terminate or suspend access to our Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, third parties, or the Service itself.</p>

            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Material changes will be communicated via email to subscribers and by posting a notice on the website. Changes are effective 30 days after posting for existing users and immediately for new users. Your continued use of the Service after the effective date constitutes acceptance of the updated terms.</p>

            <h2>Contact</h2>
            <p>For questions about these Terms of Service, contact us at <strong>legal@pilotstack.online</strong>.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
