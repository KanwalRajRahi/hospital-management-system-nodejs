const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ name: 1 });
        
        // Map doctors to handle different field structures
        const mappedDoctors = doctors.map(doc => {
            const doctor = doc.toObject ? doc.toObject() : doc;
            return {
                _id: doctor._id,
                name: doctor.name,
                specialization: doctor.specialization,
                qualification: doctor.qualification || 'N/A',
                experience: doctor.experience,
                email: doctor.email || doctor.contactDetails?.email || 'N/A',
                phone: doctor.phone || doctor.contactDetails?.phone || 'N/A',
                address: doctor.address || doctor.contactDetails?.address || 'N/A',
                availability: doctor.availability || []
            };
        });
        
        res.render('doctors/index', { 
            title: 'All Doctors',
            doctors: mappedDoctors
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching doctors');
        res.redirect('/');
    }
});

// Search doctors - MOVED UP before /:id route
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.redirect('/doctors');
        }
        
        const doctors = await Doctor.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { specialization: { $regex: query, $options: 'i' } }
            ]
        }).sort({ name: 1 });
        
        // Map doctors to handle different field structures
        const mappedDoctors = doctors.map(doc => {
            const doctor = doc.toObject ? doc.toObject() : doc;
            return {
                _id: doctor._id,
                name: doctor.name,
                specialization: doctor.specialization,
                qualification: doctor.qualification || 'N/A',
                experience: doctor.experience,
                email: doctor.email || doctor.contactDetails?.email || 'N/A',
                phone: doctor.phone || doctor.contactDetails?.phone || 'N/A',
                address: doctor.address || doctor.contactDetails?.address || 'N/A',
                availability: doctor.availability || []
            };
        });
        
        res.render('doctors/index', { 
            title: 'Search Results',
            doctors: mappedDoctors,
            query
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Search failed');
        res.redirect('/doctors');
    }
});

// Show add doctor form - MOVED UP before /:id route
router.get('/add', (req, res) => {
    res.render('doctors/add', { title: 'Add Doctor' });
});

// Add new doctor
router.post('/', async (req, res) => {
    try {
        // Process the form data
        const doctorData = {
            name: req.body.name,
            specialization: req.body.specialization,
            qualification: req.body.qualification,
            experience: req.body.experience,
            contactDetails: {
                email: req.body.contactDetails ? req.body.contactDetails.email : req.body['contactDetails[email]'],
                phone: req.body.contactDetails ? req.body.contactDetails.phone : req.body['contactDetails[phone]'],
                address: req.body.contactDetails ? req.body.contactDetails.address : req.body['contactDetails[address]']
            },
            availability: [{
                day: req.body.availability && req.body.availability[0] ? req.body.availability[0].day : req.body['availability[0][day]'],
                startTime: req.body.availability && req.body.availability[0] ? req.body.availability[0].startTime : req.body['availability[0][startTime]'],
                endTime: req.body.availability && req.body.availability[0] ? req.body.availability[0].endTime : req.body['availability[0][endTime]']
            }]
        };

        const newDoctor = new Doctor(doctorData);
        await newDoctor.save();
        
        req.flash('success_msg', 'Doctor added successfully');
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding doctor');
        res.redirect('/doctors/add');
    }
});

// Show doctor details - KEEP ONLY ONE VERSION of this route
router.get('/:id', async (req, res) => {
    try {
        const doc = await Doctor.findById(req.params.id);
        if (!doc) {
            req.flash('error_msg', 'Doctor not found');
            return res.redirect('/doctors');
        }
        
        // Map doctor to handle different field structures
        const doctor = doc.toObject ? doc.toObject() : doc;
        const mappedDoctor = {
            _id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization,
            qualification: doctor.qualification || 'N/A',
            experience: doctor.experience,
            email: doctor.email || doctor.contactDetails?.email || 'N/A',
            phone: doctor.phone || doctor.contactDetails?.phone || 'N/A',
            address: doctor.address || doctor.contactDetails?.address || 'N/A',
            availability: doctor.availability || []
        };
        
        res.render('doctors/details', { 
            title: mappedDoctor.name,
            doctor: mappedDoctor
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch doctor details');
        res.redirect('/doctors');
    }
});

// Show edit doctor form
router.get('/:id/edit', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            req.flash('error_msg', 'Doctor not found');
            return res.redirect('/doctors');
        }
        
        res.render('doctors/edit', { 
            title: `Edit ${doctor.name}`,
            doctor
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to fetch doctor details');
        res.redirect('/doctors');
    }
});

// Update doctor
router.put('/:id', async (req, res) => {
    try {
        const { name, specialization, email, phone, day, startTime, endTime } = req.body;
        
        // Create availability array
        const availability = [];
        if (Array.isArray(day)) {
            for (let i = 0; i < day.length; i++) {
                availability.push({
                    day: day[i],
                    startTime: startTime[i],
                    endTime: endTime[i]
                });
            }
        } else {
            availability.push({
                day,
                startTime,
                endTime
            });
        }
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            {
                name,
                specialization,
                contactDetails: {
                    email,
                    phone
                },
                availability
            },
            { new: true }
        );
        
        if (!updatedDoctor) {
            req.flash('error_msg', 'Doctor not found');
            return res.redirect('/doctors');
        }
        
        req.flash('success_msg', 'Doctor updated successfully');
        res.redirect(`/doctors/${updatedDoctor._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update doctor');
        res.redirect(`/doctors/${req.params.id}/edit`);
    }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            req.flash('error_msg', 'Doctor not found');
            return res.redirect('/doctors');
        }
        
        req.flash('success_msg', 'Doctor deleted successfully');
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete doctor');
        res.redirect('/doctors');
    }
});

module.exports = router;