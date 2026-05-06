require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 image uploads

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route test
app.get('/api', (req, res) => {
  res.send('Medicert API is running');
});

// We will add Routes here later:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
