const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

// ── Middleware ───────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'request-service' });
});

// Request routes
app.use('/api/requests', require('./routes/requests'));
app.use('/api/requests/matches', require('./routes/matching'));

// ── MongoDB connection ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Request Service connected to MongoDB'))
  .catch((err) => console.warn('⚠️  MongoDB not available:', err.message));

// ── Start ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📡 Request Service running on port ${PORT}`);
});
