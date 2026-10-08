"use client"

import { useMemo, useState, type ReactNode } from "react"

type ToolKind = "tco" | "comparison" | "roi" | "scorecard" | "stack" | "pricing"

const inputClass = "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"

function Field({ label, value, onChange, type = "number", min = 0, step = 1 }: { label: string; value: number; onChange: (v: number) => void; type?: string; min?: number; step?: number }) {
  return <label className="block text-sm font-medium"><span className="mb-1.5 block">{label}</span><input className={inputClass} type={type} min={min} step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} /></label>
}

function Money({ value }: { value: number }) {
  return <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}</span>
}

export function DecisionTool({ kind }: { kind: ToolKind }) {
  const [users, setUsers] = useState(10)
  const [monthly, setMonthly] = useState(50)
  const [hours, setHours] = useState(20)
  const [hourlyCost, setHourlyCost] = useState(40)
  const [implementation, setImplementation] = useState(1000)
  const [savingsHours, setSavingsHours] = useState(10)
  const [oneTimeBenefit, setOneTimeBenefit] = useState(0)
  const [score, setScore] = useState([4, 4, 4, 4, 4])
  const [stack, setStack] = useState([50, 100, 75])

  const tco = useMemo(() => {
    const subscription = users * monthly
    const setup = implementation + hours * hourlyCost
    return { year: subscription * 12 + setup, three: subscription * 36 + setup }
  }, [users, monthly, hours, hourlyCost, implementation])

  const roi = useMemo(() => {
    const annualCost = users * monthly * 12 + implementation
    const annualBenefit = savingsHours * hourlyCost * 12 + oneTimeBenefit
    const net = annualBenefit - annualCost
    return { annualCost, annualBenefit, roi: annualCost ? (net / annualCost) * 100 : 0, payback: annualBenefit ? annualCost / (annualBenefit / 12) : 0 }
  }, [users, monthly, hourlyCost, implementation, savingsHours, oneTimeBenefit])

  const weightedScore = useMemo(() => score.reduce((a, v) => a + v, 0) / score.length, [score])
  const stackTotal = stack.reduce((a, v) => a + v, 0)
  const pricingTotal = users * monthly

  if (kind === "tco") return <div className="grid lg:grid-cols-2 gap-8"><div className="space-y-4"><Field label="Users" value={users} onChange={setUsers} /><Field label="Monthly price per user ($)" value={monthly} onChange={setMonthly} /><Field label="Implementation hours" value={hours} onChange={setHours} /><Field label="Cost per implementation hour ($)" value={hourlyCost} onChange={setHourlyCost} /><Field label="Other implementation costs ($)" value={implementation} onChange={setImplementation} /></div><Result title="Estimated total cost" items={[["1-year TCO", <Money key="1" value={tco.year} />], ["3-year TCO", <Money key="3" value={tco.three} />]]} /></div>

  if (kind === "roi") return <div className="grid lg:grid-cols-2 gap-8"><div className="space-y-4"><Field label="Users" value={users} onChange={setUsers} /><Field label="Monthly software cost per user ($)" value={monthly} onChange={setMonthly} /><Field label="Hours saved per user each month" value={savingsHours} onChange={setSavingsHours} /><Field label="Value of one employee hour ($)" value={hourlyCost} onChange={setHourlyCost} /><Field label="One-time benefit ($)" value={oneTimeBenefit} onChange={setOneTimeBenefit} /><Field label="Implementation cost ($)" value={implementation} onChange={setImplementation} /></div><Result title="Estimated ROI" items={[["Annual cost", <Money key="c" value={roi.annualCost} />], ["Annual benefit", <Money key="b" value={roi.annualBenefit} />], ["ROI", <span key="r">{roi.roi.toFixed(1)}%</span>], ["Payback", <span key="p">{roi.payback.toFixed(1)} months</span>]]} /></div>

  if (kind === "pricing") return <div className="grid lg:grid-cols-2 gap-8"><div className="space-y-4"><Field label="Seats" value={users} onChange={setUsers} /><Field label="Price per seat / month ($)" value={monthly} onChange={setMonthly} /><Field label="Annual add-ons ($)" value={implementation} onChange={setImplementation} /></div><Result title="Estimated software cost" items={[["Monthly subscription", <Money key="m" value={pricingTotal} />], ["Annual subscription + add-ons", <Money key="a" value={pricingTotal * 12 + implementation} />]]} /></div>

  if (kind === "stack") return <div className="grid lg:grid-cols-2 gap-8"><div className="space-y-4">{stack.map((v, i) => <Field key={i} label={["CRM monthly cost ($)", "Project management monthly cost ($)", "Marketing/analytics monthly cost ($)"][i]} value={v} onChange={(n) => setStack(stack.map((x, j) => j === i ? n : x))} />)}</div><Result title="SaaS stack cost" items={[["Monthly total", <Money key="m" value={stackTotal} />], ["Annual total", <Money key="a" value={stackTotal * 12} />]]} /></div>

  if (kind === "scorecard") return <div className="grid lg:grid-cols-2 gap-8"><div className="space-y-4">{score.map((v, i) => <Field key={i} label={["Features", "Price", "Ease of use", "Integrations", "Support"][i]} value={v} min={1} step={1} onChange={(n) => setScore(score.map((x, j) => j === i ? Math.min(5, Math.max(1, n)) : x))} />)}</div><Result title="Software fit score" items={[["Average score", <span key="s">{weightedScore.toFixed(1)} / 5</span>], ["Percentage", <span key="p">{(weightedScore / 5 * 100).toFixed(0)}%</span>]]} /></div>

  return <div className="space-y-6"><p className="text-sm text-muted-foreground">Use the matrix below to give each option a consistent score from 1 to 5.</p><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3">Criterion</th><th className="text-center">Tool A</th><th className="text-center">Tool B</th><th className="text-center">Tool C</th></tr></thead><tbody>{["Features", "Pricing", "Ease of use", "Integrations", "Support"].map((x) => <tr key={x} className="border-b border-border"><td className="py-3 font-medium">{x}</td>{[0,1,2].map(i => <td key={i} className="text-center py-3"><input aria-label={x + " tool " + (i+1)} className="w-16 h-9 rounded border border-border bg-background text-center" type="number" min="1" max="5" defaultValue="3" /></td>)}</tr>)}</tbody></table></div></div>
}

function Result({ title, items }: { title: string; items: [string, ReactNode][] }) {
  return <div className="rounded-xl border border-border bg-surface-secondary p-6"><h2 className="text-xl font-bold mb-5">{title}</h2><div className="space-y-4">{items.map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"><span className="text-sm text-muted-foreground">{label}</span><strong className="text-lg">{value}</strong></div>)}</div></div>
}
