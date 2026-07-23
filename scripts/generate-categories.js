const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve('content');

const CATEGORY_MAP = [
  { slug: "project-management", name: "Project Management" },
  { slug: "crm-sales", name: "CRM & Sales" },
  { slug: "marketing-seo", name: "Marketing & SEO" },
  { slug: "design-creative", name: "Design & Creative" },
  { slug: "developer-tools", name: "Developer Tools" },
  { slug: "analytics-data", name: "Analytics & Data" },
  { slug: "hr-people", name: "HR & People" },
  { slug: "finance-accounting", name: "Finance & Accounting" },
  { slug: "productivity", name: "Productivity" },
  { slug: "security-compliance", name: "Security & Compliance" },
  { slug: "communication", name: "Communication" },
];

// Gather real content stats per category
const reviews = fs.readdirSync(path.join(CONTENT_DIR, 'reviews'))
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'reviews', f), 'utf-8')));

const guides = fs.readdirSync(path.join(CONTENT_DIR, 'guides'))
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'guides', f), 'utf-8')));

const glossary = fs.readdirSync(path.join(CONTENT_DIR, 'glossary'))
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'glossary', f), 'utf-8')));

for (const cat of CATEGORY_MAP) {
  const catReviews = reviews.filter(r => r.category === cat.name);
  const catGuides = guides.filter(g => g.category === cat.name);
  const catGlossary = glossary.filter(t => t.category === cat.name);

  const toolNames = catReviews.map(r => r.name);
  const guideLinks = catGuides.map(g => `- [${g.title}](/guides/${g.slug})`);
  const reviewLinks = catReviews.map(r => `- [${r.name} Review](/reviews/${r.slug})`);
  const termList = catGlossary.map(t => ({ term: t.term, def: t.definition }));

  const internalLinks = [
    ...catReviews.map(r => ({ label: `Read our ${r.name} Review`, href: `/reviews/${r.slug}` })),
    ...catGuides.map(g => ({ label: g.title, href: `/guides/${g.slug}` })),
  ];

  const content = {
    slug: cat.slug,
    name: cat.name,
    description: `${cat.name} software helps organizations streamline workflows, improve efficiency, and achieve better outcomes through specialized tools and platforms.`,
    longDescription: `${cat.name} software encompasses a range of tools designed to address the unique challenges faced by organizations in this domain. ${catReviews.length > 0 ? `On PilotStack, we have reviewed ${catReviews.length} leading tools including ${toolNames.slice(0,5).join(', ')}.` : `This category covers essential tools for modern businesses.`} Choosing the right platform requires careful evaluation of your specific needs, team size, technical requirements, and budget constraints.`,
    marketOverview: `The ${cat.name.toLowerCase()} software market continues to grow as organizations digitize operations and seek competitive advantages. ${catReviews.length > 0 ? `With ${catReviews.length} reviewed tools in this category, PilotStack provides comprehensive coverage to help you make informed decisions.` : `This is a dynamic category with evolving solutions for modern business challenges.`} Key trends include AI integration, improved collaboration features, and increasing emphasis on security and compliance.`,
    buyerConsiderations: [
      `Assess your specific requirements and pain points before evaluating solutions to ensure alignment with business needs`,
      `Evaluate total cost of ownership including subscription fees, implementation costs, training, and ongoing maintenance`,
      `Check integration capabilities with your existing technology stack to avoid data silos and manual workarounds`,
      `Review security features, compliance certifications, and data handling practices to meet organizational requirements`,
      `Consider scalability and whether the platform can grow with your organization without requiring a migration`,
      `Test user experience and adoption potential with hands-on trials involving actual end users`,
      `Evaluate vendor support quality, documentation, and community resources for ongoing success`,
      `Review contract terms including pricing predictability, data portability, and exit strategies`
    ],
    commonMistakes: [
      `Selecting software based on feature checklists rather than solving specific business problems, leading to complex underutilized systems`,
      `Underestimating the time and resources required for data migration, integration, and user training`,
      `Failing to involve end users in the evaluation process, resulting in low adoption rates and wasted investment`,
      `Choosing a solution that meets today's needs but cannot scale or adapt to future requirements`,
      `Neglecting to review security and compliance requirements until after implementation, creating costly remediation work`
    ],
    decisionFactors: [
      { factor: "Features and functionality", importance: "Critical", description: "The platform must address your core use cases effectively with the right balance of features and simplicity" },
      { factor: "Ease of use and adoption", importance: "Critical", description: "User-friendly interfaces and minimal learning curves drive adoption and maximize return on investment" },
      { factor: "Integration capabilities", importance: "High", description: "Seamless integration with existing tools and workflows prevents data silos and reduces manual effort" },
      { factor: "Scalability and performance", importance: "High", description: "The platform should accommodate growth in users, data volume, and feature requirements without degradation" },
      { factor: "Security and compliance", importance: "High", description: "Enterprise-grade security, data protection, and compliance with relevant regulations are essential" },
      { factor: "Total cost of ownership", importance: "High", description: "Consider all costs including subscription, implementation, training, customization, and ongoing operations" },
      { factor: "Vendor support and ecosystem", importance: "Medium", description: "Quality support, active development, community resources, and partner ecosystem contribute to long-term success" }
    ].slice(0, Math.min(7, catReviews.length + 3)),
    buyerJourney: {
      awareness: `Organizations recognize the need for ${cat.name.toLowerCase()} software when manual processes become inefficient, collaboration suffers, or competitive pressures demand better tools. Initial research involves reading expert reviews, comparing features, and understanding pricing models.`,
      consideration: `With a shortlist of 2-4 platforms, buyers conduct detailed evaluations including feature testing, integration compatibility checks, total cost analysis, and reference calls. Many organizations run pilot programs with 1-2 platforms to validate real-world performance.`,
      decision: `The final decision balances feature fit, user experience, total cost, vendor stability, and strategic alignment. Implementation planning, data migration strategy, and change management become critical factors in the selection process.`
    },
    pricingOverview: `Pricing for ${cat.name.toLowerCase()} software varies by deployment model, feature tier, and usage volume. Most platforms offer subscription-based pricing with monthly or annual billing. Free trials and freemium tiers are common for evaluation. Enterprise plans typically include advanced features, dedicated support, and custom terms. Annual billing usually offers 15-30% savings.`,
    bestFor: {
      smb: `Entry-level plans with essential features at affordable prices, often with self-service onboarding and standard support`,
      enterprise: `Comprehensive platforms with advanced features, dedicated support, custom integrations, SLA guarantees, and enterprise-grade security`,
      free: `Free tiers or open-source options that provide core functionality for small teams, individual users, or evaluation purposes`
    },
    relatedCategories: [],
    faqs: [
      { question: `How do I choose the right ${cat.name.toLowerCase()} software?`, answer: `Start by clearly defining your requirements, budget, and success criteria. Research options through expert reviews and comparisons, create a shortlist of 3-5 platforms, conduct hands-on trials, check references, and evaluate total cost of ownership. Involve end users in the evaluation to ensure adoption.` },
      { question: `What is the typical cost of ${cat.name.toLowerCase()} software?`, answer: `Costs range from free tier options to enterprise plans costing thousands per month depending on features, user count, and deployment model. Most providers offer tiered pricing. Annual billing typically provides cost savings over monthly subscriptions.` },
      { question: `How long does it take to implement ${cat.name.toLowerCase()} software?`, answer: `Implementation timelines vary from days for simple cloud-based tools to months for complex enterprise deployments. Factors include data migration, integration requirements, customization needs, and team training. Most modern SaaS platforms offer quick setup with guided onboarding.` }
    ]
  };

  if (internalLinks.length > 0) content.internalLinks = internalLinks.slice(0, 10);

  const outPath = path.join(CONTENT_DIR, 'categories', `${cat.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(content, null, 2));
  console.log(`Generated: ${cat.slug}.json (${catReviews.length} reviews, ${catGuides.length} guides)`);
}

console.log('\nAll category files generated.');
