const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
/* This file defines the routes for user authentication, including registration and login. */
router.post('/register', register);

/* The login route handles user authentication by verifying the provided email and password against the stored user data. */
router.post('/login', login);

module.exports = router;