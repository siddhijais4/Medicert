const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

// User Registration
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    // Don't send the password back
    const userResponse = { _id: newUser._id, name: newUser.name, email: newUser.email };
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const userResponse = { _id: user._id, name: user.name, email: user.email };
    res.status(200).json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor Registration
router.post('/doctor/register', async (req, res) => {
  try {
    const { name, email, password, registrationNumber, specialization } = req.body;
    const existingDoctor = await Doctor.findOne({ $or: [{ email }, { registrationNumber }] });
    if (existingDoctor) return res.status(400).json({ error: 'Doctor already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = new Doctor({ name, email, password: hashedPassword, registrationNumber, specialization });
    await newDoctor.save();

    const doctorResponse = { _id: newDoctor._id, name: newDoctor.name, email: newDoctor.email, registrationNumber: newDoctor.registrationNumber, specialization: newDoctor.specialization };
    res.status(201).json({ message: 'Doctor created successfully', doctor: doctorResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor Login
router.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const doctorResponse = { _id: doctor._id, name: doctor.name, email: doctor.email, registrationNumber: doctor.registrationNumber, specialization: doctor.specialization };
    res.status(200).json({ message: 'Login successful', doctor: doctorResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Certificate = require('../models/Certificate');

// Save a certificate to a user's account
router.post('/user/save-certificate', async (req, res) => {
  try {
    const { email, certNo } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.savedCertificates.includes(certNo)) {
      user.savedCertificates.push(certNo);
      await user.save();
    }
    
    res.status(200).json({ message: 'Certificate saved successfully', savedCertificates: user.savedCertificates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a user's saved certificates (full details)
router.get('/user/certificates/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch full certificate details for the saved cert numbers
    const certificates = await Certificate.find({
      certificate_no: { $in: user.savedCertificates }
    });

    res.status(200).json({ certificates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
