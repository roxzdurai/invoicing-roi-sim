const express = require('express');
const router = express.Router();
const Scenario = require('../models/Scenario');
const { computeROI } = require('../utils/calculations');

// Create (compute + save)
router.post('/', async (req, res) => {
  try {
    const { inputs, results } = computeROI(req.body || {});
    const doc = await Scenario.create({
      ...inputs,
      ...results,
      error_rate_manual: inputs.error_rate_manual // ensure stored as fraction
    });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List
router.get('/', async (_req, res) => {
  const rows = await Scenario.find({}, {
    scenario_name: 1,
    created_at: 1,
    monthly_savings: 1,
    roi_percentage: 1,
    payback_months: 1
  }).sort({ created_at: -1 });
  res.json(rows);
});

// Get by id
router.get('/:id', async (req, res) => {
  const doc = await Scenario.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Delete by id
router.delete('/:id', async (req, res) => {
  const out = await Scenario.findByIdAndDelete(req.params.id);
  if (!out) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
