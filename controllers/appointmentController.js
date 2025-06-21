const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialization')
      .populate('patient', 'name')
      .sort({ date: 1 });
    
    res.render('appointments/index', { 
      appointments,
      title: 'All Appointments'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Show appointment form
exports.showAddForm = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    const patients = await Patient.find().sort({ name: 1 });
    
    res.render('appointments/add', { 
      doctors,
      patients,
      title: 'Book Appointment'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Add appointment
exports.addAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, time, notes } = req.body;
    
    const newAppointment = new Appointment({
      doctor,
      patient,
      date,
      time,
      notes
    });
    
    await newAppointment.save();
    res.redirect('/appointments');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error booking appointment',
      error
    });
  }
};

// Show appointment details
exports.getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient');
    
    if (!appointment) {
      return res.status(404).render('error', { 
        message: 'Appointment not found'
      });
    }
    
    res.render('appointments/details', { 
      appointment,
      title: 'Appointment Details'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    const doctors = await Doctor.find().sort({ name: 1 });
    const patients = await Patient.find().sort({ name: 1 });
    
    if (!appointment) {
      return res.status(404).render('error', { 
        message: 'Appointment not found'
      });
    }
    
    res.render('appointments/edit', { 
      appointment,
      doctors,
      patients,
      title: 'Edit Appointment'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, time, status, notes } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        doctor,
        patient,
        date,
        time,
        status,
        notes
      },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).render('error', { 
        message: 'Appointment not found'
      });
    }
    
    res.redirect(`/appointments/${appointment._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error updating appointment',
      error
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).render('error', { 
        message: 'Appointment not found'
      });
    }
    
    res.redirect('/appointments');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error deleting appointment',
      error
    });
  }
};