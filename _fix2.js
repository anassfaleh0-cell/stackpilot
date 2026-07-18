const fs = require("fs");
const c = fs.readFileSync("src/lib/entities/data.ts", "utf8");

// Check missing entities
const missing = ["quickbooks","semrush","google-analytics","monday-com","microsoft-teams","adp"];
missing.forEach(s => {
  const idx = c.indexOf('  "' + s + '": {');
  if (idx === -1) {
    // Try with %20 variations
    console.log(s + ": NOT FOUND via slug search");
    // Search for slug line
    const slugLine = c.search(new RegExp('slug: "' + s + '"'));
    console.log("  slug found at:", slugLine);
  } else {
    console.log(s + ": found at " + idx);
    // Check if funding exists
    const block = c.slice(idx, idx + 2000);
    if (block.includes("funding:")) {
      console.log("  funding: already exists");
    } else {
      console.log("  funding: MISSING");
    }
  }
});

// Check if pricing exists for the 8 entities
console.log("\n--- Pricing check ---");
const pricingCheck = ["salesforce","hubspot","github","gitlab","stripe","docker","supabase","zoom"];
pricingCheck.forEach(s => {
  const idx = c.indexOf('  "' + s + '": {');
  if (idx === -1) { console.log(s + ": NOT FOUND"); return; }
  const block = c.slice(idx, idx + 3000);
  if (block.includes("pricing:")) {
    console.log(s + ": pricing EXISTS");
  } else {
    console.log(s + ": pricing MISSING");
  }
});

// Check if pciDss exists for specific entities
console.log("\n--- pciDss check ---");
const pciCheck = ["1password","notion","figma","linear","docker","supabase"];
pciCheck.forEach(s => {
  const idx = c.indexOf('  "' + s + '": {');
  if (idx === -1) { console.log(s + ": NOT FOUND"); return; }
  const block = c.slice(idx, idx + 3000);
  if (block.includes("pciDss:")) {
    console.log(s + ": pciDss EXISTS");
  } else {
    console.log(s + ": pciDss MISSING");
  }
});

// Check ccpa for linear
console.log("\n--- ccpa for linear ---");
const linearIdx = c.indexOf('  "linear": {');
if (linearIdx !== -1) {
  const block = c.slice(linearIdx, linearIdx + 2000);
  if (block.includes("ccpa:")) {
    console.log("linear: ccpa EXISTS");
  } else {
    console.log("linear: ccpa MISSING");
  }
}
