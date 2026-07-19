# Medium Publishing Strategy

> A complete workflow for republishing PilotStack blog content on Medium to reach a wider audience while preserving SEO equity through canonical tags.

---

## 1. Why Medium for PilotStack?

Medium offers several strategic advantages for content distribution:

- **Built-in audience** — 100M+ monthly readers actively searching for content
- **SEO authority** — Medium.com has DA 95, meaning its pages rank quickly in Google
- **Publication network** — Access to curated publications with dedicated followings
- **Cross-linking potential** — Drive engaged readers back to PilotStack
- **Content discovery** — Medium's algorithm surfaces relevant content to non-followers

### Strategic Role

Medium serves as a **distribution channel**, not a primary publishing platform. All Medium content should be republished from the PilotStack blog with proper canonical tags pointing back to the original. This ensures:

1. Original content maintains search ranking priority
2. Medium pages still rank for long-tail keywords
3. Readers who discover via Medium can be directed to PilotStack

---

## 2. Import Checklist

Use this step-by-step checklist each time you republish on Medium.

### Pre-Import

- [ ] **Select the right article** — Best candidates: data-driven posts, listicles, how-to guides, industry analysis (avoid product announcements and company updates)
- [ ] **Update the original post** — Ensure the blog version is polished with proper formatting, images, and internal links
- [ ] **Add UTM parameters** — Append `?utm_source=medium&utm_medium=social&utm_campaign=republish` to all links pointing to PilotStack
- [ ] **Prepare a custom subtitle** — Medium allows a subtitle field; make it compelling and keyword-rich
- [ ] **Create a featured image** — Medium requires a header image; use 1400x700px minimum
- [ ] **Shorten the title** — Medium titles display best at 60 characters or fewer; adjust if needed
- [ ] **Remove date references** — Strip time-sensitive language like "this week" or "in 2024" to keep content evergreen
- [ ] **Check for affiliate links** — Medium's TOS restricts certain affiliate practices; ensure compliance

### Import Process

1. Log into Medium and click your profile image → "Write a story"
2. Click "Import a story" in the top-right menu (or use the import URL directly: medium.com/p/import)
3. Paste the full URL of the original blog post
4. Wait for import to complete — Medium will pull content, images, and formatting
5. **CRITICAL:** Medium will add a canonical tag pointing to the original URL **only if** the original URL is publicly accessible and contains proper meta tags
6. Verify the canonical tag is present — check settings (three-dot menu → "More settings" → "Canonical link")

### Post-Import Checklist

- [ ] **Verify canonical tag** — Confirm it points to your original blog post URL, not the Medium URL
- [ ] **Review formatting** — Medium's import can mangle formatting; check headers, lists, blockquotes, and code blocks
- [ ] **Optimize the subtitle** — Add or refine the subtitle field for click-through
- [ ] **Add Medium-only CTA** — Include a brief note at the bottom: "Originally published on [Blog Name]. Read the full article with additional resources [here]."
- [ ] **Tag appropriately** — Add 3-5 relevant tags (max 5)
- [ ] **Set featured image** — Upload a high-quality header image if import didn't bring one
- [ ] **Preview on mobile** — Check how the article renders on mobile devices
- [ ] **Submit to publication** — If applicable, submit to a curated Medium publication (see Section 6)
- [ ] **Schedule publish** — Best times: Tuesday-Thursday, 9-11 AM ET or 2-4 PM ET
- [ ] **Track** — Log the published URL in your content tracking spreadsheet

---

## 3. Canonical Tag Setup

### Why This Matters

Without a canonical tag, Google may index the Medium version instead of your original, splitting link equity between the two. A canonical tag tells Google: "The original version is the authoritative one."

### Verification Process

After importing, always verify the canonical tag:

**Method 1 — Via Medium UI:**
1. Click the three-dot menu in the top-right when editing your story
2. Select "More settings"
3. Look for "Canonical link" section
4. Ensure it displays your original blog URL

