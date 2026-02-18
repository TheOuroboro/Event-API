const { prisma } = require('../config/database');

// GET /events (public, paginated)
const getAllEvents = async (req, res) => {
  try {
    // 1. Get page and limit from query, e.g., /api/events?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
      skip: skip,
      take: limit,
      orderBy: { date: 'asc' }
    });

    res.status(200).json({ page, limit, data: events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /events/:id
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });
    
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /events (organizer only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    // Note: Authentication logic will eventually verify if the user is an 'organizer'
    const newEvent = await prisma.event.create({
      data: { title, description, date: new Date(date), location }
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /events/:id (organizer only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /events/:id (organizer only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };