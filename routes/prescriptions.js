const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all prescriptions
router.get('/', async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
            .populate('patient')
            .populate('doctor')
            .populate('appointment')
            .sort({ createdAt: -1 });
        
        res.render('prescriptions/index', { 
            title: 'All Prescriptions',
            prescriptions
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch prescriptions');
        res.redirect('/');
    }
});

// Show add prescription form
router.get('/add', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ name: 1 });
        const patients = await Patient.find().sort({ name: 1 });
        
        // Map patients to handle different field structures
        const mappedPatients = patients.map(pat => {
            const patient = pat.toObject ? pat.toObject() : pat;
            // Ensure name field exists for display in dropdown
            if (!patient.name && patient['Full Name']) {
                patient.name = patient['Full Name'];
            }
            return patient;
        });
        
        const appointments = await Appointment.find({ status: 'Scheduled' })
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
                appointment.doctor = { name: 'Unknown Doctor', _id: 'unknown' };
            }
            
            return appointment;
        });
        
        res.render('prescriptions/add', { 
            title: 'Create Prescription',
            doctors,
            patients: mappedPatients,
            appointments: safeAppointments,
            appointmentId: req.query.appointmentId || null
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to load prescription form');
        res.redirect('/prescriptions');
    }
});

// Add new prescription
router.post('/', async (req, res) => {
    try {
        const { patient, doctor, appointment, instructions } = req.body;
        
        // Process medications
        const medications = [];
        const medicationNames = Array.isArray(req.body.medicationName) ? req.body.medicationName : [req.body.medicationName];
        const dosages = Array.isArray(req.body.dosage) ? req.body.dosage : [req.body.dosage];
        const frequencies = Array.isArray(req.body.frequency) ? req.body.frequency : [req.body.frequency];
        const durations = Array.isArray(req.body.duration) ? req.body.duration : [req.body.duration];
        
        for (let i = 0; i < medicationNames.length; i++) {
            medications.push({
                name: medicationNames[i],
                dosage: dosages[i],
                frequency: frequencies[i],
                duration: durations[i]
            });
        }
        
        const newPrescription = new Prescription({
            patient,
            doctor,
            appointment: appointment || null,
            medications,
            instructions
        });
        
        await newPrescription.save();
        
        // Update appointment status if provided
        if (appointment) {
            await Appointment.findByIdAndUpdate(appointment, { status: 'Completed' });
        }
        
        req.flash('success_msg', 'Prescription created successfully');
        res.redirect('/prescriptions');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to create prescription');
        res.redirect('/prescriptions/add');
    }
});

// Show prescription details
router.get('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .populate('appointment');
            
        if (!prescription) {
            req.flash('error_msg', 'Prescription not found');
            return res.redirect('/prescriptions');
        }
        
        // Convert to plain object and handle null references
        const safePrescription = prescription.toObject();
        if (!safePrescription.patient) {
            safePrescription.patient = { 
                name: 'Unknown Patient',
                phone: 'N/A',
                email: 'N/A'
            };
        } else {
            // Handle inconsistent field names in patient data
            safePrescription.patient.name = safePrescription.patient.name || 
                safePrescription.patient['Full Name'] || 'Unknown Patient';
            
            safePrescription.patient.phone = safePrescription.patient.phone || 
                safePrescription.patient['Phone Number'] || 'N/A';
                
            safePrescription.patient.email = safePrescription.patient.email || 
                safePrescription.patient.Email || 'N/A';
        }
        
        if (!safePrescription.doctor) {
            safePrescription.doctor = { 
                name: 'Unknown Doctor',
                specialization: 'N/A'
            };
        }
        
        res.render('prescriptions/details', { 
            title: `Prescription for ${safePrescription.patient.name}`,
            prescription: safePrescription
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch prescription details');
        res.redirect('/prescriptions');
    }
});

// Delete prescription
router.delete('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndDelete(req.params.id);
        if (!prescription) {
            req.flash('error_msg', 'Prescription not found');
            return res.redirect('/prescriptions');
        }
        
        req.flash('success_msg', 'Prescription deleted successfully');
        res.redirect('/prescriptions');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete prescription');
        res.redirect('/prescriptions');
    }
});

// Add this route after the GET /:id route

// Print prescription
router.get('/print/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .populate('appointment');
            
        if (!prescription) {
            req.flash('error_msg', 'Prescription not found');
            return res.redirect('/prescriptions');
        }
        
        // Convert to plain object and handle null references
        const safePrescription = prescription.toObject();
        if (!safePrescription.patient) {
            safePrescription.patient = { 
                name: 'Unknown Patient',
                phone: 'N/A',
                email: 'N/A'
            };
        } else {
            // Handle inconsistent field names in patient data
            safePrescription.patient.name = safePrescription.patient.name || 
                safePrescription.patient['Full Name'] || 'Unknown Patient';
            
            safePrescription.patient.phone = safePrescription.patient.phone || 
                safePrescription.patient['Phone Number'] || 'N/A';
                
            safePrescription.patient.email = safePrescription.patient.email || 
                safePrescription.patient.Email || 'N/A';
                
            safePrescription.patient.address = safePrescription.patient.address || 
                safePrescription.patient.Address || 'N/A';
                
            safePrescription.patient.medicalHistory = safePrescription.patient.medicalHistory || 
                safePrescription.patient['Medical History'] || 'None';
        }
        
        if (!safePrescription.doctor) {
            safePrescription.doctor = { 
                name: 'Unknown Doctor',
                specialization: 'N/A'
            };
        }
        
        res.render('prescriptions/print', { 
            title: 'Print Prescription',
            prescription: safePrescription,
            layout: false // Don't use the layout for printing
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to generate printable prescription');
        res.redirect('/prescriptions');
    }
});
module.exports = router;