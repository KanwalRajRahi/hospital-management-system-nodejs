const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        
        // Log the raw patient data to see what we're working with
        console.log('Raw patient data:', JSON.stringify(patients, null, 2));
        
        // Map the patients to handle different field naming conventions
        const mappedPatients = patients.map(patient => {
            // Convert Mongoose document to plain JavaScript object
            const patientObj = patient.toObject ? patient.toObject() : patient;
            
            return {
                _id: patientObj._id,
                name: patientObj.name || patientObj['Full Name'] || 'N/A',
                age: patientObj.age || patientObj['Age'] || 'N/A',
                gender: patientObj.gender || patientObj['Gender'] || 'N/A',
                phone: patientObj.contactDetails?.phone || patientObj['Phone Number'] || 'N/A',
                email: patientObj.contactDetails?.email || patientObj['Email'] || 'N/A',
                address: patientObj.contactDetails?.address || patientObj['Address'] || 'N/A',
                medicalHistory: patientObj.medicalHistory || patientObj['Medical History'] || 'N/A'
            };
        });
        
        // Log the mapped data
        console.log('Mapped patient data:', JSON.stringify(mappedPatients, null, 2));
        
        res.render('patients/index', { 
            title: 'All Patients',
            patients: mappedPatients
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching patients');
        res.redirect('/');
    }
});

// Search patients
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.redirect('/patients');
        }
        
        const patients = await Patient.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { 'contactDetails.phone': { $regex: query, $options: 'i' } },
                { 'contactDetails.email': { $regex: query, $options: 'i' } }
            ]
        }).sort({ name: 1 });
        
        res.render('patients/index', { 
            title: 'Search Results',
            patients,
            query
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Search failed');
        res.redirect('/patients');
    }
});

// Show add patient form
router.get('/add', (req, res) => {
    res.render('patients/add', { title: 'Add Patient' });
});

// Add new patient
router.post('/', async (req, res) => {
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
        req.flash('success_msg', 'Patient added successfully');
        res.redirect('/patients');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to add patient');
        res.redirect('/patients/add');
    }
});

// Show patient details
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            req.flash('error_msg', 'Patient not found');
            return res.redirect('/patients');
        }
        
        // Map the patient to handle different field naming conventions
        const mappedPatient = {
            _id: patient._id,
            name: patient.name || patient['Full Name'] || 'N/A',
            age: patient.age || patient['Age'] || 'N/A',
            gender: patient.gender || patient['Gender'] || 'N/A',
            contactDetails: {
                phone: patient.contactDetails?.phone || patient['Phone Number'] || 'N/A',
                email: patient.contactDetails?.email || patient['Email'] || 'N/A',
                address: patient.contactDetails?.address || patient['Address'] || 'N/A'
            },
            medicalHistory: patient.medicalHistory || patient['Medical History'] || 'N/A'
        };
        
        res.render('patients/details', { 
            title: mappedPatient.name,
            patient: mappedPatient
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch patient details');
        res.redirect('/patients');
    }
});

// Show edit patient form
router.get('/:id/edit', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            req.flash('error_msg', 'Patient not found');
            return res.redirect('/patients');
        }
        
        res.render('patients/edit', { 
            title: `Edit ${patient.name}`,
            patient
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch patient details');
        res.redirect('/patients');
    }
});

// Update patient
router.put('/:id', async (req, res) => {
    try {
        const { name, age, gender, email, phone, address, medicalHistory } = req.body;
        
        const updatedPatient = await Patient.findByIdAndUpdate(
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
        
        if (!updatedPatient) {
            req.flash('error_msg', 'Patient not found');
            return res.redirect('/patients');
        }
        
        req.flash('success_msg', 'Patient updated successfully');
        res.redirect(`/patients/${updatedPatient._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update patient');
        res.redirect(`/patients/${req.params.id}/edit`);
    }
});

// Delete patient
router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            req.flash('error_msg', 'Patient not found');
            return res.redirect('/patients');
        }
        
        req.flash('success_msg', 'Patient deleted successfully');
        res.redirect('/patients');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete patient');
        res.redirect('/patients');
    }
});

// Add new appointment for patient
router.get('/:id/appointments/new', (req, res) => {
    res.redirect(`/appointments/new?patientId=${req.params.id}`);
});

module.exports = router;