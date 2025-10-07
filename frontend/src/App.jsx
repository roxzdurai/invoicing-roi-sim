import { useEffect, useMemo, useState } from 'react'
import { simulate, saveScenario, listScenarios, getScenario, deleteScenario, generateReport } from './api'

const defaults = {
  scenario_name: 'Q4_Pilot',
  monthly_invoice_volume: 2000,
  num_ap_staff: 3,
  avg_hours_per_invoice: 0.17,
  hourly_wage: 30,
  error_rate_manual: 0.5, // accepts 0.5 (%) or 0.005 (fraction)
  error_cost: 100,
  time_horizon_months: 36,
  one_time_implementation_cost: 50000
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} />
    </label>
  )
}

export default function App() {
  const [form, setForm] = useState(defaults)
  const [result, setResult] = useState(null)
  const [scenarios, setScenarios] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [email, setEmail] = useState('')

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => { listScenarios().then(setScenarios) }, [])
  useEffect(() => { simulate(form).then(setResult) }, [form])

  const headline = useMemo(() => result?.results ? ({
    savings: result.results.monthly_savings?.toFixed(2),
    payback: result.results.payback_months?.toFixed(1),
    roi: result.results.roi_percentage === Infinity ? '∞' : result.results.roi_percentage?.toFixed(1)
  }) : null, [result])

  async function handleSave() {
    const doc = await saveScenario(form)
    setSelectedId(doc._id)
    listScenarios().then(setScenarios)
    alert('Scenario saved!')
  }

  async function handleLoad(id) {
    if (!id) return
    const s = await getScenario(id)
    setForm({
      scenario_name: s.scenario_name,
      monthly_invoice_volume: s.monthly_invoice_volume,
      num_ap_staff: s.num_ap_staff,
      avg_hours_per_invoice: s.avg_hours_per_invoice,
      hourly_wage: s.hourly_wage,
      error_rate_manual: s.error_rate_manual, // (fraction in DB)
      error_cost: s.error_cost,
      time_horizon_months: s.time_horizon_months,
      one_time_implementation_cost: s.one_time_implementation_cost
    })
  }

  async function handleDelete() {
    if (!selectedId) return alert('Select a scenario')
    await deleteScenario(selectedId)
    setSelectedId('')
    listScenarios().then(setScenarios)
    alert('Deleted!')
  }

  async function handleDownload() {
    if (!selectedId) return alert('Save and select a scenario first')
    if (!email) return alert('Email is required')
    const r = await generateReport({ scenario_id: selectedId, email, format: 'html' })
    const blob = new Blob([r.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `roi-report-${selectedId}.html`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <h1>Invoicing ROI Simulator</h1>

      <section className="grid3">
        <label className="field full">
          <span>Scenario Name</span>
          <input value={form.scenario_name} onChange={e => update('scenario_name', e.target.value)} />
        </label>
        <NumberInput label="Monthly Invoices" value={form.monthly_invoice_volume} onChange={v=>update('monthly_invoice_volume', v)} />
        <NumberInput label="# AP Staff" value={form.num_ap_staff} onChange={v=>update('num_ap_staff', v)} />
        <NumberInput label="Hours / Invoice" value={form.avg_hours_per_invoice} onChange={v=>update('avg_hours_per_invoice', v)} />
        <NumberInput label="Hourly Wage ($)" value={form.hourly_wage} onChange={v=>update('hourly_wage', v)} />
        <NumberInput label="Manual Error Rate (0.5 = 0.5%)" value={form.error_rate_manual} onChange={v=>update('error_rate_manual', v)} />
        <NumberInput label="Error Cost ($)" value={form.error_cost} onChange={v=>update('error_cost', v)} />
        <NumberInput label="Time Horizon (months)" value={form.time_horizon_months} onChange={v=>update('time_horizon_months', v)} />
        <NumberInput label="One-time Implementation ($)" value={form.one_time_implementation_cost} onChange={v=>update('one_time_implementation_cost', v)} />
      </section>

      <section>
        <div className="kpis">
          {headline ? (
            <>
              <div className="kpi"><b>Monthly Savings</b><div>${headline.savings}</div></div>
              <div className="kpi"><b>Payback</b><div>{headline.payback} months</div></div>
              <div className="kpi"><b>ROI ({form.time_horizon_months} mo)</b><div>{headline.roi}%</div></div>
            </>
          ) : <div>Enter inputs to see results…</div>}
        </div>
      </section>

      <section className="actions">
        <button onClick={handleSave}>Save Scenario</button>
        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); handleLoad(e.target.value); }}>
          <option value="">Load a scenario…</option>
          {scenarios.map(s => (
            <option key={s._id} value={s._id}>{s.scenario_name} — ROI {Number(s.roi_percentage).toFixed(1)}%</option>
          ))}
        </select>
        <button className="danger" onClick={handleDelete}>Delete</button>
      </section>

      <section className="report">
        <input placeholder="Enter your email to download report" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={handleDownload}>Download Report</button>
      </section>
    </div>
  )
}
