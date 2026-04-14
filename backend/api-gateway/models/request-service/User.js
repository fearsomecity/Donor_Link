const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['donor', 'hospital', 'admin'],
    required: true
  },
  
  // ── Donor Specific Fields ───────────────────────────────────────
  donorProfile: {
    name: { type: String, trim: true },
    bloodType: { 
      type: String, 
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
    },
    zipCode: { type: String, trim: true },
    lastDonationDate: { type: Date },
    nextEligibleDate: { type: Date },
    donations: [{
      date: { type: Date, default: Date.now },
      hospitalName: String,
      units: { type: Number, default: 1 },
      bloodType: String
    }],
    notifications: [{
      type: { type: String, enum: ['urgent_match', 'appointment_reminder', 'system'], default: 'system' },
      title: String,
      message: String,
      link: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }]
  },

  // ── Hospital Specific Fields ────────────────────────────────────
  hospitalProfile: {
    hospitalName: { type: String, trim: true },
    address: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    inventory: {
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; // In case password is not selected
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
