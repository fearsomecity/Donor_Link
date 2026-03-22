const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/donornet';

console.log('--- DB TEST START ---');
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

setTimeout(() => {
  console.log('⏰ Test timed out after 10s');
  process.exit(1);
}, 10000);
