const { Schema, model, Types } = require('mongoose');

const LeadSchema = new Schema({
  scenario_id: { type: Types.ObjectId, ref: 'Scenario', required: true },
  email: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = model('Lead', LeadSchema);
