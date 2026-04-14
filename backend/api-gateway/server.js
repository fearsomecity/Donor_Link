const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';
mongoose.set('bufferCommands', false);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.warn('⚠️  MongoDB not available:', err.message));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'donornet-unified-backend' });
});

// ── AI Assistant (Gemini) ─────────────────────────────────────────────────────
// MUST be registered before other routes
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const key = process.env.GEMINI_API_KEY;
    console.log(`🤖 Gemini Key: ${key ? key.substring(0, 6) + '...' : 'MISSING'}`);
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are the Expert AI Assistant for DonorNet, a blood donation platform.
A user is asking: "${message}"

Provide a helpful, concise, and scientifically accurate answer about blood donation, hospital features, or medical concerns. Keep your answer encouraging and under 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();
    console.log(`✨ AI Response: ${reply.split(' ').length} words`);
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ error: 'Failed to generate AI response', details: error.message });
  }
});

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth-service/auth'));
app.use('/api/auth/notifications', require('./routes/auth-service/notifications'));

// ── Donor Routes ──────────────────────────────────────────────────────────────
app.use('/api/donors', require('./routes/donor-service/donor'));
app.use('/api/donors/appointments', require('./routes/donor-service/appointments'));

// ── Hospital Routes ───────────────────────────────────────────────────────────
app.use('/api/hospitals', require('./routes/hospital-service/hospital'));
app.use('/api/hospitals/appointments', require('./routes/hospital-service/appointments'));

// ── Request Routes ────────────────────────────────────────────────────────────
app.use('/api/requests', require('./routes/request-service/requests'));
app.use('/api/requests/matches', require('./routes/request-service/matching'));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 DonorNet Unified Backend running on port ${PORT}`);
  console.log(`🤖 AI Assistant active: POST /api/ai/chat`);
  console.log(`🔑 Gemini key: ${process.env.GEMINI_API_KEY ? 'YES ✅' : 'NO ❌'}`);
  console.log(`🗄️  MongoDB URI: ${MONGO_URI.substring(0, 30)}...`);
});
