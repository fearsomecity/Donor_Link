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

// ── Request Logger ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── MongoDB connection (Shared) ───────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donornet';
console.log(`📡 Attempting MongoDB connection to: ${MONGO_URI.replace(/\/\/.*@/, '//****@')}`);

mongoose.set('bufferCommands', false);
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Unified Backend: Shared MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ Unified Backend: MongoDB connection error:', err.message);
    console.warn('⚠️  Proceeding without database — some routes may fail.');
  });

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

  const prompt = `You are the Expert AI Assistant for DonorNet, a blood donation platform.
A user is asking: "${message}"

Provide a helpful, concise, and scientifically accurate answer about blood donation, hospital features, or medical concerns. Keep your answer encouraging and under 100 words.`;

  // Model preference order — update here if a model is deprecated
  const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Gemini API key not configured on server.' });
  }

  const genAI = new GoogleGenerativeAI(key);
  let lastError = null;

  for (const modelName of modelCandidates) {
    try {
      console.log(`🤖 Trying AI model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const reply = result.response.text().trim();
      console.log(`✅ AI responded using: ${modelName}`);
      return res.json({ reply });
    } catch (error) {
      console.error(`❌ Model ${modelName} failed: ${error.message}`);
      lastError = error;
      // If it's a rate-limit (429) error, don't try other models — surface it clearly
      if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({ 
          error: 'AI assistant is temporarily busy. Please try again in a few seconds.',
          details: error.message
        });
      }
    }
  }

  res.status(500).json({ 
    error: 'Failed to generate AI response. All model attempts failed.', 
    details: lastError?.message 
  });
});

// ── Unified Routes ─────────────────────────────────────────────────────────

// Each service's router is mounted under the prefix previously handled by the API Gateway.
// Note: We use the existing router files directly.

// Auth Service — specific sub-routes first
app.use('/api/auth/notifications', require('./auth-service/routes/notifications'));
app.use('/api/auth', require('./auth-service/routes/auth'));

// Donor Service — specific sub-routes first
app.use('/api/donors/appointments', require('./donor-service/routes/appointments'));
app.use('/api/donors', require('./donor-service/routes/donor'));

// Hospital Service — specific sub-routes first
app.use('/api/hospitals/appointments', require('./hospital-service/routes/appointments'));
app.use('/api/hospitals', require('./hospital-service/routes/hospital'));

// Request Service — specific sub-routes first
app.use('/api/requests/matches', require('./request-service/routes/matching'));
app.use('/api/requests', require('./request-service/routes/requests'));

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
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 UNIFIED BACKEND ENGINE STARTED`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Chat: POST /api/ai/chat`);
  console.log(`📁 Microservices Consolidated: 5 -> 1`);
  console.log('='.repeat(50) + '\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ FATAL: Port ${PORT} is already in use.`);
    console.error(`👉 Try killing the existing process or use a different PORT in .env`);
    process.exit(1);
  } else {
    console.error(`❌ Server Error:`, err.message);
  }
});
