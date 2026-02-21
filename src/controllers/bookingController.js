const { prisma } = require('../config/database');

// POST /bookings (Attendee Only)
const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.id; // From your JWT auth middleware

    // Using a Transaction to ensure seats are updated and booking is created safely
    const result = await prisma.$transaction(async (tx) => {
      // Check if the event exists and has enough seats
      const event = await tx.event.findUnique({
        where: { id: eventId }
      });

      if (!event) throw new Error("Event not found");
      if (event.status !== "PUBLISHED") throw new Error("This event is not open for booking");
      if (new Date(event.date) < new Date()) throw new Error("Cannot book past events");
      if (event.remainingSeats < quantity) throw new Error("Not enough seats available");

      // Update the event remaining seats (Atomic decrement)
      await tx.event.update({
        where: { id: eventId },
        data: {
          remainingSeats: { decrement: parseInt(quantity) }
        }
      });

      //Create the booking record
      return await tx.booking.create({
        data: {
          eventId,
          userId,
          quantity: parseInt(quantity),
          status: "CONFIRMED"
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: result
    });

  } catch (error) {
   //Check for double-booking (Is there already a booking for this user and event?)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventId: eventId,
        userId: userId
      }
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: "You have already booked a ticket for this event" });
    }
};
};

// GET /bookings (Attendee sees ONLY their own bookings)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id }, // Multi-tenant isolation
      include: {
        event: {
          select: { title: true, date: true, location: true }
        }
      }
    });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /event/:id/bookings (Organizer Only)
const getEventBookings = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if this event belongs to the organizer requesting it
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event || event.organizerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied. Not your event." });
    }

    const bookings = await prisma.booking.findMany({
      where: { eventId: id },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /bookings/:id (Cancel Booking)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking and check if the user owns it
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Use transaction to restore the seats and delete/update booking
    await prisma.$transaction(async (tx) => {
      // Restore seats
      await tx.event.update({
        where: { id: booking.eventId },
        data: { remainingSeats: { increment: booking.quantity } }
      });

      // Delete the booking
      await tx.booking.delete({ where: { id } });
    });

    res.status(200).json({ message: "Booking cancelled and seats restored" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  getEventBookings, 
  cancelBooking 
};