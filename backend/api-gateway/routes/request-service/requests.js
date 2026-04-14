const express = require('express');
const router = express.Router();
const UrgentRequest = require('../../models/request-service/UrgentRequest');
const User = require('../../models/request-service/User'); // Added for hospital fulfill checks
const authMiddleware = require('../../middleware/authMiddleware');

// Create Urgent Request (Hospital only)
// POST /api/requests
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'hospital') {
      return res.status(403).json({ message: 'Access denied. Only hospitals can post requests.' });
    }

    const { bloodType, unitsNeeded, urgencyLevel, zipCode, message, hospitalName } = req.body;
    
    if (!bloodType || !unitsNeeded || !zipCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new UrgentRequest({
      hospitalId: req.user.id,
      hospitalName: hospitalName || 'Hospital',
      bloodType,
      unitsNeeded,
      urgencyLevel,
      zipCode,
      message
    });

    await newRequest.save();

    // Smart Matching: Notify matched donors in the background
    try {
      const User = require('../../models/request-service/User');
      const matchedDonors = await User.find({
        role: 'donor',
        'donorProfile.bloodType': bloodType,
        'donorProfile.zipCode': zipCode
      });

      if (matchedDonors.length > 0) {
        const notification = {
          type: 'urgent_match',
          title: 'Urgent Match Near You!',
          message: `${hospitalName || 'A hospital'} urgently needs ${bloodType} blood. You are a perfect match!`,
          link: `/donor/book-appointment`,
          createdAt: new Date()
        };

        await User.updateMany(
          { _id: { $in: matchedDonors.map(d => d._id) } },
          { $push: { 'donorProfile.notifications': { $each: [notification], $position: 0 } } }
        );
        console.log(`📢 Notified ${matchedDonors.length} matching donors.`);
      }
    } catch (notifyErr) {
      console.error('❌ Notification Error:', notifyErr.message);
    }

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Nearby Requests (Donor or anyone)
// GET /api/requests/nearby?zipCode=90210
router.get('/nearby', async (req, res) => {
  try {
    const { zipCode } = req.query;
    if (!zipCode) return res.status(400).json({ message: 'Zip code required' });

    // Simple matching by zip code for now
    const requests = await UrgentRequest.find({ 
      zipCode, 
      status: 'active' 
    }).sort({ urgencyLevel: -1, createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Hospital's Active Requests (Hospital only)
// GET /api/requests/hospital
router.get('/hospital', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Access denied' });
    const requests = await UrgentRequest.find({ hospitalId: req.user.id, status: 'active' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Active Requests (For hospitals to fulfill)
// GET /api/requests/all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const requests = await UrgentRequest.find({ status: 'active' }).sort({ urgencyLevel: -1, createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fulfill Request by Hospital (Donate)
// POST /api/requests/:id/fulfill
router.post('/:id/fulfill', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'hospital') return res.status(403).json({ message: 'Only hospitals can fulfill inter-hospital requests' });

    const { transferUnits, type } = req.body;
    if (!transferUnits || !type) return res.status(400).json({ message: 'Missing transfer units or blood type' });

    const request = await UrgentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'active') return res.status(400).json({ message: 'Request is no longer active' });

    // Check inventory of the fulfilling hospital
    const hospital = await User.findById(req.user.id);
    if (!hospital || !hospital.hospitalProfile || !hospital.hospitalProfile.inventory) {
       return res.status(400).json({ message: 'Hospital profile not found or inventory empty' });
    }

    const currentStock = hospital.hospitalProfile.inventory[type] || 0;
    if (currentStock < transferUnits) {
       return res.status(400).json({ message: `Insufficient inventory. You only have ${currentStock} units of ${type}.` });
    }

    // Deduct inventory
    hospital.hospitalProfile.inventory[type] -= transferUnits;
    hospital.markModified('hospitalProfile.inventory'); // Ensure save sees deep changes
    await hospital.save();

    // Partial or full completion
    if (request.unitsNeeded <= transferUnits) {
       request.status = 'fulfilled';
       request.unitsNeeded = 0;
    } else {
       request.unitsNeeded -= transferUnits;
    }
    await request.save();

    res.json({ message: 'Successfully transferred units', remainingUnitsNeeded: request.unitsNeeded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fulfill/Cancel Request (Delete/Close)
// DELETE /api/requests/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await UrgentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.hospitalId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You do not own this request.' });
    }

    request.status = 'fulfilled'; // or 'cancelled' depending on logic
    await request.save();
    res.json({ message: 'Request marked as fulfilled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
