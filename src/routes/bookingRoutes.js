const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const { createBookingSchema } = require("../validators/bookingValidator");

const { 
  createBooking, 
  getUserBookings, 
  getEventBookings, 
  cancelBooking 
} = require('../controllers/bookingController');

// All booking routes require the user to be logged in
router.use(auth); 

// Attendees: Create a booking (validated) and see their own bookings
router.post('/', authorize("ATTENDEE"), validate(createBookingSchema), createBooking);
router.get('/', authorize("ATTENDEE"), getUserBookings);

// Attendees: Cancel their own booking
router.delete('/:id', authorize("ATTENDEE"), cancelBooking);

// Organizers: See all bookings for a specific event they created
router.get('/event/:id', authorize("ORGANIZER"), getEventBookings);

module.exports = router;