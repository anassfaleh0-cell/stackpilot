const fs = require("fs");
let issues = 0;
["src/app/reviews/[slug]/page.tsx","src/app/comparisons/[slug]/page.tsx","src/app/guides/[slug]/page.tsx","src/app/page.tsx"].forEach(fp => {
  const c = fs.readFileSync(fp, "utf8");
  const svgs = c.match(/<svg[^>]*>/g) || [];
  svgs.forEach(m => {
    if (m.includes("aria-hidden") && m.includes('role="img"')) {
      console.log("ISSUE in", fp, ":", m.substring(0,80));
      issues++;
    }
  });
});
if (issues === 0) console.log("No SVGs with both aria-hidden and role=img. Clean!");
