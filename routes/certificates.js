const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// Create a new certificate
router.post('/create', async (req, res) => {
  try {
    const certData = req.body;
    const newCert = new Certificate(certData);
    await newCert.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate: newCert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify a certificate by certificate number or ID
router.get('/verify/:certNo', async (req, res) => {
  try {
    const certNo = req.params.certNo;
    const certificate = await Certificate.findOne({ certificate_no: certNo });
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    
    res.status(200).json({ message: 'Certificate verified', certificate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all certificates issued by a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const certificates = await Certificate.find({ doctor_id: doctorId });
    res.status(200).json({ certificates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
