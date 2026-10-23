export function getSafeStatisticNarrative(
  sectionTitle: string,
  category: string,
  originalBody: string,
  sourceAuditComplete: boolean,
): string {
  if (sourceAuditComplete) return originalBody.trim()

  const subject = category.trim() || "software"
  if (/market size/i.test(sectionTitle)) {
    return [
      `No market-size figure is published here as verified for ${subject} software. Estimates can differ because one report may count software subscriptions while another includes advertising spend, services, implementation, or adjacent categories.`,
      "Before comparing a number, record the geography, currency, and publication date, alongside the publisher, report title, forecast period, and exact market definition. Prefer the original report over a secondary article that repeats a number without its methodology.",
      "For a buying decision, treat market size as context rather than proof that a product will fit. Translate the category into the actual capabilities, buyer segment, and use case your team needs."
    ].join("\n")
  }
  if (/adoption|usage/i.test(sectionTitle)) {
    return [
      `There is no verified adoption percentage published here for ${subject} software. Adoption can mean a live production deployment, a limited pilot, a paid subscription, active monthly use, or simply an intention to buy; those measures are not interchangeable.`,
      "Check who was surveyed, how many responses were included, which countries and organization sizes were represented, when the survey ran, and whether respondents were users, decision-makers, or vendors. Look for the exact question wording and disclose the sample limitations.",
      "To assess adoption inside your own organization, define an active user and a target workflow first. Track eligible users, activation, repeat usage, completion rate, and the time saved against a documented baseline instead of borrowing an unverified industry percentage."
    ].join("\n")
  }
  if (/roi|business impact/i.test(sectionTitle)) {
    return [
      `No ROI percentage is presented as verified for ${subject} software. Results depend on the baseline, adoption, implementation time, integration and training costs, the measurement window, and which benefits are attributed to the tool.`,
      "A defensible calculation states the period and formula. Include subscription and usage fees, implementation, migration, administration, training, and ongoing maintenance; compare these with measurable gains such as hours saved, fewer errors, faster cycle time, or incremental revenue.",
      "Run a small pilot with agreed success criteria and a control or pre-implementation baseline where practical. Report assumptions and uncertainty separately, and do not treat a vendor case study or a self-reported survey as a guaranteed result for every buyer."
    ].join("\n")
  }
  if (/trend/i.test(sectionTitle)) {
    return [
      `This guide does not claim a verified trend percentage for ${subject} software. Trend reports can combine available features, limited trials, planned adoption, and production use, even though these represent very different levels of maturity.`,
      "For each trend, check the publication date, survey population, evidence type, sample size, and whether the finding is independent research or a vendor's own customer data. Separate a technology announcement from evidence that it works reliably in a real workflow.",
      "For roadmap decisions, choose one representative use case, define security and quality requirements, and test it against the current process. Compare total operating effort and failure modes—not novelty alone—before expanding deployment."
    ].join("\n")
  }
  if (/budget|spend|cost/i.test(sectionTitle)) {
    return [
      `No typical budget is presented as verified for ${subject} software. Actual cost depends on seats, usage limits, contract term, deployment model, integrations, support tier, region, and the amount of implementation or migration work required.`,
      "Build a total-cost estimate that separates recurring license or usage fees from setup, data migration, integration, training, administration, support, and renewal increases. Check billing units and overage rules against your expected workload, not only the advertised starting price.",
      "Compare vendors using the same team size, use case, contract period, and required capabilities. Record the quote date and assumptions, then run a sensitivity check for growth in seats or usage before committing."
    ].join("\n")
  }
  return [
    `This ${subject} software guide does not publish a numerical claim without a checkable source. Use the original publisher's evidence and verify the metric definition before treating a statement as a benchmark.`,
    "A useful source record identifies the publisher, report or dataset, publication date, geography, sample or population, measurement period, and a direct URL. If any of these are missing, explain the limitation rather than presenting false precision.",
    "Use the framework here to structure your own evaluation, and confirm time-sensitive product or market details with primary documentation before making a purchasing or strategy decision."
  ].join("\n")
}
