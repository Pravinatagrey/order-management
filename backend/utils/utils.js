// utils.js
const jwt = require("jsonwebtoken");
const { users } = require("./db"); // Import users DB

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

const verifyAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch full user from NeDB using ID from decoded JWT
    users.findOne({ _id: decoded._id || decoded.id }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed or user not found.",
        });
      }

      // Attach complete user database record to req.user
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = { verifyAuth };