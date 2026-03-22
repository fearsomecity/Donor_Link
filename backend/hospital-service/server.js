const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

// ── Middleware ───────────────────────────────────────────────────────────
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hospital-service' });
});

// Hospital routes
app.use('/api/hospitals', require('./routes/hospital'));
app.use('/api/hospitals/appointments', require('./routes/appointments'));

// ── MongoDB connection ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Hospital Service connected to MongoDB'))
  .catch((err) => console.warn('⚠️  MongoDB not available:', err.message));

// ── Start ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🩺 Hospital Service running on port ${PORT}`);
});
