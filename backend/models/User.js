const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

/* This file defines the Mongoose schema and model for users in the task management application. */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 100 },
  cart: [
    {
      productId: { type: String, required: true },
      qty: { type: Number, required: true, default: 1 }
    }
  ],
  addresses: [{ address: { type: String, required: true }, _id: { type: String, required: true }  }],
  phoneNumbers: [],
  orders: [
    {
      items: Array,
      total: Number,
      address: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { collection: "users", timestamps: true });

// Instance method to update user cart cleanly
UserSchema.methods.updateCart = async function (productId, qty) {
  const index = this.cart.findIndex(
    (item) => String(item.productId) === String(productId)
  );

  if (index === -1) {
    if (qty > 0) {
      this.cart.push({ productId, qty });
    }
  } else if (qty === 0) {
    // Delete item if qty is 0
    this.cart.splice(index, 1);
  } else {
    // Modify quantity
    this.cart[index].qty = qty;
  }

  // Save changes to database
  return await this.save();
};

UserSchema.methods.addAddress = async function (address) {
  if (!address || address.trim() === "") {
    throw new Error("Address cannot be empty");
  }
  this.addresses.push({ address, _id: nanoid()  }); 
  return await this.save();
}

const userupdate = UserSchema.methods.updateUser = function (updates) {
  Object.keys(updates).forEach((key) => {
    this[key] = updates[key];
  });
}


// Checkout schema method
UserSchema.methods.checkout = async function (addressId, products) {
  if (!this.cart || this.cart.length === 0) {
    throw new Error("Cart is empty");
  }

  // Find address
  const selectedAddress = this.addresses.find(
    (addr) => String(addr._id) === String(addressId)
  );

  if (!selectedAddress) {
    throw new Error("Invalid address selected");
  }

  // Map products in cart to calculate total cost
  const productMap = new Map();
  products.forEach((p) => productMap.set(String(p._id), p));

  let totalCost = 0;
  const orderItems = [];

  for (const item of this.cart) {
    const product = productMap.get(String(item.productId));
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    const itemTotal = product.cost * item.qty;
    totalCost += itemTotal;

    orderItems.push({
      product,
      qty: item.qty,
    });
  }

  // Check user balance
  if (this.balance < totalCost) {
    throw new Error("Insufficient balance to place order");
  }

  // Deduct balance
  this.balance -= totalCost;

  // Create order
  const newOrder = {
    items: orderItems,
    total: totalCost,
    address: selectedAddress.address,
    createdAt: new Date(),
  };

  this.orders.push(newOrder);

  // Clear cart
  this.cart = [];

  await this.save();
  return newOrder;
};

/* The pre-save hook is used to hash the user's password before saving it to the database.*/
UserSchema.pre('save', async function (next) {
// If password isn't modified, do nothing
  if (!this.isModified("password")) {
    return;
  }

  // Hash password or perform async actions
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* The matchPassword method is defined on the User schema to compare a given password with the hashed password stored in the database. */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);