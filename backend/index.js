const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://donor-link.onrender.com', // Adding Render URL just in case
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));
app.use(express.json());

// ── MongoDB connection (Shared) ───────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';
mongoose.set('bufferCommands', false);
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Unified Backend: Shared MongoDB connected'))
  .catch((err) => console.warn('⚠️  Unified Backend: MongoDB connection error:', err.message));

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    unified: true, 
    services: ['auth', 'donor', 'hospital', 'request', 'gateway'],
    timestamp: new Date().toISOString()
  });
});

// ── AI Assistant (Gemini) ─────────────────────────────────────────────────
// Consolidated from api-gateway
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are the Expert AI Assistant for DonorNet, a blood donation platform.
A user is asking: "${message}"

Provide a helpful, concise, and scientifically accurate answer about blood donation, hospital features, or medical concerns. Keep your answer encouraging and under 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ error: 'Failed to generate AI response', details: error.message });
  }
});

// ── Unified Routes ─────────────────────────────────────────────────────────

// Each service's router is mounted under the prefix previously handled by the API Gateway.
// Note: We use the existing router files directly.

// Auth Service
app.use('/api/auth', require('./auth-service/routes/auth'));
app.use('/api/auth/notifications', require('./auth-service/routes/notifications'));

// Donor Service
app.use('/api/donors', require('./donor-service/routes/donor'));
app.use('/api/donors/appointments', require('./donor-service/routes/appointments'));

// Hospital Service
app.use('/api/hospitals', require('./hospital-service/routes/hospital'));
app.use('/api/hospitals/appointments', require('./hospital-service/routes/appointments'));

// Request Service
app.use('/api/requests', require('./request-service/routes/requests'));
app.use('/api/requests/matches', require('./request-service/routes/matching'));

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`❌ Global Error: ${err.message}`);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    path: req.url 
  });
});

// ── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Unified Backend running on http://0.0.0.0:${PORT}`);
  console.log(`🤖 AI Chat Route: POST /api/ai/chat`);
  console.log(`📁 Routes consolidated: 5 microservices -> 1 engine`);
});
