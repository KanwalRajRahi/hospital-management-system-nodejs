const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Get all patients
router.get('/', patientController.getPatients);

// Search patients
router.get('/search', patientController.searchPatients);

// Show add form
router.get('/add', patientController.showAddForm);

// Add patient
router.post('/', patientController.addPatient);

// Show patient details
router.get('/:id', patientController.getPatientDetails);

// Show edit form
router.get('/:id/edit', patientController.showEditForm);

// Update patient
router.put('/:id', patientController.updatePatient);

// Delete patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;