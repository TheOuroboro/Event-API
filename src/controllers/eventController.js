const { prisma } = require('../config/database');
const getPagination = require('../utils/pagination');

// GET /events (Public, Paginated, and Filtered)
const getAllEvents = async (req, res) => {
  try {
    const { page, limit, location, status } = req.query; 

    // 1. Use the utility to get skip/take values
    const { skip, take, p, l } = getPagination(page, limit);

    // 2. Fetch events and total count simultaneously
    const [events, totalItems] = await Promise.all([
      prisma.event.findMany({
        where: {
          location: location ? { contains: location, mode: 'insensitive' } : undefined,
          status: status ? status.toUpperCase() : "PUBLISHED",
        },
        skip: skip,
        take: take,
        orderBy: { date: 'asc' }
      }),
      prisma.event.count({
        where: {
          location: location ? { contains: location, mode: 'insensitive' } : undefined,
          status: status ? status.toUpperCase() : "PUBLISHED",
        }
      })
    ]);

    // 3. Return with standardized pagination metadata
    res.status(200).json({ 
      success: true,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / l),
        currentPage: p,
        limit: l
      },
      data: events 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Event(Organizer only)
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, ticketPrice, totalSeats } = req.body;
    
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date), 
        ticketPrice: parseFloat(ticketPrice), 
        totalSeats: parseInt(totalSeats), 
        remainingSeats: parseInt(totalSeats), 
        status: "PUBLISHED", 
        organizerId: req.user.id // From authMiddleware 
      }
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /events/:id
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {email: true }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    if (error.code === 'P2023') return res.status(400).json({ error: "Invalid ID format" });
    res.status(500).json({ error: error.message });
  }
};

// PATCH /events/:id
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({ where: { id } });
    
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Multi-tenant check: Only owner can update
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this event" });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /events/:id
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }

    await prisma.event.delete({ where: { id } });
    res.status(204).send(); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  getAllEvents, 
  getEventById,
  createEvent, 
  updateEvent, 
  deleteEvent 
};