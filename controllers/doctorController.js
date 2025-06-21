const Doctor = require('../models/Doctor');

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.render('doctors/index', { 
      doctors,
      title: 'All Doctors'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Show doctor form
exports.showAddForm = (req, res) => {
  res.render('doctors/add', { 
    title: 'Add Doctor'
  });
};

// Add doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone, availability } = req.body;
    
    // Process availability data
    const availabilityArray = [];
    if (Array.isArray(req.body.day)) {
      for (let i = 0; i < req.body.day.length; i++) {
        availabilityArray.push({
          day: req.body.day[i],
          startTime: req.body.startTime[i],
          endTime: req.body.endTime[i]
        });
      }
    } else if (req.body.day) {
      availabilityArray.push({
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime
      });
    }
    
    const newDoctor = new Doctor({
      name,
      specialization,
      contactDetails: {
        email,
        phone
      },
      availability: availabilityArray
    });
    
    await newDoctor.save();
    res.redirect('/doctors');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error adding doctor',
      error
    });
  }
};

// Show doctor details
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).render('error', { 
        message: 'Doctor not found'
      });
    }
    
    res.render('doctors/details', { 
      doctor,
      title: doctor.name
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
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).render('error', { 
        message: 'Doctor not found'
      });
    }
    
    res.render('doctors/edit', { 
      doctor,
      title: `Edit ${doctor.name}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error
    });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone } = req.body;
    
    // Process availability data
    const availabilityArray = [];
    if (Array.isArray(req.body.day)) {
      for (let i = 0; i < req.body.day.length; i++) {
        availabilityArray.push({
          day: req.body.day[i],
          startTime: req.body.startTime[i],
          endTime: req.body.endTime[i]
        });
      }
    } else if (req.body.day) {
      availabilityArray.push({
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime
      });
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialization,
        contactDetails: {
          email,
          phone
        },
        availability: availabilityArray
      },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).render('error', { 
        message: 'Doctor not found'
      });
    }
    
    res.redirect(`/doctors/${doctor._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error updating doctor',
      error
    });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).render('error', { 
        message: 'Doctor not found'
      });
    }
    
    res.redirect('/doctors');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error deleting doctor',
      error
    });
  }
};

// Search doctors
exports.searchDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    
    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } }
      ]
    }).sort({ name: 1 });
    
    res.render('doctors/index', { 
      doctors,
      title: 'Search Results',
      query
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      message: 'Error searching doctors',
      error
    });
  }
};