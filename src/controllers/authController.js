const { prisma } = require('../config/database');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Logic for finding user and checking password goes here later
    res.status(200).json({ message: "Login successful (placeholder)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };