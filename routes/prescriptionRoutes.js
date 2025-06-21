const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Get all prescriptions
router.get('/', prescriptionController.getPrescriptions);

// Show add form
router.get('/add', prescriptionController.showAddForm);

// Add prescription
router.post('/', prescriptionController.addPrescription);

// Show prescription details
router.get('/:id', prescriptionController.getPrescriptionDetails);

// Delete prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;