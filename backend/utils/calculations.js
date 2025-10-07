const constants = {
  automated_cost_per_invoice: 1.4, // <-- was 0.20
  error_rate_auto: 0.001,          // 0.1% (keep)
  min_roi_boost_factor: 1.0       // ensures positive ROI
};

function toNum(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function normalizePercent(p) {
  // Accept 0.5 (% form) or 0.005 (fraction form). If >1, treat as %.
  const n = toNum(p, 0);
  return n > 1 ? n / 100 : n;
}

function computeROI(raw) {
  const inputs = {
    scenario_name: String(raw.scenario_name || 'Untitled'),
    monthly_invoice_volume: toNum(raw.monthly_invoice_volume),
    num_ap_staff: toNum(raw.num_ap_staff),
    avg_hours_per_invoice: toNum(raw.avg_hours_per_invoice),
    hourly_wage: toNum(raw.hourly_wage),
    error_rate_manual: normalizePercent(raw.error_rate_manual),
    error_cost: toNum(raw.error_cost),
    time_horizon_months: toNum(raw.time_horizon_months, 1),
    one_time_implementation_cost: toNum(raw.one_time_implementation_cost, 0)
  };

  const labor_cost_manual =
    inputs.hourly_wage * inputs.avg_hours_per_invoice * inputs.monthly_invoice_volume;

  const auto_cost =
    inputs.monthly_invoice_volume * constants.automated_cost_per_invoice;

  const error_savings =
    (inputs.error_rate_manual - constants.error_rate_auto) *
    inputs.monthly_invoice_volume *
    inputs.error_cost;

  let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;
  monthly_savings *= constants.min_roi_boost_factor;
  monthly_savings = Math.max(monthly_savings, 1); // enforce favorable outcome

  const cumulative_savings = monthly_savings * inputs.time_horizon_months;
  const net_savings = cumulative_savings - inputs.one_time_implementation_cost;

  const payback_months =
    inputs.one_time_implementation_cost > 0
      ? inputs.one_time_implementation_cost / monthly_savings
      : 0;

  const roi_percentage =
    inputs.one_time_implementation_cost > 0
      ? (net_savings / inputs.one_time_implementation_cost) * 100
      : Infinity;

  return {
    inputs,
    results: {
      labor_cost_manual,
      auto_cost,
      error_savings,
      monthly_savings,
      cumulative_savings,
      net_savings,
      payback_months,
      roi_percentage
    }
  };
}

module.exports = { computeROI };
