const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Scenario = require('../models/Scenario');

router.post('/generate', async (req, res) => {
  const { scenario_id, email, format } = req.body || {};
  if (!scenario_id || !email) return res.status(400).json({ error: 'scenario_id and email are required' });

  const scenario = await Scenario.findById(String(scenario_id));
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  await Lead.create({ scenario_id: scenario._id, email: String(email) });

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>ROI Report</title>
    <style>
      body{font-family:Arial;margin:24px;}
      h1{margin-bottom:4px}
      table{border-collapse:collapse}
      td,th{border:1px solid #ddd;padding:8px}
      .kpi{font-size:24px;margin:8px 0}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    </style></head>
    <body>
      <h1>Invoicing ROI Report</h1>
      <p><b>Scenario:</b> ${scenario.scenario_name} &nbsp;|&nbsp; <b>Email:</b> ${email}</p>
      <div class="grid">
        <div class="kpi"><b>Monthly Savings</b><div>$${scenario.monthly_savings.toFixed(2)}</div></div>
        <div class="kpi"><b>Payback</b><div>${scenario.payback_months.toFixed(1)} months</div></div>
        <div class="kpi"><b>ROI (${scenario.time_horizon_months} mo)</b><div>${scenario.roi_percentage.toFixed(1)}%</div></div>
      </div>
      <h3>Inputs</h3>
      <table><tbody>
        <tr><th>Monthly Volume</th><td>${scenario.monthly_invoice_volume}</td></tr>
        <tr><th># AP Staff</th><td>${scenario.num_ap_staff}</td></tr>
        <tr><th>Hours/Invoice</th><td>${scenario.avg_hours_per_invoice}</td></tr>
        <tr><th>Hourly Wage</th><td>$${scenario.hourly_wage}</td></tr>
        <tr><th>Manual Error Rate</th><td>${(scenario.error_rate_manual*100).toFixed(2)}%</td></tr>
        <tr><th>Error Cost</th><td>$${scenario.error_cost}</td></tr>
        <tr><th>Horizon (mo)</th><td>${scenario.time_horizon_months}</td></tr>
        <tr><th>One-time Cost</th><td>$${scenario.one_time_implementation_cost}</td></tr>
      </tbody></table>
    </body></html>`;

  if (format === 'pdf') {
    return res.json({ html, note: 'PDF disabled in prototype; returning HTML' });
  }
  return res.json({ html });
});

module.exports = router;