**Method 2 — Via Browser Inspector:**
1. Right-click the page and select "Inspect" or "View Page Source"
2. Search for `rel="canonical"`
3. Confirm the href points to your original URL

**Method 3 — URL Check:**
The canonical URL format in your page source should look like: `<link rel="canonical" href="https://pilotstack.com/blog/your-article-slug" />`

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Canonical tag missing | Re-import the article; ensure original URL is publicly accessible |
| Canonical points to wrong URL | Contact Medium support or delete and re-import with corrected URL |
| Original URL returns 404 | Make sure the blog post is published and indexed before importing |
| Canonical tag shows Medium URL | You may have accidentally set the canonical incorrectly in the import step |

### SEO Best Practices

1. **Always use canonical tags** — Never republish on Medium without them
2. **Never change the original URL** after importing to Medium (keep it stable)
3. **Keep original post updated** — If you update the blog post, update the Medium version too
4. **Monitor search console** — Track which version is ranking for target keywords
5. **Noindex for duplicates** — If you don't want Medium indexed at all, add `noindex` meta tag via Medium settings (but this defeats the purpose — canonical is better)

---

## 4. Publishing Template

### Front Matter / Metadata

| Field | Requirement | Example |
|-------|-------------|---------|
| **Title** | 60 chars max, includes primary keyword | "How to Choose the Right SaaS Tool: A Data-Driven Framework" |
| **Subtitle** | 100-140 chars, expands on title | "Based on analysis of 10,000+ real user reviews, here's the exact framework we use to evaluate software." |
| **Featured Image** | 1400x700px, high contrast, text-safe zone | Custom graphic with title overlay |
| **Tags** | 3-5 relevant tags | "SaaS", "Software Reviews", "Productivity", "Tech", "Startup" |
| **Canonical URL** | Full URL to original blog post | https://pilotstack.com/blog/saas-selection-framework |
| **Publish Settings** | Public + Eligible for distribution | Ensure "Distribute to Medium's topics" is enabled |

### Article Structure Template

```
# [Title: Catchy, keyword-rich, under 60 characters]

[Subtitle: 1-2 sentences expanding on the title]

[Featured Image with alt text]

## Introduction (2-3 sentences)
- Hook: Relatable problem or surprising statistic
- Context: Why this matters
- Thesis: What the reader will learn

## [Section 1 Heading]
- Key point with data/evidence
- Supporting anecdote or example
- Visual element (chart, screenshot, infographic)

## [Section 2 Heading]  
- Key point with data/evidence
- Supporting anecdote or example
- Visual element

## [Section 3 Heading]
- Key point with data/evidence
- Supporting anecdote or example
- Visual element

## [Section 4 Heading — Optional]
- Additional depth or counterpoint

## Conclusion
- Summarize key takeaways (2-3 bullets)
- Call to action
- Engagement question ("What's your experience?")

## About the Author
[Short bio with PilotStack mention and link]
```

### Call to Action Formats

**Subtle CTA:**
> *This article was originally published on the PilotStack blog, where we analyze thousands of software reviews to help you make better buying decisions.*

**Direct CTA:**
> *Want to see how your software stack compares? Check out PilotStack for side-by-side reviews, ratings, and real user insights.*

**Engagement CTA:**
> *What's the one software tool you couldn't live without? Let me know in the comments.*

### Bio Block

> [Founder Name] is the founder of PilotStack, a platform that aggregates verified user reviews to help teams make better software decisions. Follow PilotStack on [Twitter](link) and [LinkedIn](link).

---

## 5. Distribution Checklist

### Pre-Publish Distribution

- [ ] **Notify email list** — Teaser to subscribers: "New article on Medium"
- [ ] **Schedule social posts** — Twitter (3x), LinkedIn (2x), Facebook (1x)
- [ ] **Prepare quote graphics** — Create 3-5 quote cards from key statistics
- [ ] **Write alt-titles** — Prepare 5 alternative headlines for A/B testing in social posts
- [ ] **Tag relevant people** — If article mentions specific experts or companies, notify them

