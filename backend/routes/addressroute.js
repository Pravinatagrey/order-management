const express = require('express');
const router = express.Router();

const { updateAddress ,getAddresses,deleteAddress} = require('../controllers/userController');
const { handleError, verifyAuth } = require("../utils");


/* This file defines the routes for managing user addresses . */
router.post('/addresses', verifyAuth, updateAddress);
router.delete('/addresses/:id', verifyAuth, deleteAddress);
router.get('/addresses', verifyAuth, getAddresses   );

module.exports = router;
