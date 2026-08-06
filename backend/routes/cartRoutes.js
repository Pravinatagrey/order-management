const express = require("express");
const router = express.Router();

const {handleError, verifyAuth } = require("../utils");
const { getCart, addToCart, checkout } = require("../controllers/CartController");

// Cart Routes
router.get("/", verifyAuth, getCart);
router.post("/", verifyAuth, addToCart);
router.post("/checkout", verifyAuth, checkout);

module.exports = router;
