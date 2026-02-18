const { prisma } = require('../config/database');

// POST /bookings (attendee only)
const createBooking = async (req, res) => {
  try {
    const { userId, eventId } = req.body; // In the future, userId comes from the JWT token
    
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        eventId: eventId,
      }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Could not create booking. Ensure Event and User exist." });
  }
};

// GET /bookings (user’s bookings)
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.query; // Usually extracted from Auth middleware
    
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: { event: true } // Shows event details along with the booking
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /events/:id/bookings (organizer only)
const getEventBookings = async (req, res) => {
  try {
    const { id } = req.params; // The Event ID
    
    const eventWithBookings = await prisma.event.findUnique({
      where: { id: id },
      include: { 
        bookings: {
          include: { user: true } // Shows which users booked this specific event
        }
      }
    });
    
    if (!eventWithBookings) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(eventWithBookings.bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /bookings/:id (cancel booking)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.booking.delete({
      where: { id: id }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Booking not found or already cancelled" });
  }
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  getEventBookings, 
  cancelBooking 
};