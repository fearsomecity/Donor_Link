const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/donors', require('./routes/donor'));
app.use('/api/donors/appointments', require('./routes/appointments'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'donor-service' });
});
app.get('/', (req, res) => {
  res.send('🩺 Donor Service is running...');
});

// ── MongoDB connection ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Donor Service connected to MongoDB'))
  .catch((err) => console.warn('⚠️  MongoDB not available:', err.message));

// ── Start server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🩺 Donor Service running on port ${PORT}`);
});
