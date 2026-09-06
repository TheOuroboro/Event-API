const { prisma } = require('../config/database');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {} = require ("../utils/password")
const { generateToken } = require('../utils/jwt');
const {hashPassword} = require("../utils/password")

// Register user
const register = async (req, res) => {
  try {
    const {email, password, role } = req.body;

    //Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Kindly fill all fields!" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
   const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "ATTENDEE"
      }
    });

    res.status(201).json({
      message: "Registration Successful",
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("DETAILED ERROR:", error); // This will show up in the Render Logs
    res.status(500).json({ 
        message: "Registration failed", 
        error: error.message, // This will show up in Postman
        stack: error.stack 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input check
    if (!email || !password) {
      return res.status(400).json({ message: "both fields requires are required" });
    }
    //no password inputed
    if (email || !password){
      return res.status(400).json({message: "password required"})
    }
    //No Email inputed
    if (!email || password){
      return res.status(400).json({message: "email required"})
    }
    const user = await prisma.user.findUnique({ where: { email } });

    // Existing Email
    if (!user) {
      return res.status(401).json({ message: "Email exists!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password, please try again!" });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};
//Things to work on
// Why is it only server error that is defined
// Role should only be asked in login for admins
//RBAC

module.exports = { register, login };