const mongoose = require('mongoose');

const UrgentRequestSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalName: { type: String, required: true },
  bloodType: { type: String, required: true },
  unitsNeeded: { type: Number, required: true },
  urgencyLevel: { type: String, enum: ['normal', 'high', 'critical'], default: 'normal' },
  zipCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('UrgentRequest', UrgentRequestSchema);
