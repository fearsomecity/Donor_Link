const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ───────────────────────────────────────────────────────────
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Auth routes
app.use('/', require('./routes/auth'));
app.use('/api/auth/notifications', require('./routes/notifications'));

// ── MongoDB connection ──────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';

// Disable buffering to fail fast if DB is down
mongoose.set('bufferCommands', false);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.warn('⚠️  MongoDB not available — running without DB:', err.message));

// ── Start ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
