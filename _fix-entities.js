const fs = require("fs");
let content = fs.readFileSync("src/lib/entities/data.ts", "utf8");

const fixes = { funding: 0, pciDss: 0, pricing: 0, ccpa: 0 };

// Funding values for all 27 entities that need it
const fundingData = [
  ["1password", '"$1B+"'],
  ["bitwarden", '"$100M+"'],
  ["slack", '"$1.4B+"'],
  ["notion", '"$275M+"'],
  ["figma", '"$200M+"'],
  ["linear", '"$50M+"'],
  ["asana", '"$200M+"'],
  ["jira", '"$2B+"'],
  ["salesforce", '"$100B+"'],
  ["hubspot", '"$100M+"'],
  ["github", '"$350M+"'],
  ["gitlab", '"$426M+"'],
  ["vercel", '"$250M+"'],
  ["stripe", '"$8.7B+"'],
  ["docker", '"$270M+"'],
  ["supabase", '"$140M+"'],
  ["zoom", '"$1.5B+"'],
  ["mailchimp", '"$1.2B+"'],
  ["quickbooks", '"Public (Intuit)"'],
  ["xero", '"Public (XRO)"'],
  ["sketch", '"Bootstrapped"'],
  ["semrush", '"$40M+"'],
  ["google-analytics", '"Public (Google)"'],
  ["monday-com", '"$234M+"'],
  ["microsoft-teams", '"Public (Microsoft)"'],
  ["firebase", '"Public (Google)"'],
  ["adp", '"Public (ADP)"'],
];

// Entities already having funding: calendly, freshbooks, gusto, bamboohr, rippling, canva, chatgpt, jasper, ahrefs, mixpanel, netlify

// For each funding entry, find the entity by slug and add funding after headquarters
for (const [slug, value] of fundingData) {
  // Find the entity slug line
  const slugLine = `  "${slug}": {`;
  let slugPos = content.indexOf(slugLine);
  if (slugPos === -1) {
    console.log(`  ${slug}: entity not found`);
    continue;
  }

  // Get the entity block (next 2000 chars)
  const entityBlock = content.slice(slugPos, slugPos + 2500);

  // Check if funding already exists in this entity
  if (entityBlock.includes("funding:")) {
    console.log(`  ${slug}: already has funding`);
    continue;
  }

  // Find company block
  const companyIdx = entityBlock.indexOf("company: {");
  if (companyIdx === -1) {
    console.log(`  ${slug}: no company block`);
    continue;
  }

  // Find headquarters within the company block
  const afterCompanyStart = entityBlock.slice(companyIdx);
  const hqMatch = afterCompanyStart.match(/headquarters: "[^"]+"/);
  if (!hqMatch) {
    console.log(`  ${slug}: no headquarters found`);
    continue;
  }

  // Find what comes after the hq value - either ",\n  " (multi-line) or "," or "" (compact)
  const afterHq = afterCompanyStart.slice(hqMatch.index + hqMatch[0].length);
  let insertAfter = "";
  if (afterHq.startsWith(",")) {
    // Take the comma and any whitespace/newline after it
    const afterCommaMatch = afterHq.match(/^(,)(\s*)/);
    if (afterCommaMatch) {
      insertAfter = afterCommaMatch[0];
    }
  }

  // Build what we need to insert
  const realPos = slugPos + companyIdx + hqMatch.index + hqMatch[0].length;
  let insertion = "";
  if (insertAfter) {
    // Multi-line: the format is `headquarters: "value",\n`
    // Insert `      funding: "value",\n` after the comma+newline
    const afterNewline = insertAfter.includes("\n");
    if (afterNewline) {
      // After headquarters line, insert funding on a new line
      const indent = "      ";
      insertion = `\n${indent}funding: ${value},`;
    } else {
      // Compact format: insert funding inline
      insertion = ` funding: ${value},`;
    }
    const insertPos = realPos + insertAfter.length;
    content = content.slice(0, insertPos) + insertion + content.slice(insertPos);
    fixes.funding++;
    console.log(`  ${slug}: added funding (${afterNewline ? "multi" : "compact"})`);
  } else {
    console.log(`  ${slug}: unexpected format after hq`);
  }
}

// --- pciDss: add to entities missing it ---
// Entities that currently have pciDss (from exploration): slack, jira, salesforce, github, gitlab, stripe, zoom, quickbooks, adp, google-analytics, microsoft-teams, firebase (some true, some false)
// All other entities need pciDss added
const knownPciDss = new Set(["slack", "jira", "salesforce", "github", "gitlab", "stripe", "zoom", "quickbooks", "adp", "google-analytics", "microsoft-teams", "firebase"]);

// Get all entity slugs from the file
const allSlugs = [...content.matchAll(/"([^"]+)": \{\s*\n?\s*slug: "([^"]+)"/g)].map(m => m[1]);

