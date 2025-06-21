const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('doctor', 'name specialization')
      .populate('patient', 'name')
      .sort({ createdAt: -1 });
    
    res.render('prescriptions/index', { 
      prescriptions,
      title: 'All Prescriptions'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Show prescription form
exports.showAddForm = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    const patients = await Patient.find().sort({ name: 1 });
    const appointments = await Appointment.find()
      .populate('doctor', 'name')
      .populate('patient', 'name')
      .sort({ date: -1 });
    
    res.render('prescriptions/add', { 
      doctors,
      patients,
      appointments,
      title: 'Create Prescription',
      appointmentId: req.query.appointmentId || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Add prescription
exports.addPrescription = async (req, res) => {
  try {
    const { doctor, patient, appointment, notes } = req.body;
    
    // Process medications data
    const medications = [];
    if (Array.isArray(req.body.medicationName)) {
      for (let i = 0; i < req.body.medicationName.length; i++) {
        medications.push({
          name: req.body.medicationName[i],
          dosage: req.body.dosage[i],
          frequency: req.body.frequency[i],
          duration: req.body.duration[i]
        });
      }
    } else if (req.body.medicationName) {
      medications.push({
        name: req.body.medicationName,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        duration: req.body.duration
      });
    }
    
    const newPrescription = new Prescription({
      doctor,
      patient,
      appointment: appointment || null,
      medications,
      notes
    });
    
    await newPrescription.save();
    
    // If this prescription is linked to an appointment, update the appointment status
    if (appointment) {
      await Appointment.findByIdAndUpdate(appointment, { status: 'Completed' });
    }
    
    res.redirect('/prescriptions');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error creating prescription',
      error
    });
  }
};

// Show prescription details
exports.getPrescriptionDetails = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor')
      .populate('patient')
      .populate('appointment');
    
    if (!prescription) {
      return res.status(404).render('error', { 
        message: 'Prescription not found'
      });
    }
    
    res.render('prescriptions/details', { 
      prescription,
      title: 'Prescription Details'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    
    if (!prescription) {
      return res.status(404).render('error', { 
        message: 'Prescription not found'
      });
    }
    
    res.redirect('/prescriptions');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error deleting prescription',
      error
    });
  }
};