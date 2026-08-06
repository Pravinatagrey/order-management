global.crypto = require('crypto'); 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
//routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRouter = require('./routes/product');
const addressRoute = require('./routes/addressRoute');

//image route
const pathData = require("./routes/product");
const path = require("path");

const app = express();
app.use(express.json());
connectDB();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost', credentials: true }));

app.use("/api/v1",pathData);//direct image access   
//image url
app.use("/images", express.static(path.join(__dirname, "images")));

//login and register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/user', addressRoute);


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;