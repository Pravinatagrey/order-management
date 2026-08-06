const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT Secret Key (Use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

/**
 * Express Middleware to verify JWT Authentication Token
 */
const verifyAuth = (req, res, next) => {
  try {
    // Extract token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    // Verify token payload
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user payload (e.g., userId, username) to request object
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid or corrupted authentication token.",
    });
  }
};

/**
 * Centralized API Error Response Handler
 * 
 * @param {Object} res - Express response object
 * @param {Error|string} error - Error object or custom message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleError = (res, error, statusCode = 500) => {
  console.error("API Error:", error);

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === "production" && { stack: error?.stack }),
  });
};

/**
 * Generate a JWT Token for authenticated users
 * 
 * @param {Object} payload - User details (e.g. { id, username })
 * @param {string} expiresIn - Expiration duration (default: "24h")
 */
const generateToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Hash a plain text password using bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed password
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Export functions for CommonJS (require syntax)
module.exports = {
  verifyAuth,
  handleError,
  generateToken,
  hashPassword,
  comparePassword,
};