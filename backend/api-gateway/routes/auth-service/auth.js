const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/auth-service/User');

const router = express.Router();

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'donornet_jwt_secret', {
    expiresIn: '30d',
  });
};

// ── POST /api/auth/register/donor ───────────────────────────────
router.post('/register/donor', async (req, res) => {
  try {
    const { email, password, name, bloodType, zipCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = await User.create({
      email,
      password,
      role: 'donor',
      donorProfile: { name, bloodType, zipCode }
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.donorProfile
      }
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/auth/register/hospital ────────────────────────────
router.post('/register/hospital', async (req, res) => {
  try {
    const { email, password, hospitalName, address, zipCode, contactNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = await User.create({
      email,
      password,
      role: 'hospital',
      hospitalProfile: { hospitalName, address, zipCode, contactNumber }
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.hospitalProfile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Must explicitly select password since it has select: false
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const profile = user.role === 'donor' ? user.donorProfile : user.hospitalProfile;

    res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
