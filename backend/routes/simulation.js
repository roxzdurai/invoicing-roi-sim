const express = require('express');
const router = express.Router();
const { computeROI } = require('../utils/calculations');

router.post('/', (req, res) => {
  try {
    const { inputs, results } = computeROI(req.body || {});
    res.json({ inputs, results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
