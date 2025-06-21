const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient')
            .populate('doctor')
            .sort({ date: 1, time: 1 });
        
        // Map appointments to handle null references
        const safeAppointments = appointments.map(appt => {
            const appointment = appt.toObject ? appt.toObject() : appt;
            
            // Handle null patient or doctor references
            if (!appointment.patient) {
                appointment.patient = { name: 'Unknown Patient', _id: 'unknown' };
            }
            if (!appointment.doctor) {
                appointment.doctor = { name: 'Unknown Doctor', _id: 'unknown', specialization: 'Unknown' };
            }
            
            return appointment;
        });
        
        res.render('appointments/index', { 
            title: 'All Appointments',
            appointments: safeAppointments
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching appointments');
        res.redirect('/');
    }
});

// Show add appointment form
router.get('/add', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ name: 1 });
        const patients = await Patient.find().sort({ name: 1 });
        
        res.render('appointments/add', { 
            title: 'Book Appointment',
            doctors,
            patients,
            patientId: req.query.patientId || null
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to load appointment form');
        res.redirect('/appointments');
    }
});

// Add new appointment
router.post('/', async (req, res) => {
    try {
        const { patient, doctor, date, time, notes } = req.body;
        
        const newAppointment = new Appointment({
            patient,
            doctor,
            date,
            time,
            notes
        });
        
        await newAppointment.save();
        req.flash('success_msg', 'Appointment booked successfully');
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to book appointment');
        res.redirect('/appointments/add');
    }
});

// Show appointment details
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient')
            .populate('doctor');
            
        if (!appointment) {
            req.flash('error_msg', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        // Convert to plain object and handle null references
        const safeAppointment = appointment.toObject();
        if (!safeAppointment.patient) {
            safeAppointment.patient = null; // We'll handle this in the template
        }
        if (!safeAppointment.doctor) {
            safeAppointment.doctor = null; // We'll handle this in the template
        }
        
        res.render('appointments/details', { 
            title: 'Appointment Details',
            appointment: safeAppointment
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch appointment details');
        res.redirect('/appointments');
    }
});

// Show edit appointment form
router.get('/:id/edit', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            req.flash('error_msg', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        const doctors = await Doctor.find().sort({ name: 1 });
        const patients = await Patient.find().sort({ name: 1 });
        
        res.render('appointments/edit', { 
            title: 'Edit Appointment',
            appointment,
            doctors,
            patients
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch appointment details');
        res.redirect('/appointments');
    }
});

// Update appointment
router.put('/:id', async (req, res) => {
    try {
        const { patient, doctor, date, time, status, notes } = req.body;
        
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                patient,
                doctor,
                date,
                time,
                status,
                notes
            },
            { new: true }
        );
        
        if (!updatedAppointment) {
            req.flash('error_msg', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        req.flash('success_msg', 'Appointment updated successfully');
        res.redirect(`/appointments/${updatedAppointment._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update appointment');
        res.redirect(`/appointments/${req.params.id}/edit`);
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            req.flash('error_msg', 'Appointment not found');
            return res.redirect('/appointments');
        }
        
        req.flash('success_msg', 'Appointment deleted successfully');
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete appointment');
        res.redirect('/appointments');
    }
});

// New appointment for specific patient
router.get('/new', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        if (!patientId) {
            req.flash('error_msg', 'Patient ID is required');
            return res.redirect('/patients');
        }
        
        const patient = await Patient.findById(patientId);
        if (!patient) {
            req.flash('error_msg', 'Patient not found');
            return res.redirect('/patients');
        }
        
        const doctors = await Doctor.find().sort({ name: 1 });
        
        res.render('appointments/add', { 
            title: `Book Appointment for ${patient.name || patient['Full Name']}`,
            doctors,
            patients: [patient],
            patientId
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to load appointment form');
        res.redirect('/patients');
    }
});
module.exports = router;