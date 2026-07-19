const n = "Test";
const t = { rating:4.2, targetUsers: ["Dev", "Ops"] };
const c = "Category";
const result = `${n} is for ${t.targetUsers.join(", ")}, ${t.rating>=4.2?"comp ${c.toLowerCase()} cap":"foc ${c.toLowerCase()} func"}.`;
console.log(result);
