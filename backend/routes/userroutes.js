const express = require('express');
const { login,register } = require('../controllers/authcontroller');
const router = express.Router();
/* This file defines the routes for user authentication, including registration and login. */
router.post('/register', register);
router.post('/login', login);

module.exports = router;
