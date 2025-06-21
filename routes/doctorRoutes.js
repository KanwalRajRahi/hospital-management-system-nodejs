const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', doctorController.getDoctors);

// Search doctors
router.get('/search', doctorController.searchDoctors);

// Show add form
router.get('/add', doctorController.showAddForm);

// Add doctor
router.post('/', doctorController.addDoctor);

// Show doctor details
router.get('/:id', doctorController.getDoctorDetails);

// Show edit form
router.get('/:id/edit', doctorController.showEditForm);

// Update doctor
router.put('/:id', doctorController.updateDoctor);

// Delete doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;