const express = require('express');
const router = express.Router();
const Negotiation = require('../models/Negotiation');
const auth = require('../middleware/auth');

const negotiationController = require('../controllers/negotiationController');

// Get all negotiations for a user
router.get('/', auth, negotiationController.listNegotiationsForUser);

// Get negotiation by ID
router.get('/:id', auth, negotiationController.getNegotiation);

// Create negotiation (buyer only)
router.post('/', auth, negotiationController.createNegotiation);

// Accept negotiation (seller only)
router.patch('/:id/accept', auth, negotiationController.acceptNegotiation);

// Reject negotiation (seller only)
router.patch('/:id/reject', auth, negotiationController.rejectNegotiation);

// Delete negotiation
router.delete('/:id', auth, negotiationController.deleteNegotiation);

module.exports = router;
