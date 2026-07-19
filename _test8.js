const n = "Test", c = "Cat";
const t = { rating:4.2, targetUsers: ["Devs","Ops"], compliance:["GDPR"], aiFeats:[], securityCerts:[], apis:true, mobile:[], learning:"Low", migration:"Low", support:"4.0", releaseFreq:"Monthly", tagline:"test", pricing:"Free", priceRange:"$0", pricingModel:"Free", reviewCount:10, industries:["Tech"], customers:"100", employees:"10", founded:"2020", HQ:"NYC", features:[] };

const result = [
  `${n} for ${t.targetUsers.join(", ")}, ${t.rating>=4.2?"comprehensive ${c.toLowerCase()} cap":"focused ${c.toLowerCase()} func"}.`,
  t.compliance.length>0?`Orgs ${t.compliance.join(", ")} find ${n} regulatory.`:"Seeking ${c.toLowerCase()} with ${n}.",
  `Platform ${t.rating>=4.3?"excels":"suited"}.`
];
console.log(result);
