const fs = require("fs");
const c = fs.readFileSync("src/lib/entities/data.ts", "utf8");

// Find all entity slugs
const slugRegex = /"([a-z][a-z0-9-]+)":\s*\{/g;
const slugs = [];
let m;
while ((m = slugRegex.exec(c)) !== null) {
  slugs.push(m[1]);
}
const uniqueSlugs = [...new Set(slugs)];

console.log("Total entities:", uniqueSlugs.length);
let missingPci = 0;
let missingFunding = 0;

uniqueSlugs.forEach(s => {
  const idx = c.indexOf('  "' + s + '": {');
  if (idx !== -1) {
    const block = c.slice(idx, idx + 3000);
    if (!block.includes("pciDss:")) {
      missingPci++;
      console.log(s + ": MISSING pciDss");
    }
    if (!block.includes("funding:")) {
      missingFunding++;
      console.log(s + ": MISSING funding");
    }
  }
});

console.log("Missing pciDss:", missingPci);
console.log("Missing funding:", missingFunding);
console.log("Has pciDss:", uniqueSlugs.length - missingPci);
