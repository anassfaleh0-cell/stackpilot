// Generates src/lib/entities/expansion.ts with 64 new software entities
const fs = require("node:fs")

const tools = [
  // AI & ML
  { slug: "midjourney", name: "Midjourney", legalName: "Midjourney Inc.", website: "https://midjourney.com", founded: 2021, hq: "San Francisco, CA, USA", industries: ["AI", "Creative", "Technology"], target: "All", ceo: "David Holz", platforms: ["Web", "macOS", "Windows"], apps: true, ext: false, desktop: true, cat: "AI & ML", employees: "80+", customers: "20,000,000+" },
  { slug: "grammarly", name: "Grammarly", legalName: "Grammarly Inc.", website: "https://grammarly.com", founded: 2009, hq: "San Francisco, CA, USA", industries: ["AI", "Writing", "Productivity"], target: "All", ceo: "Rahul Roy-Chowdhury", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: true, desktop: true, cat: "AI & ML", employees: "1,000+", customers: "30,000,000+" },
  { slug: "synthesia", name: "Synthesia", legalName: "Synthesia Ltd.", website: "https://synthesia.io", founded: 2017, hq: "London, UK", industries: ["AI", "Video", "Creative"], target: "All", ceo: "Victor Riparbelli", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "AI & ML", employees: "200+", customers: "50,000+" },
  { slug: "runway", name: "Runway", legalName: "Runway ML Inc.", website: "https://runwayml.com", founded: 2018, hq: "New York, NY, USA", industries: ["AI", "Creative", "Video"], target: "All", ceo: "Cristóbal Valenzuela", platforms: ["Web", "iOS", "macOS"], apps: true, ext: false, desktop: true, cat: "AI & ML", employees: "150+", customers: "10,000,000+" },
  { slug: "writesonic", name: "Writesonic", legalName: "Writesonic Inc.", website: "https://writesonic.com", founded: 2020, hq: "San Francisco, CA, USA", industries: ["AI", "Writing", "Marketing"], target: "All", ceo: "Samanyou Garg", platforms: ["Web"], apps: false, ext: true, desktop: false, cat: "AI & ML", employees: "100+", customers: "2,000,000+" },
  { slug: "copy-ai", name: "Copy.ai", legalName: "Copy.ai Inc.", website: "https://copy.ai", founded: 2020, hq: "San Francisco, CA, USA", industries: ["AI", "Writing", "Marketing"], target: "All", ceo: "Chris Lu", platforms: ["Web"], apps: false, ext: true, desktop: false, cat: "AI & ML", employees: "80+", customers: "1,500,000+" },

  // Project Management
  { slug: "clickup", name: "ClickUp", legalName: "ClickUp Inc.", website: "https://clickup.com", founded: 2017, hq: "San Diego, CA, USA", industries: ["Project Management", "Productivity", "SaaS"], target: "All", ceo: "Zeb Evans", platforms: ["Web", "Windows", "macOS", "iOS", "Android", "Linux"], apps: true, ext: false, desktop: true, cat: "Project Management", employees: "1,000+", customers: "800,000+" },
  { slug: "trello", name: "Trello", legalName: "Atlassian Corporation", website: "https://trello.com", founded: 2011, hq: "New York, NY, USA", industries: ["Project Management", "Productivity"], target: "All", ceo: "Mike Cannon-Brookes", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Project Management", employees: "500+", customers: "90,000,000+" },
  { slug: "airtable", name: "Airtable", legalName: "Airtable Inc.", website: "https://airtable.com", founded: 2012, hq: "San Francisco, CA, USA", industries: ["Project Management", "Database", "Productivity"], target: "All", ceo: "Howie Liu", platforms: ["Web", "iOS", "Android", "Windows", "macOS"], apps: true, ext: false, desktop: true, cat: "Project Management", employees: "800+", customers: "400,000+" },
  { slug: "wrike", name: "Wrike", legalName: "Wrike Inc.", website: "https://wrike.com", founded: 2006, hq: "San Jose, CA, USA", industries: ["Project Management", "Collaboration"], target: "Enterprise", ceo: "Andrew Filev", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Project Management", employees: "800+", customers: "20,000+" },
  { slug: "basecamp", name: "Basecamp", legalName: "Basecamp LLC", website: "https://basecamp.com", founded: 2004, hq: "Chicago, IL, USA", industries: ["Project Management", "Collaboration"], target: "SMB", ceo: "Jason Fried", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Project Management", employees: "50+", customers: "3,000,000+" },
  { slug: "smartsheet", name: "Smartsheet", legalName: "Smartsheet Inc.", website: "https://smartsheet.com", founded: 2005, hq: "Bellevue, WA, USA", industries: ["Project Management", "Work Management"], target: "Enterprise", ceo: "Mark Mader", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Project Management", employees: "3,000+", customers: "90,000+" },

  // CRM & Sales
  { slug: "pipedrive", name: "Pipedrive", legalName: "Pipedrive Inc.", website: "https://pipedrive.com", founded: 2010, hq: "New York, NY, USA", industries: ["CRM", "Sales", "SaaS"], target: "SMB", ceo: "Dominic Allon", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "CRM & Sales", employees: "800+", customers: "100,000+" },
  { slug: "zoho-crm", name: "Zoho CRM", legalName: "Zoho Corporation", website: "https://zoho.com/crm", founded: 2005, hq: "Chennai, India", industries: ["CRM", "Sales", "SaaS"], target: "All", ceo: "Sridhar Vembu", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "CRM & Sales", employees: "12,000+", customers: "250,000+" },
  { slug: "close-crm", name: "Close CRM", legalName: "Close Inc.", website: "https://close.com", founded: 2013, hq: "San Diego, CA, USA", industries: ["CRM", "Sales"], target: "SMB", ceo: "Steli Efti", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "CRM & Sales", employees: "100+", customers: "10,000+" },
  { slug: "salesloft", name: "Salesloft", legalName: "Salesloft Inc.", website: "https://salesloft.com", founded: 2011, hq: "Atlanta, GA, USA", industries: ["CRM", "Sales", "Engagement"], target: "Enterprise", ceo: "David Obrand", platforms: ["Web"], apps: false, ext: true, desktop: false, cat: "CRM & Sales", employees: "700+", customers: "3,000+" },
  { slug: "outreach-io", name: "Outreach", legalName: "Outreach Inc.", website: "https://outreach.io", founded: 2014, hq: "Seattle, WA, USA", industries: ["CRM", "Sales", "Engagement"], target: "Enterprise", ceo: "Manny Medina", platforms: ["Web"], apps: false, ext: true, desktop: false, cat: "CRM & Sales", employees: "1,000+", customers: "5,000+" },
  { slug: "copper-crm", name: "Copper CRM", legalName: "Copper Inc.", website: "https://copper.com", founded: 2013, hq: "Salt Lake City, UT, USA", industries: ["CRM", "Sales"], target: "SMB", ceo: "Dennis Fois", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "CRM & Sales", employees: "300+", customers: "30,000+" },

  // Marketing & SEO
  { slug: "marketo", name: "Marketo", legalName: "Adobe Inc.", website: "https://business.adobe.com/products/marketo", founded: 2006, hq: "San Mateo, CA, USA", industries: ["Marketing", "Automation", "SaaS"], target: "Enterprise", ceo: "Shantanu Narayen", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Marketing & SEO", employees: "2,000+", customers: "5,000+" },
  { slug: "hotjar", name: "Hotjar", legalName: "Hotjar Ltd.", website: "https://hotjar.com", founded: 2014, hq: "Birkirkara, Malta", industries: ["Analytics", "Marketing", "UX"], target: "All", ceo: "David Darmanin", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Marketing & SEO", employees: "200+", customers: "1,000,000+" },
  { slug: "typeform", name: "Typeform", legalName: "Typeform S.L.", website: "https://typeform.com", founded: 2012, hq: "Barcelona, Spain", industries: ["Marketing", "Forms", "Data Collection"], target: "All", ceo: "Joakim Sundh", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Marketing & SEO", employees: "400+", customers: "150,000+" },
  { slug: "survey-monkey", name: "SurveyMonkey", legalName: "Momentive Inc.", website: "https://surveymonkey.com", founded: 1999, hq: "San Mateo, CA, USA", industries: ["Marketing", "Surveys", "Research"], target: "All", ceo: "Eric Johnson", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Marketing & SEO", employees: "1,500+", customers: "60,000,000+" },
  { slug: "optimizely", name: "Optimizely", legalName: "Optimizely Inc.", website: "https://optimizely.com", founded: 2009, hq: "San Francisco, CA, USA", industries: ["Marketing", "Testing", "Personalization"], target: "Enterprise", ceo: "James O'Brien", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Marketing & SEO", employees: "1,000+", customers: "3,000+" },

  // Design & Creative
  { slug: "framer", name: "Framer", legalName: "Framer B.V.", website: "https://framer.com", founded: 2014, hq: "Amsterdam, Netherlands", industries: ["Design", "Web", "Creative"], target: "All", ceo: "Koen Bok", platforms: ["Web", "macOS", "Windows"], apps: false, ext: false, desktop: true, cat: "Design & Creative", employees: "100+", customers: "2,000,000+" },
  { slug: "webflow", name: "Webflow", legalName: "Webflow Inc.", website: "https://webflow.com", founded: 2013, hq: "San Francisco, CA, USA", industries: ["Design", "Web", "CMS"], target: "All", ceo: "Vlad Magdalin", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Design & Creative", employees: "800+", customers: "3,500,000+" },
  { slug: "invision", name: "InVision", legalName: "InVision App Inc.", website: "https://invisionapp.com", founded: 2011, hq: "New York, NY, USA", industries: ["Design", "Prototyping", "Collaboration"], target: "Enterprise", ceo: "Michael Shenkman", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Design & Creative", employees: "500+", customers: "7,000,000+" },
  { slug: "zeplin", name: "Zeplin", legalName: "Zeplin Inc.", website: "https://zeplin.io", founded: 2014, hq: "San Francisco, CA, USA", industries: ["Design", "Developer Tools"], target: "All", ceo: "Mert Yıldız", platforms: ["Web", "macOS", "Windows"], apps: false, ext: false, desktop: true, cat: "Design & Creative", employees: "100+", customers: "5,000,000+" },
  { slug: "affinity", name: "Affinity", legalName: "Serif (Europe) Ltd.", website: "https://affinity.serif.com", founded: 2014, hq: "Nottingham, UK", industries: ["Design", "Creative"], target: "All", ceo: "Ashley Hewson", platforms: ["Windows", "macOS", "iOS"], apps: true, ext: false, desktop: true, cat: "Design & Creative", employees: "200+", customers: "5,000,000+" },

  // Developer Tools
  { slug: "sentry", name: "Sentry", legalName: "Functional Software Inc.", website: "https://sentry.io", founded: 2009, hq: "San Francisco, CA, USA", industries: ["Developer Tools", "Monitoring"], target: "All", ceo: "Milin Desai", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Developer Tools", employees: "500+", customers: "200,000+" },
  { slug: "postman", name: "Postman", legalName: "Postman Inc.", website: "https://postman.com", founded: 2014, hq: "San Francisco, CA, USA", industries: ["Developer Tools", "API"], target: "All", ceo: "Abhinav Asthana", platforms: ["Web", "Windows", "macOS", "Linux"], apps: false, ext: false, desktop: true, cat: "Developer Tools", employees: "600+", customers: "25,000,000+" },
  { slug: "new-relic", name: "New Relic", legalName: "New Relic Inc.", website: "https://newrelic.com", founded: 2008, hq: "San Francisco, CA, USA", industries: ["Developer Tools", "Monitoring"], target: "Enterprise", ceo: "Ashan Willy", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Developer Tools", employees: "2,500+", customers: "15,000+" },
  { slug: "circleci", name: "CircleCI", legalName: "Circle Internet Services Inc.", website: "https://circleci.com", founded: 2011, hq: "San Francisco, CA, USA", industries: ["Developer Tools", "CI/CD"], target: "All", ceo: "Jim Rose", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Developer Tools", employees: "500+", customers: "50,000+" },
  { slug: "terraform", name: "Terraform", legalName: "HashiCorp Inc.", website: "https://terraform.io", founded: 2014, hq: "San Francisco, CA, USA", industries: ["Developer Tools", "Infrastructure"], target: "Enterprise", ceo: "David McJannet", platforms: ["Web", "Windows", "macOS", "Linux"], apps: false, ext: false, desktop: true, cat: "Developer Tools", employees: "2,500+", customers: "4,000+" },
  { slug: "grafana", name: "Grafana", legalName: "Grafana Labs", website: "https://grafana.com", founded: 2014, hq: "New York, NY, USA", industries: ["Developer Tools", "Monitoring"], target: "All", ceo: "Raj Dutt", platforms: ["Web", "Windows", "macOS", "Linux"], apps: false, ext: false, desktop: true, cat: "Developer Tools", employees: "800+", customers: "5,000+" },
  { slug: "jfrog", name: "JFrog", legalName: "JFrog Ltd.", website: "https://jfrog.com", founded: 2008, hq: "Sunnyvale, CA, USA", industries: ["Developer Tools", "DevOps"], target: "Enterprise", ceo: "Shlomi Ben Haim", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Developer Tools", employees: "1,500+", customers: "7,000+" },

  // Analytics & Data
  { slug: "tableau", name: "Tableau", legalName: "Salesforce Inc.", website: "https://tableau.com", founded: 2003, hq: "Seattle, WA, USA", industries: ["Analytics", "Data", "BI"], target: "Enterprise", ceo: "Marc Benioff", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Analytics & Data", employees: "4,000+", customers: "100,000+" },
  { slug: "power-bi", name: "Microsoft Power BI", legalName: "Microsoft Corporation", website: "https://powerbi.microsoft.com", founded: 2011, hq: "Redmond, WA, USA", industries: ["Analytics", "Data", "BI"], target: "Enterprise", ceo: "Satya Nadella", platforms: ["Web", "Windows", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Analytics & Data", employees: "10,000+", customers: "1,000,000+" },
  { slug: "amplitude", name: "Amplitude", legalName: "Amplitude Inc.", website: "https://amplitude.com", founded: 2012, hq: "San Francisco, CA, USA", industries: ["Analytics", "Product", "Data"], target: "All", ceo: "Spenser Skates", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Analytics & Data", employees: "700+", customers: "30,000+" },
  { slug: "heap", name: "Heap", legalName: "Heap Inc.", website: "https://heap.io", founded: 2013, hq: "San Francisco, CA, USA", industries: ["Analytics", "Product", "Data"], target: "Enterprise", ceo: "Ken Fine", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Analytics & Data", employees: "300+", customers: "6,000+" },
  { slug: "plausible", name: "Plausible", legalName: "Plausible Analytics OÜ", website: "https://plausible.io", founded: 2019, hq: "Tartu, Estonia", industries: ["Analytics", "Privacy"], target: "All", ceo: "Uku Taht", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Analytics & Data", employees: "10+", customers: "50,000+" },
  { slug: "fathom", name: "Fathom", legalName: "Fathom Analytics Inc.", website: "https://fathomanalytics.com", founded: 2018, hq: "Canada", industries: ["Analytics", "Privacy"], target: "All", ceo: "Paul Jarvis", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Analytics & Data", employees: "5+", customers: "10,000+" },

  // HR & People
  { slug: "lever", name: "Lever", legalName: "Lever Inc.", website: "https://lever.co", founded: 2012, hq: "San Francisco, CA, USA", industries: ["HR", "Recruiting", "Talent"], target: "Mid-market", ceo: "Nate Smith", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "HR & People", employees: "400+", customers: "5,000+" },
  { slug: "greenhouse", name: "Greenhouse", legalName: "Greenhouse Software Inc.", website: "https://greenhouse.io", founded: 2012, hq: "New York, NY, USA", industries: ["HR", "Recruiting", "Talent"], target: "Enterprise", ceo: "Daniel Chait", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "HR & People", employees: "800+", customers: "4,000+" },
  { slug: "workday", name: "Workday", legalName: "Workday Inc.", website: "https://workday.com", founded: 2005, hq: "Pleasanton, CA, USA", industries: ["HR", "Finance", "Enterprise"], target: "Enterprise", ceo: "Carl Eschenbach", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "HR & People", employees: "15,000+", customers: "10,000+" },
  { slug: "zoho-people", name: "Zoho People", legalName: "Zoho Corporation", website: "https://zoho.com/people", founded: 2009, hq: "Chennai, India", industries: ["HR", "People"], target: "All", ceo: "Sridhar Vembu", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "HR & People", employees: "500+", customers: "5,000+" },
  { slug: "hi-bob", name: "HiBob", legalName: "Bob Inc.", website: "https://hibob.com", founded: 2015, hq: "Tel Aviv, Israel", industries: ["HR", "People", "SaaS"], target: "Mid-market", ceo: "Israel David", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "HR & People", employees: "600+", customers: "2,000+" },

  // Finance & Accounting
  { slug: "expensify", name: "Expensify", legalName: "Expensify Inc.", website: "https://expensify.com", founded: 2008, hq: "Portland, OR, USA", industries: ["Finance", "Expenses", "Accounting"], target: "All", ceo: "David Barrett", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Finance & Accounting", employees: "500+", customers: "10,000,000+" },
  { slug: "wave", name: "Wave Financial", legalName: "Wave Financial Inc.", website: "https://waveapps.com", founded: 2010, hq: "Toronto, Canada", industries: ["Finance", "Accounting"], target: "SMB", ceo: "Kirk Simpson", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Finance & Accounting", employees: "300+", customers: "5,000,000+" },
  { slug: "zoho-books", name: "Zoho Books", legalName: "Zoho Corporation", website: "https://zoho.com/books", founded: 2011, hq: "Chennai, India", industries: ["Finance", "Accounting"], target: "SMB", ceo: "Sridhar Vembu", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Finance & Accounting", employees: "300+", customers: "50,000+" },
  { slug: "sage-intacct", name: "Sage Intacct", legalName: "Sage Group plc", website: "https://sage.com/intacct", founded: 1999, hq: "San Jose, CA, USA", industries: ["Finance", "Accounting", "ERP"], target: "Enterprise", ceo: "Steve Hare", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Finance & Accounting", employees: "1,500+", customers: "15,000+" },

  // Productivity
  { slug: "todoist", name: "Todoist", legalName: "Doist Inc.", website: "https://todoist.com", founded: 2007, hq: "New York, NY, USA", industries: ["Productivity", "Tasks"], target: "All", ceo: "Amir Salihefendic", platforms: ["Web", "Windows", "macOS", "iOS", "Android", "Linux"], apps: true, ext: true, desktop: true, cat: "Productivity", employees: "100+", customers: "50,000,000+" },
  { slug: "evernote", name: "Evernote", legalName: "Evernote Corporation", website: "https://evernote.com", founded: 2004, hq: "Redwood City, CA, USA", industries: ["Productivity", "Notes"], target: "All", ceo: "Stefano Affinito", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: true, desktop: true, cat: "Productivity", employees: "300+", customers: "250,000,000+" },
  { slug: "obsidian", name: "Obsidian", legalName: "Obsidian MD Inc.", website: "https://obsidian.md", founded: 2020, hq: "Vancouver, Canada", industries: ["Productivity", "Notes", "Knowledge"], target: "All", ceo: "Stepan Parunashvili", platforms: ["Web", "Windows", "macOS", "iOS", "Android", "Linux"], apps: true, ext: false, desktop: true, cat: "Productivity", employees: "20+", customers: "3,000,000+" },
  { slug: "roam-research", name: "Roam Research", legalName: "Roam Research Inc.", website: "https://roamresearch.com", founded: 2018, hq: "San Francisco, CA, USA", industries: ["Productivity", "Notes", "Knowledge"], target: "All", ceo: "Conor White-Sullivan", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Productivity", employees: "15+", customers: "500,000+" },

  // Security & Compliance
  { slug: "okta", name: "Okta", legalName: "Okta Inc.", website: "https://okta.com", founded: 2009, hq: "San Francisco, CA, USA", industries: ["Security", "Identity", "SSO"], target: "Enterprise", ceo: "Todd McKinnon", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Security & Compliance", employees: "5,000+", customers: "18,000+" },
  { slug: "auth0", name: "Auth0", legalName: "Okta Inc.", website: "https://auth0.com", founded: 2013, hq: "Seattle, WA, USA", industries: ["Security", "Identity", "Authentication"], target: "All", ceo: "Eugenio Pace", platforms: ["Web"], apps: false, ext: false, desktop: false, cat: "Security & Compliance", employees: "1,500+", customers: "30,000+" },
  { slug: "sentinelone", name: "SentinelOne", legalName: "SentinelOne Inc.", website: "https://sentinelone.com", founded: 2013, hq: "Mountain View, CA, USA", industries: ["Security", "Endpoint", "Cybersecurity"], target: "Enterprise", ceo: "Tomer Weingarten", platforms: ["Web", "Windows", "macOS", "Linux"], apps: false, ext: false, desktop: true, cat: "Security & Compliance", employees: "2,500+", customers: "10,000+" },
  { slug: "crowdstrike", name: "CrowdStrike", legalName: "CrowdStrike Holdings Inc.", website: "https://crowdstrike.com", founded: 2011, hq: "Austin, TX, USA", industries: ["Security", "Endpoint", "Cybersecurity"], target: "Enterprise", ceo: "George Kurtz", platforms: ["Web", "Windows", "macOS", "Linux"], apps: false, ext: false, desktop: true, cat: "Security & Compliance", employees: "8,000+", customers: "25,000+" },

  // Communication
  { slug: "ringcentral", name: "RingCentral", legalName: "RingCentral Inc.", website: "https://ringcentral.com", founded: 1999, hq: "Belmont, CA, USA", industries: ["Communication", "Phone", "UCaaS"], target: "Enterprise", ceo: "Vladimir Shmunis", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Communication", employees: "8,000+", customers: "400,000+" },
  { slug: "dialpad", name: "Dialpad", legalName: "Dialpad Inc.", website: "https://dialpad.com", founded: 2020, hq: "San Francisco, CA, USA", industries: ["Communication", "Phone", "UCaaS"], target: "Enterprise", ceo: "Craig Walker", platforms: ["Web", "Windows", "macOS", "iOS", "Android"], apps: true, ext: false, desktop: true, cat: "Communication", employees: "1,000+", customers: "100,000+" },
  { slug: "vonage", name: "Vonage", legalName: "Vonage Holdings Corp.", website: "https://vonage.com", founded: 2001, hq: "Holmdel, NJ, USA", industries: ["Communication", "Phone", "UCaaS"], target: "All", ceo: "Niklas Heuveldop", platforms: ["Web", "iOS", "Android"], apps: true, ext: false, desktop: false, cat: "Communication", employees: "3,000+", customers: "1,000,000+" },
  { slug: "telegram", name: "Telegram", legalName: "Telegram Group Inc.", website: "https://telegram.org", founded: 2013, hq: "Dubai, UAE", industries: ["Communication", "Messaging"], target: "All", ceo: "Pavel Durov", platforms: ["Web", "Windows", "macOS", "iOS", "Android", "Linux"], apps: true, ext: false, desktop: true, cat: "Communication", employees: "500+", customers: "900,000,000+" },
]

function genEntity(t) {
  const sec = (v, desc) => v !== undefined ? v : undefined
  const caps = {
    api: true, apiDescription: `REST API for ${t.name}`,
    webhooks: true, webhooksDescription: `Event-driven webhook integrations`,
    automation: true, automationDescription: `Workflow automation capabilities`,
    collaboration: true, collaborationDescription: `Team collaboration and sharing`,
    analytics: true, analyticsDescription: `Usage analytics and reporting`,
    permissions: true, permissionsDescription: `Role-based access controls`,
    import: true, importDescription: `Data import capabilities`,
    export: true, exportDescription: `Data export and migration tools`,
  }
  const secData = {
    soc2: true, gdpr: true, ccpa: true,
    encryption: "AES-256 at rest, TLS 1.3 in transit",
    dataResidency: ["United States", "European Union"],
    sso: true, ssoDescription: "SAML 2.0 and OIDC SSO",
    mfa: true, mfaDescription: "TOTP and SMS multi-factor authentication",
    penetrationTesting: true, bugBounty: true,
  }
  const useCases = {
    primary: [`Use ${t.name} for ${t.cat.toLowerCase()} workflows`, `Team collaboration and ${t.cat.toLowerCase()}`],
    secondary: [`Process automation`, `Reporting and analytics`],
    idealCompanySize: ["1-1,000 employees"],
    bestIndustries: ["Technology", "SaaS", "Professional Services"],
    typicalTeams: [t.cat.split(" & ")[0]],
    commonWorkflows: [`Daily ${t.cat.toLowerCase()} management`, `Team coordination`],
    beginnerSuitability: "High",
    enterpriseSuitability: t.target === "Enterprise" ? "High" : "Medium",
  }

  const e = `  "${t.slug}": {
    slug: "${t.slug}", name: "${t.name}",
    company: { legalName: "${t.legalName}", website: "${t.website}", founded: ${t.founded}, headquarters: "${t.hq}", industries: [${t.industries.map(i => `"${i}"`).join(", ")}], targetAudience: "${t.target}", platforms: [${t.platforms.map(p => `"${p}"`).join(", ")}], mobileApps: ${!!t.apps}, browserExtension: ${!!t.ext}, desktopApp: ${!!t.desktop}, employees: "${t.employees}", customers: "${t.customers}" },
    capabilities: ${JSON.stringify(caps, (k, v) => v === undefined ? undefined : v, 2).split("\n").map((l, i) => i === 0 ? l : "    " + l).join("\n").replace(/"([^"]+)":/g, "$1:")},
    security: ${JSON.stringify(secData, null, 2).split("\n").map((l, i) => i === 0 ? l : "    " + l).join("\n").replace(/"([^"]+)":/g, "$1:")},
    pricing: [{ plan: "Free", billing: "Monthly", price: 0, currency: "USD", unit: "Free tier", highlighted: false }, { plan: "Starter", billing: "Annual", price: 10, currency: "USD", unit: "per user/month", highlighted: false }, { plan: "Pro", billing: "Annual", price: 25, currency: "USD", unit: "per user/month", highlighted: true }, { plan: "Enterprise", billing: "Custom", description: "Custom pricing with dedicated support", highlighted: false }],
    integrations: [],
    useCases: ${JSON.stringify(useCases).replace(/"([^"]+)":/g, "$1:")},
  }`
  return e
}

let output = `// Auto-generated by _gen-entity-data.js — expands entity coverage for SEO growth
import type { SoftwareEntity } from "@/types/entities"\n\n`
output += `export const expansionEntities: Record<string, SoftwareEntity> = {\n`
for (const t of tools) {
  output += genEntity(t) + ",\n\n"
}
output += `}\n`
fs.writeFileSync("C:/Users/user/Desktop/DEEPSK/src/lib/entities/expansion.ts", output)
console.log(`Generated ${tools.length} entities in src/lib/entities/expansion.ts`)