### Post-Publish Distribution

| Channel | Action | Timing | Frequency |
|---------|--------|--------|-----------|
| **Twitter** | Share with quote + image | Publication day | 1 tweet + 1 retweet later |
| **LinkedIn** | Post with key insight + link | Publication day | 1 post |
| **LinkedIn Article** | Cross-post if long-form | Day 2 | 1 article |
| **Newsletter** | Feature in next edition | Next send | 1 mention |
| **Reddit** | Share in relevant subreddit | Day 2-3 | 1 post (if allowed) |
| **Quora** | Answer related question with link | Day 3-5 | 1 answer |
| **GrowthHackers** | Submit as growth resource | Day 5 | 1 submission |
| **Indie Hackers** | Share if relevant to founders | Day 5-7 | 1 post |
| **Hacker News** | Submit if technical/data-heavy | Day 7 | 1 submission |
| **Slack communities** | Share in relevant channels | Day 1-3 | Per community rules |

### Medium Publication Distribution

1. **Submit to Medium topic tags** — Ensure "Distribute to topics" is enabled (settings → Advanced → "Distribute to Medium's topics")
2. **Submit to curated publications** — See Section 6 for targeting
3. **Engage with comments** — Reply to every comment within 24 hours
4. **Clap for commenters** — Reciprocal engagement increases visibility
5. **Share in Medium Facebook groups** — "Medium Bloggers" etc.

---

## 6. Publication Recommendations

### Top-Tier Medium Publications

| Publication | Followers | Focus | Acceptance Rate | Pitch Strategy |
|-------------|-----------|-------|-----------------|---------------|
| Better Marketing | 250K+ | Marketing, growth | 15-20% | Data-driven marketing content |
| The Startup | 750K+ | Entrepreneurship, SaaS | 10-15% | Founder stories, SaaS insights |
| Towards Data Science | 800K+ | Data, analytics | 5-10% | Data-heavy analysis pieces |
| UX Collective | 200K+ | User experience | 10-15% | Review UX, decision design |
| Entrepreneur's Handbook | 150K+ | Business, startups | 20-25% | SaaS business strategy |
| Marketing in the Age of Digital | 100K+ | Digital marketing | 25-30% | Content marketing with data |
| The Mission | 200K+ | Self-improvement, biz | 30%+ | Broad appeal topics |
| TechCrunch | 50K+ | Technology news | — | Rarely accepts, don't rely on |
| Noteworthy | 70K+ | Productivity | 15-20% | Tool comparisons, frameworks |
| Age of Awareness | 100K+ | Broad | 30%+ | General interest pieces |

### Niche Publications Worth Targeting

| Publication | Followers | Focus | Best For |
|-------------|-----------|-------|----------|
| Product Coalition | 30K+ | Product management | Product comparison posts |
| The SaaS Review | 15K+ | SaaS reviews | Directly relevant |
| Scale | 40K+ | Growth | Growth data posts |
| BB | 20K+ | B2B | B2B software insights |
| Startup Stash | 25K+ | Startup tools | Tool recommendations |
| Maker Mag | 10K+ | Indie makers | Build-in-public stories |

### Publication Submission Process

1. **Read submission guidelines** — Each publication has specific requirements
2. **Format your article** — Match publication style (headers, tone, structure)
3. **Submit as draft** — Use Medium's "Add to Publication" feature
4. **Add editor notes** — Include a brief note to the editor about the article
5. **Wait** — Response times vary from 24 hours to 2 weeks
6. **Follow up** — If no response in 7 days, submit elsewhere

### Backup Strategy

If rejected by publications, publish independently on your Medium profile with proper tags. Independent articles with good engagement can still reach large audiences through Medium's distribution algorithm.

---

## 7. Cross-Linking Strategy

