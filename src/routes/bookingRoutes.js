const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings, 
  getEventBookings, 
  cancelBooking 
} = require('../controllers/bookingController');

// Standard Booking Routes
router.post('/', createBooking);        // POST /api/bookings
router.get('/', getUserBookings);       // GET /api/bookings
router.delete('/:id', cancelBooking);   // DELETE /api/bookings/:id
router.get('/event/:id', getEventBookings); //// GET /api/bookings/:id

module.exports = router;