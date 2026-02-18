const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


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

// Organizer Only 
router.post("/", auth, authorize("ORGANIZER"), createEvent);

//
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;