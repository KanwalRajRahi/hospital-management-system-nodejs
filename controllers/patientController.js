const Patient = require('../models/Patient');

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ name: 1 });
    res.render('patients/index', { 
      patients,
      title: 'All Patients'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Show patient form
exports.showAddForm = (req, res) => {
  res.render('patients/add', { 
    title: 'Add Patient'
  });
};

// Add patient
exports.addPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory } = req.body;
    
    const newPatient = new Patient({
      name,
      age,
      gender,
      contactDetails: {
        email,
        phone,
        address
      },
      medicalHistory
    });
    
    await newPatient.save();
    res.redirect('/patients');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error adding patient',
      error
    });
  }
};

// Show patient details
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).render('error', { 
        message: 'Patient not found'
      });
    }
    
    res.render('patients/details', { 
      patient,
      title: patient.name
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
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).render('error', { 
        message: 'Patient not found'
      });
    }
    
    res.render('patients/edit', { 
      patient,
      title: `Edit ${patient.name}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, medicalHistory } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        gender,
        contactDetails: {
          email,
          phone,
          address
        },
        medicalHistory
      },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).render('error', { 
        message: 'Patient not found'
      });
    }
    
    res.redirect(`/patients/${patient._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error updating patient',
      error
    });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).render('error', { 
        message: 'Patient not found'
      });
    }
    
    res.redirect('/patients');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error deleting patient',
      error
    });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'contactDetails.phone': { $regex: query, $options: 'i' } }
      ]
    }).sort({ name: 1 });
    
    res.render('patients/index', { 
      patients,
      title: 'Search Results',
      query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error searching patients',
      error
    });
  }
};