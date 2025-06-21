const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAppointments);

// Show add form
router.get('/add', appointmentController.showAddForm);

// Add appointment
router.post('/', appointmentController.addAppointment);

// Show appointment details
router.get('/:id', appointmentController.getAppointmentDetails);

// Show edit form
router.get('/:id/edit', appointmentController.showEditForm);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;