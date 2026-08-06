const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* The generateToken function creates a JWT token using the user's ID as the payload. */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/* The register function handles user registration by checking if a user with the provided username already exists.  */
exports.register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists with that username' });

    const user = await User.create({ name, username, password, "balance": 100, "cart": [], "addresses": [], "phoneNumbers": [] });
    res.status(201).json({ message: 'User registered successfully',success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/* The login function handles user authentication by verifying the provided username and password against the stored user data. */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        username: user.username,
        balance: user.balance,
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during authentication' });
  }
};