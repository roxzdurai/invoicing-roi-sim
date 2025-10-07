const { Schema, model } = require('mongoose');

const ScenarioSchema = new Schema({
  scenario_name: { type: String, required: true },
  monthly_invoice_volume: { type: Number, required: true },
  num_ap_staff: { type: Number, required: true },
  avg_hours_per_invoice: { type: Number, required: true },
  hourly_wage: { type: Number, required: true },
  error_rate_manual: { type: Number, required: true }, // stored as fraction, e.g., 0.005
  error_cost: { type: Number, required: true },
  time_horizon_months: { type: Number, required: true },
  one_time_implementation_cost: { type: Number, default: 0 },

  monthly_savings: { type: Number, required: true },
  cumulative_savings: { type: Number, required: true },
  net_savings: { type: Number, required: true },
  payback_months: { type: Number, required: true },
  roi_percentage: { type: Number, required: true },

  created_at: { type: Date, default: Date.now }
});

module.exports = model('Scenario', ScenarioSchema);
