export function getSafeStatisticNarrative(
  sectionTitle: string,
  category: string,
  originalBody: string,
  sourceAuditComplete: boolean,
): string {
  if (sourceAuditComplete) return originalBody.trim()

  const subject = category.trim() || "software"
  if (/market size/i.test(sectionTitle)) {
    return `For ${subject} software, market-size estimates are useful only when the source defines what is counted. Check whether the figure covers software licenses, services, consulting, or adjacent markets, and confirm geography, currency, and publication date before comparing estimates.`
  }
  if (/adoption|usage/i.test(sectionTitle)) {
    return `For ${subject} software, distinguish current deployment from pilot use, purchase intent, and planned investment. Check the respondent group, organization size, geography, and question wording before treating an adoption estimate as representative.`
  }
  if (/roi|business impact/i.test(sectionTitle)) {
    return `ROI claims for ${subject} software depend on baseline costs, implementation effort, the time horizon, and which benefits are counted. Compare the calculation method and denominator, and test the assumptions against your own workflow before using a benchmark in a business case.`
  }
  if (/trend/i.test(sectionTitle)) {
    return `Trend claims about ${subject} software should define the technology being measured and distinguish production use from trials or planned adoption. Check the survey population, publication date, and evidence behind the claim before using it to shape a roadmap.`
  }
  if (/budget|spend|cost/i.test(sectionTitle)) {
    return `Budget estimates for ${subject} software vary with organization size, geography, deployment scope, integrations, and services. Check whether the figure covers recurring subscription fees, implementation, training, and ongoing administration before using it to set a budget.`
  }
  return `For ${subject} software, interpret this topic using the original source, metric definition, sample, and publication date. If the evidence does not document these details, treat the claim as directional rather than a verified benchmark.`
}
