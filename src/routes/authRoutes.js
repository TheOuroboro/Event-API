const express = require('express');
const router = express.Router();

// Import validation middleware and the Joi schemas
const validate = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// Import the  controller functions
const { register, login } = require('../controllers/authController');

// 3. Applying validation before the controller logic
// Registration: validates name, email, password, and roles 
router.post('/register', validate(registerSchema), register);

// Login: validates email and password format 
router.post('/login', validate(loginSchema), login);

module.exports = router;