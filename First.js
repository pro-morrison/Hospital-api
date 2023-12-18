const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hospital', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB schema and model (Patient)
const patientSchema = new mongoose.Schema({
  patientId: String,
  surname: String,
  othername: String,
  gender: String,
  phoneNumber: String,
  residentialAddress: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  }
});

const Patient = mongoose.model('Patient', patientSchema);

// Functionality 1: Sign in new patients
app.post('/api/patients', async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Functionality 2: Fetch patient information by ID
app.get('/api/patients/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Functionality 3: Update patient information by ID
app.put('/api/patients/:patientId', async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true }
    );
    if (!updatedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Functionality 4: Delete patient information by ID
app.delete('/api/patients/:patientId', async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({ patientId: req.params.patientId });
    if (!deletedPatient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
