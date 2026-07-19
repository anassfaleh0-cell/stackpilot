const n = "Test", c = "Cat";
const t = { rating:4.2, targetUsers: ["Devs","Ops"], compliance:["GDPR"], aiFeats:[], securityCerts:[], apis:true, mobile:[], learning:"Low", migration:"Low", support:"4.0", releaseFreq:"Monthly", tagline:"test", pricing:"Free", priceRange:"$0", pricingModel:"Free", reviewCount:10, industries:["Tech"], customers:"100", employees:"10", founded:"2020", HQ:"NYC", features:[] };

const result = [
  `${n} is optimally suited for ${t.targetUsers.join(", ")}, organizations that require ${t.rating>=4.2?"comprehensive ${c.toLowerCase()} capabilities and are willing to invest in a platform that scales with their growth":"focused ${c.toLowerCase()} functionality that addresses specific needs without unnecessary complexity or cost"}.`,
  t.compliance.length>0?`Organizations with compliance requirements spanning ${t.compliance.join(", ")} will find ${n}'s regulatory alignment particularly valuable for reducing audit burden and ensuring governance adherence.`:"Organizations seeking a reliable ${c.toLowerCase()} solution with standard data protection controls will find ${n} meets baseline requirements effectively.",
  `The platform ${t.rating>=4.3?"excels in enterprise environments with complex requirements":"is particularly well-suited for mid-market organizations with well-defined needs"}.`
];
console.log(result);
