const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const { createEventSchema } = require("../validators/eventValidator");

const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');

// --- Public Routes ---
// GET /events should be public and paginated 
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// --- Protected Routes (Organizer Only) ---
// Only organizers can create and manage events 
router.post("/", auth, authorize("ORGANIZER"), validate(createEventSchema), createEvent);
router.put('/:id', auth, authorize("ORGANIZER"), validate(createEventSchema), updateEvent);
router.delete('/:id', auth, authorize("ORGANIZER"), deleteEvent);

module.exports = router;