for (const slug of allSlugs) {
  if (knownPciDss.has(slug)) continue; // Already has pciDss
  
  const slugLine = `  "${slug}": {`;
  let slugPos = content.indexOf(slugLine);
  if (slugPos === -1) continue;
  
  const entityBlock = content.slice(slugPos, slugPos + 3000);
  
  // Check if pciDss already exists
  if (entityBlock.includes("pciDss:")) {
    console.log(`  ${slug}: already has pciDss (false positive)`);
    continue;
  }
  
  // Find security block
  const secIdx = entityBlock.indexOf("security: {");
  if (secIdx === -1) continue;
  
  const afterSec = entityBlock.slice(secIdx);
  
  // Find ccpa line (should exist)
  const ccpaMatch = afterSec.match(/ccpa: (true|false)/);
  if (!ccpaMatch) {
    console.log(`  ${slug}: no ccpa in security`);
    continue;
  }
  
  // After ccpa value, add pciDss
  const afterCcpa = afterSec.slice(ccpaMatch.index + ccpaMatch[0].length);
  const endMatch = afterCcpa.match(/^(,\s*)/);
  if (endMatch) {
    const realPos = slugPos + secIdx + ccpaMatch.index + ccpaMatch[0].length + endMatch[0].length;
    const indent = "      ";
    // Default to false for non-payment platforms
    const pciValue = (slug === "stripe" || slug === "quickbooks") ? "true" : "false";
    // Check if this is compact format (no newline in endMatch)
    if (endMatch[0].includes("\n")) {
      const insertion = `${indent}pciDss: ${pciValue},\n`;
      content = content.slice(0, realPos) + insertion + content.slice(realPos);
    } else {
      const insertion = ` pciDss: ${pciValue},`;
      content = content.slice(0, realPos) + insertion + content.slice(realPos);
    }
    fixes.pciDss++;
  }
}

// --- ccpa for linear ---
const linearSlugPos = content.indexOf('  "linear": {');
if (linearSlugPos !== -1) {
  const linearBlock = content.slice(linearSlugPos, linearSlugPos + 2500);
  if (!linearBlock.includes("ccpa:")) {
    // Find hipaa line in security
    const linearSec = linearBlock.indexOf("security: {");
    if (linearSec !== -1) {
      const afterLinSec = linearBlock.slice(linearSec);
      const hipaaMatch = afterLinSec.match(/hipaa: (true|false)/);
      if (hipaaMatch) {
        const afterHipaa = afterLinSec.slice(hipaaMatch.index + hipaaMatch[0].length);
        const endMatch = afterHipaa.match(/^(,\s*)/);
        if (endMatch) {
          const realPos = linearSlugPos + linearSec + hipaaMatch.index + hipaaMatch[0].length + endMatch[0].length;
          if (endMatch[0].includes("\n")) {
            content = content.slice(0, realPos) + "      ccpa: true,\n" + content.slice(realPos);
          } else {
            content = content.slice(0, realPos) + " ccpa: true," + content.slice(realPos);
          }
          fixes.ccpa++;
          console.log("  linear: added ccpa");
        }
      }
    }
  }
}

// --- pricing: add to 8 entities ---
const pricingData = {
  "salesforce": [
    '      { plan: "Starter", billing: "Annual", price: 25, currency: "USD", unit: "per user per month", highlighted: false }',
    '      { plan: "Professional", billing: "Annual", price: 80, currency: "USD", unit: "per user per month", highlighted: false }',
    '      { plan: "Enterprise", billing: "Annual", price: 165, currency: "USD", unit: "per user per month", highlighted: true }',
    '      { plan: "Unlimited", billing: "Annual", price: 330, currency: "USD", unit: "per user per month", highlighted: false }',
  ],
  "hubspot": [
    '      { plan: "Free", billing: "Annual", price: 0, currency: "USD", unit: "up to 1M contacts", highlighted: false }',
    '      { plan: "Starter", billing: "Annual", price: 15, currency: "USD", unit: "per month 1K contacts", highlighted: false }',
    '      { plan: "Professional", billing: "Annual", price: 800, currency: "USD", unit: "per month 2K contacts", highlighted: true }',
    '      { plan: "Enterprise", billing: "Annual", price: 3600, currency: "USD", unit: "per month 10K contacts", highlighted: false }',
  ],
  "github": [
    '      { plan: "Free", billing: "Annual", price: 0, currency: "USD", unit: "unlimited repos", highlighted: false }',
    '      { plan: "Team", billing: "Annual", price: 3.67, currency: "USD", unit: "per user per month", highlighted: true }',
    '      { plan: "Enterprise", billing: "Annual", price: 19.25, currency: "USD", unit: "per user per month", highlighted: false }',
  ],
  "gitlab": [
    '      { plan: "Free", billing: "Annual", price: 0, currency: "USD", unit: "unlimited users", highlighted: false }',
    '      { plan: "Premium", billing: "Annual", price: 19, currency: "USD", unit: "per user per month", highlighted: true }',
    '      { plan: "Ultimate", billing: "Annual", price: 99, currency: "USD", unit: "per user per month", highlighted: false }',
  ],
  "stripe": [
    '      { plan: "Pay-as-you-go", billing: "Monthly", price: 0, currency: "USD", unit: "2.9% + 30c per txn", highlighted: false }',
    '      { plan: "Custom", billing: "Custom", description: "Custom pricing for high-volume businesses", highlighted: true }',
  ],
  "docker": [
    '      { plan: "Personal", billing: "Annual", price: 0, currency: "USD", unit: "unlimited public repos", highlighted: false }',
    '      { plan: "Pro", billing: "Annual", price: 5, currency: "USD", unit: "per user per month", highlighted: true }',
    '      { plan: "Team", billing: "Annual", price: 9, currency: "USD", unit: "per user per month", highlighted: false }',
    '      { plan: "Business", billing: "Annual", price: 21, currency: "USD", unit: "per user per month", highlighted: false }',
  ],
  "supabase": [
    '      { plan: "Free", billing: "Annual", price: 0, currency: "USD", unit: "2 projects 500MB DB", highlighted: false }',
    '      { plan: "Pro", billing: "Annual", price: 25, currency: "USD", unit: "per user per month 8GB DB", highlighted: true }',
    '      { plan: "Team", billing: "Annual", price: 75, currency: "USD", unit: "per user per month 16GB DB", highlighted: false }',
    '      { plan: "Enterprise", billing: "Custom", description: "Custom pricing with dedicated support", highlighted: false }',
  ],
  "zoom": [
    '      { plan: "Free", billing: "Annual", price: 0, currency: "USD", unit: "40-min meeting limit", highlighted: false }',
    '      { plan: "Pro", billing: "Annual", price: 14.99, currency: "USD", unit: "per user per month", highlighted: true }',
    '      { plan: "Business", billing: "Annual", price: 19.99, currency: "USD", unit: "per user per month", highlighted: false }',
    '      { plan: "Enterprise", billing: "Custom", description: "Custom pricing with dedicated support", highlighted: false }',
  ],
};

