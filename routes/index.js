const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Home page
router.get('/', async (req, res) => {
    try {
        // Get counts
        const doctorCount = await Doctor.countDocuments();
        const patientCount = await Patient.countDocuments();
        const appointmentCount = await Appointment.countDocuments();
        const prescriptionCount = await Prescription.countDocuments();

        // Get recent appointments with populated references
        const recentAppointments = await Appointment.find()
            .populate('patient')
            .populate('doctor')
            .sort({ date: 1 })
            .limit(5);
            
        // Filter out appointments with null references or add default values
        const safeAppointments = recentAppointments.map(appointment => {
            const appointmentObj = appointment.toObject();
            if (!appointmentObj.patient) {
                appointmentObj.patient = { name: 'Unknown Patient' };
            }
            if (!appointmentObj.doctor) {
                appointmentObj.doctor = { name: 'Unknown Doctor', specialization: 'Unknown Specialization' };
            }
            return appointmentObj;
        });
        
        // Render the page with safe appointments
        res.render('index', {
            title: 'Hospital Management System',
            doctorCount,
            patientCount,
            appointmentCount,
            prescriptionCount,
            recentAppointments: safeAppointments // Use safeAppointments instead of recentAppointments
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Server error');
        res.redirect('/');
    }
});

module.exports = router;