### Internal Links from Medium to PilotStack

Each Medium article should contain 2-4 contextual links back to PilotStack:

| Link Type | Example | Placement |
|-----------|---------|-----------|
| **Contextual** | "According to PilotStack data, 73% of buyers..." | Middle of article |
| **Resource** | "For side-by-side comparisons, check out PilotStack" | End of section |
| **CTA** | "See how your tools rank on PilotStack" | Conclusion |
| **Author bio** | "Founder of PilotStack — a software review platform" | Bio section |

### Cross-Linking Between Medium Articles

- Link to related Medium articles within your content
- Create a "Recommended Reading" section in each article
- Build topic clusters (e.g., 3 articles on software reviews linked together)

### External Links

- Link to credible external sources (Harvard Business Review, Gartner, McKinsey data)
- Link to software company websites when comparing tools
- Avoid linking to direct competitors of PilotStack review platforms

### Link Tracking

All links to PilotStack should use UTM tracking:
```
https://pilotstack.com/resource-page
?utm_source=medium
&utm_medium=blog
&utm_campaign=article-title
&utm_content=cta-position
```

---

## 8. Performance Tracking

### Key Metrics

| Metric | Tool | Target per Article |
|--------|------|-------------------|
| Views | Medium Stats | 500+ in first 30 days |
| Read Ratio | Medium Stats | 40%+ (good), 60%+ (excellent) |
| Claps | Medium Stats | 50+ |
| Comments | Medium Stats | 5+ |
| Follows from article | Medium Stats | 10+ |
| Referral Traffic | Google Analytics | 100+ visits in 30 days |
| Sign-ups from Medium | UTM + DB | 10+ in 30 days |
| SEO rankings | Google Search Console | Top 10 for 2+ keywords |

### Medium Stats Interpretation

| Read Ratio | Verdict | Action |
|------------|---------|--------|
| <20% | Poor | Improve hook and intro; tighten writing |
| 20-40% | Below average | Strengthen structure; add more subheadings |
| 40-60% | Average | Continue testing similar formats |
| 60-80% | Good | Replicate structure and topic type |
| 80%+ | Excellent | Turn this into a content template |

### Tracking Spreadsheet

Create a tracking document with columns:

| Article Title | Original URL | Medium URL | Publication | Publish Date | Views | Reads | Read Ratio | Claps | Comments | Traffic | Sign-ups | Notes |
|---------------|-------------|-----------|-------------|-------------|-------|-------|-----------|-------|----------|---------|----------|-------|
| — | — | — | — | — | — | — | — | — | — | — | — | — |

---

## 9. Content Cadence

### Weekly Schedule

| Day | Activity | Time Required |
|-----|----------|---------------|
| Monday | Select article for republishing + update original | 30 min |
| Tuesday | Import, format, optimize for Medium | 45 min |
| Wednesday | Submit to publication (if applicable) | 15 min |
| Thursday | Publish + distribute | 30 min |
| Friday-Monday | Engage with comments + monitor performance | 10 min/day |

### Monthly Targets

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Articles Published | 4 | 6 | 8 |
| Cumulative Views | 2,000 | 6,000 | 15,000 |
| Cumulative Reads | 800 | 3,000 | 8,000 |
| Referral Traffic | 400 | 1,200 | 3,000 |
| New Followers | 50 | 150 | 400 |
| Sign-ups | 20 | 60 | 150 |

### Article Selection Priority

1. **Data-driven posts** with original statistics (highest engagement on Medium)
2. **How-to guides** and frameworks (high read ratio)
3. **Industry analysis** and trend posts (good for publications)
4. **Listicles** and comparison posts (shareable)
5. **Founder stories** (lower on Medium but good for personal brand)

> **Key Reminder:** Medium should drive traffic back to PilotStack, not replace it. Always use canonical tags. Always include CTAs. Always track performance. If an article performs poorly on Medium, analyze why and adjust — but don't stop publishing.