for (const [slug, plans] of Object.entries(pricingData)) {
  const slugPos = content.indexOf(`  "${slug}": {`);
  if (slugPos === -1) continue;
  
  const entityBlock = content.slice(slugPos, slugPos + 3000);
  
  if (entityBlock.includes("pricing:")) {
    console.log(`  ${slug}: already has pricing`);
    continue;
  }
  
  // Find useCases - pricing goes before it
  const ucIdx = entityBlock.indexOf("useCases:");
  if (ucIdx === -1) {
    // No useCases, find integrations comma
    const integIdx = entityBlock.indexOf("integrations:");
    if (integIdx === -1) {
      console.log(`  ${slug}: no useCases or integrations found`);
      continue;
    }
    // Insert before integrations
    const integLine = entityBlock.slice(integIdx);
    const lineStart = integLine.match(/^\s*,?\s*/);
    const lineLen = lineStart ? lineStart[0].length : 0;
    const beforeInteg = entityBlock.slice(0, integIdx + lineLen);
    const indent = beforeInteg.match(/\n(\s*)integrations:/);
    const indentStr = indent ? indent[1] : "    ";
    const pricingBlock = `${indentStr}pricing: [\n${plans.join(",\n")}\n${indentStr}],\n`;
    const realPos = slugPos + integIdx;
    content = content.slice(0, realPos) + pricingBlock + content.slice(realPos);
    fixes.pricing++;
    console.log(`  ${slug}: added pricing before integrations`);
    continue;
  }
  
  // Insert before useCases
  const beforeUc = entityBlock.slice(0, ucIdx);
  const indent = beforeUc.match(/\n(\s*)useCases:/);
  const indentStr = indent ? indent[1] : "    ";
  const prevChar = entityBlock[ucIdx - 1];
  const pricingBlock = `${indentStr}pricing: [\n${plans.join(",\n")}\n${indentStr}],\n`;
  const realPos = slugPos + ucIdx;
  content = content.slice(0, realPos) + pricingBlock + content.slice(realPos);
  fixes.pricing++;
  console.log(`  ${slug}: added pricing`);
}

fs.writeFileSync("src/lib/entities/data.ts", content, "utf8");
console.log(`\nDone! Added:`);
console.log(`  funding: ${fixes.funding}`);
console.log(`  pciDss: ${fixes.pciDss}`);
console.log(`  pricing: ${fixes.pricing}`);
console.log(`  ccpa: ${fixes.ccpa}`);

// Verify
console.log("\n--- Verification ---");
const c2 = fs.readFileSync("src/lib/entities/data.ts", "utf8");
console.log("funding count:", (c2.match(/funding:/g) || []).length);
console.log("pciDss count:", (c2.match(/pciDss:/g) || []).length);
for (const slug of Object.keys(pricingData)) {
  const idx = c2.indexOf(`  "${slug}": {`);
  if (idx !== -1) {
    const block = c2.slice(idx, idx + 3000);
    console.log(`${slug} pricing: ${block.includes("pricing:") ? "YES" : "MISSING"}`);
  }
}
