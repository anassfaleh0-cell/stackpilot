const fs = require("fs");
const c = fs.readFileSync("src/lib/entities/data.ts", "utf8");

// Check all 38 expected slugs
const expected = [
  "1password","bitwarden","slack","notion","figma","linear","asana","jira",
  "salesforce","hubspot","github","gitlab","vercel","stripe","docker","supabase",
  "zoom","calendly","mailchimp","freshbooks","quickbooks","xero","gusto","bamboohr",
  "rippling","adp","canva","sketch","chatgpt","jasper","ahrefs","semrush",
  "google-analytics","mixpanel","monday-com","microsoft-teams","netlify","firebase"
];

expected.forEach(slug => {
  const idx = c.indexOf('  "' + slug + '": {');
  const found = idx !== -1;
  const block = found ? c.slice(idx, idx + 3000) : "";
  const hasPci = block.includes("pciDss:");
  const hasFunding = block.includes("funding:");
  const hasPricing = block.includes("pricing:");
  const status = (found ? "FOUND" : "MISSING") + 
    (found ? " funding=" + hasFunding + " pciDss=" + hasPci + " pricing=" + hasPricing : "");
  if (!found || !hasPci || !hasFunding || !hasPricing) {
    console.log(slug + ": " + status);
  }
});

// Check for syntax errors
try {
  new Function(c);
  console.log("Syntax check: OK");
} catch (e) {
  console.log("Syntax error:", e.message);
}
