# 🍔 Order Management System - Food Delivery App

## 📌 Project Overview

The **Order Management System** is a full-stack food delivery application that allows users to browse food items, add items to their cart, place orders, and track order status in real time.

The project focuses on building a scalable and maintainable order management feature with a modern React frontend and RESTful backend APIs.

---

## 🚀 Features

### 🍕 Menu Display
- View available food items.
- Each food item includes:
  - Name
  - Description
  - Price
  - Image
- Responsive food listing UI.

### 🛒 Cart Management
- Add items to cart.
- Increase/decrease item quantity.
- Remove items from cart.
- Automatic total price calculation.

### 📦 Order Placement
- Checkout functionality.
- Customer delivery details:
  - Name
  - Address
  - Phone Number
- Order creation through REST API.

### 🚚 Order Tracking
- Track order progress.
- Order statuses:
  - Order Received
  - Preparing
  - Out for Delivery
  - Delivered

### ⚡ Real-Time Order Updates
- Simulated real-time order status updates.
- Status changes automatically after order placement.

### 🧪 Testing (TDD Approach)
- Backend API testing.
- Frontend component testing.
- Covers:
  - CRUD operations
  - Input validation
  - Order status updates
  - User interactions

---

# 🏗️ Architecture

```
order-management-system

├── frontend
│   ├── React + Vite
│   ├── Components
│   ├── Context API
│   ├── Axios API Integration
│   └── React Testing Library
│
├── backend
│   ├── Node.js
│   ├── Express.js
│   ├── REST APIs
│   ├── MongoDB
│   ├── Socket.IO
│   └── Jest + Supertest
│
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend
- React.js
- Vite
- React Router
- Axios
- Context API
- Material UI / Tailwind CSS
- Vitest
- React Testing Library

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Jest
- Supertest

## Deployment
- Frontend: Vercel
- Backend: Render / Vercel
- Database: MongoDB Atlas

---

# 🔗 API Endpoints
---

## User APIs

### Create User

```
POST /api/v1/register
```

Request:

```json
{
  "name": "John",
  "Email": "Mumbai",
  "password": "type password",
  "password": "type password"
}
```
### Login user
```
POST /api/v1/login
```

Request:

```json
{
  "Email": "useremail",
  "password": "type password"
}
```


### Cart add

```
POST /api/cart
```
Header:
authorization : Bearer <access token if user is login>
{
  "productId": "useremail",
  "qty": "type quantity"
}
---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Pravinatagrey/order-management.git
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start application:

```bash
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```
PORT=8082
MONGO_URI=your_mongodb_connection_string
```

Start server:

```bash
npm start
```

Backend runs on:

```
http://localhost:8082
```

---

# 🧪 Running Tests

## Backend Tests

```bash
npm test
```

Tests include:

- Create User API
- Create Cart API
- Create Order Api
- Invalid request handling

---

## Frontend Tests

```bash
npm run test
```

Tests include:

- Menu rendering
- Add to cart functionality
- Cart updates
- Checkout validation
- Order submission

---


---

# 🌐 Live Demo

Frontend:

```
https://order-management-frontend-azure.vercel.app/
```

Backend:
```
https://order-management-backend-jet.vercel.app
```

# 🤖 AI Tools Used

AI tools were used during development for:

- Generating initial project structure.
- Creating reusable React components.
- Writing unit and API test cases.
- Debugging errors.
- Improving code quality.
- Optimizing application performance.

---

# 🧩 Challenges & Solutions

## Challenge 1: Real-Time Order Updates

**Problem:**  
Need to show cart data by user changes without manual refresh.

**Solution:**  
Implemented Socket.IO to send automatic status updates from backend to frontend.

---

## Challenge 2: Maintaining Cart State

**Problem:**  
Cart data needed to be shared across multiple components.

**Solution:**  
Implemented React Context API for centralized cart management.

---

## Challenge 3: API Validation

**Problem:**  
Prevent invalid orders.

**Solution:**  
Added backend validation for customer details, cart items, and order data.

---

# 🔮 Future Improvements

- Payment gateway integration.
- Restaurant/admin dashboard.
- Order history.
- Push notifications.
- Cloud image storage.

---

# 👨‍💻 Author
**Praveen Atagrey**
Email : pravinatagrey@gmail.com


---

## ⭐ If you like this project, please give it a star!
