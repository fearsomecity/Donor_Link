const fs = require('fs');
const path = require('path');

const requirements = [
  'express',
  'cors',
  'mongoose',
  '@google/generative-ai',
  'dotenv',
  './auth-service/routes/auth',
  './auth-service/routes/notifications',
  './donor-service/routes/donor',
  './donor-service/routes/appointments',
  './hospital-service/routes/hospital',
  './hospital-service/routes/appointments',
  './request-service/routes/requests',
  './request-service/routes/matching'
];

console.log('--- Starting Requirement Test ---');
requirements.forEach(req => {
  try {
    require(req);
    console.log(`✅ SUCCESS: ${req}`);
  } catch (err) {
    console.log(`❌ FAILED: ${req}`);
    console.log(`   Error: ${err.message}`);
    if (err.code === 'MODULE_NOT_FOUND') {
        const fullPath = req.startsWith('.') ? path.resolve(__dirname, req) : req;
        console.log(`   Attempted Path: ${fullPath}`);
    }
  }
});
console.log('--- Test Complete ---');
