const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificate_no: { type: String, required: true, unique: true },
  doctor_id: { type: String, required: true },
  doctor_name: { type: String, required: true },
  doctor_specialization: { type: String, required: true },
  name: { type: String, required: true }, // patient name
  age: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  disease: { type: String, required: true },
  dr_advise: { type: String, required: true },
  date: { type: String, required: true },
  patient_photo: { type: String }, // Base64 string of the patient photo
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
