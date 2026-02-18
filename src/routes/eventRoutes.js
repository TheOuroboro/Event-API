const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');

// Public
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Organizer Only (We will add Auth Middleware here later)
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;