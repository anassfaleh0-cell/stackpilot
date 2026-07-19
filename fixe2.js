const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');

// Replace E array removal comment with actual E2 array in genBest/genIndustry/genUseCase
const E2 = 'const E2=["Enterprise deployments consistently demonstrate that organizations achieve significant improvements in operational efficiency and team productivity when leveraging modern software solutions tailored to their specific requirements.","The competitive landscape continues to evolve rapidly, with vendors investing heavily in AI capabilities, security certifications, and integration ecosystems to differentiate their offerings and capture market share across diverse industry verticals.","Decision-makers evaluating enterprise software must balance feature depth against total cost of ownership, considering implementation complexity, training requirements, and long-term scalability alongside immediate functional requirements and budget constraints.","Industry analysis reveals that organizations prioritizing structured evaluation processes and proof-of-concept validation achieve substantially higher satisfaction rates and lower churn compared to those making selection decisions based primarily on feature checklists or pricing considerations."]';

// Insert E2 after genBest const declarations
d = d.replace(
  /(function genBest\(t\) \{[\s\S]*?const lk=\(i\)=>l\.slice[\s\S]*?;)(\s+const sections=)/,
  '$1\n  ' + E2 + '\n$2'
);

d = d.replace(
  /(function genIndustry\(i\) \{[\s\S]*?const lk=\(p\)=>l\.slice[\s\S]*?;)(\s+const sections=)/,
  '$1\n  ' + E2 + '\n$2'
);

d = d.replace(
  /(function genUseCase\(u\) \{[\s\S]*?const lk=\(p\)=>l\.slice[\s\S]*?;)(\s+const sections=)/,
  '$1\n  ' + E2 + '\n$2'
);

// Now replace ,E) with ,E2) in exp() calls within those functions
// We need to be more targeted - replace ,E) with ,E2) but ONLY in genBest/genIndustry/genUseCase
// Since genRS no longer uses E, we can safely replace all instances of ,E) that are in exp() calls
d = d.replace(/\),E\)/g, ',E2)');

// But genRS exp() calls don't have E anymore (they were already removed)
// So we're good

fs.writeFileSync('_gen-enterprise.js', d);
console.log('E2 added to genBest/genIndustry/genUseCase');
