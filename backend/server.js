const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, service: 'ROI Backend' }));

// Routes
app.use('/simulate', require('./routes/simulation'));
app.use('/scenarios', require('./routes/scenarios'));
app.use('/report', require('./routes/report'));

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => console.log(`🚀 API listening on http://localhost:${port}`));
  } catch (e) {
    console.error('Fatal:', e);
    process.exit(1);
  }
})();
