const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// ── AI Assistant (Gemini) ─────────────────────────────────────────────────
// IMPORTANT: This route MUST be registered before any proxy middleware
app.post('/api/ai/chat', express.json(), async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const key = process.env.GEMINI_API_KEY;
    console.log(`🤖 Using Gemini Key: ${key ? key.substring(0,6) + '...' + key.substring(key.length-4) : 'MISSING'}`);
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are the Expert AI Assistant for DonorNet, a blood donation platform.
A user is asking: "${message}"

Provide a helpful, concise, and scientifically accurate answer about blood donation, hospital features, or medical concerns. Keep your answer encouraging and under 100 words.`;

    console.log(`💬 Processing AI Request: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text().trim();
    console.log(`✨ AI Response generated successfully (${reply.split(' ').length} words)`);
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ error: 'Failed to generate AI response', details: error.message });
  }
});

// ── Proxy rules ─────────────────────────────────────────────────────────
const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error(`❌ Proxy Error [${req.method} ${req.url}] -> ${err.message}`);
    res.status(502).json({ 
      error: 'Service unavailable', 
      message: 'The requested microservice is currently offline or unreachable.',
      service: req.url.split('/')[2] 
    });
  },
});

// Auth Service  →  port 5001
app.use('/api/auth', createProxyMiddleware({
  ...proxyOptions('http://127.0.0.1:5001')
}));

// Donor Service →  port 5002
app.use('/api/donors', createProxyMiddleware({
  ...proxyOptions('http://127.0.0.1:5002'),
  pathRewrite: (path, req) => req.originalUrl
}));

// Hospital Service → port 5003
app.use('/api/hospitals', createProxyMiddleware({
  ...proxyOptions('http://127.0.0.1:5003'),
  pathRewrite: (path, req) => req.originalUrl
}));

// Request Service  → port 5004
app.use('/api/requests', createProxyMiddleware({
  ...proxyOptions('http://127.0.0.1:5004'),
  pathRewrite: (path, req) => req.originalUrl
}));

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`🤖 AI Assistant route active: POST /api/ai/chat`);
  console.log(`🔑 Gemini key loaded: ${process.env.GEMINI_API_KEY ? 'YES ✅' : 'NO ❌'}`);
});
