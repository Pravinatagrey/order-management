const jwt = require('jsonwebtoken');

/* The authMiddleware function is a middleware that checks for the presence of a JWT token in the Authorization header of incoming requests.*/
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded userId to req.user as specified
    req.user = { userId: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token validation failed' });
  }
};

module.exports = authMiddleware;