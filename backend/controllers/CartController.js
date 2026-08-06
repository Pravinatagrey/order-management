const { handleError, getProduct } = require("../utils");
//const { products } = require("../db");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");


// Get User Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    // Find user and select only the cart field
    const user = await User.findById(userId).select("cart");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return cart array (or empty array if null/undefined)
    return res.status(200).json(user.cart || []);
  } catch (error) {
    return handleError(res, error);
  }
};

// Add / Modify / Remove item from Cart (NeDB Version)
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId is required" });
    }

   // Safely extract ID from JWT payload attached by verifyAuth
    const userId = req.user?._id || req.user?.id;
console.log(`POST request to "/cart" received for user: ${userId}, productId: ${productId}, qty: ${qty}`);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing" });
    }

    // Fetch the actual Mongoose document instance
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in database" });
    }

    // Now user is a Mongoose document with the .updateCart() instance method
    const updatedUser = await user.updateCart(productId, qty ?? 1);

    return res.status(200).json(updatedUser.cart);
  } catch (error) {
    return handleError(res, error);
  }
};

const category = (filename) => {
    const name = path.parse(filename).name.toLowerCase();
    if(name.includes("burger")) return "Burger";
    if(name.includes("pizza")) return "Pizza";
    if(name.includes("drink")) return "Drink";
    if(name.includes("dessert")) return "Dessert";
    return "Other";
}
// Checkout
const checkout = async (req, res) => {
  console.log(`POST request received to "/cart/checkout"`);

  try {
    const { addressId } = req.body;
    const userId = req.user?._id || req.user.id;

    if (!addressId) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    const user = await User.findById(userId);
    console.log(`User found for checkout: ${JSON.stringify(user)}`);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    // Retrieve all products to calculate total cost reliably
   var products = [] ;
      const uploadDir = path.join(__dirname, "../images");
     fs.readdir(uploadDir, (err, files) => {
           if (err) {
               return res.status(500).json({ message: "Unable to read images" });
           }
   // Define allowed image extensions
           const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
   // Filter and map the files to include only images with their respective categories and URLs
           const images1 = files
               .filter(file =>
                   imageExtensions.includes(path.extname(file).toLowerCase())
               )
               .map(file =>(
                   {
                   _id: path.parse(file).name,
                   productId: path.parse(file).name,
                   name: file,
                   category: category(file),
                   image: `${req.protocol}://${req.get("host")}/images/${file}`,
                   rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
                   reviews: Math.floor(Math.random() * 100) + 1 // Random number of reviews between 1 and 100  
               }));
               // Assigning costs based on category
               images1.map(image => {
                   if(image.category === "Burger") {
                       image.cost = 12.99;
                   }   
                   else if(image.category === "Pizza") {
                       image.cost = 15.99;
                   }
                   else if(image.category === "Drink") {
                       image.cost = 2.99;
                   }
                   else if(image.category === "Dessert") {
                       image.cost = 6.99;
                   }
                   else {
                       image.cost = 9.99;
                   } 
                 // console.log(`Product added for checkout: ${JSON.stringify(image)}`);
                products.push(JSON.parse(JSON.stringify(image)))
               });    
    });
    fs.closeSync(fs.openSync(path.join(__dirname, "../images"), 'r')); // Close the directory handle
     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
     await delay(5000);
// Wait for 1 second to ensure products are populated
    // Assuming getImages returns a promise that resolves to the product list
//console.log(`Products retrieved for checkout: ${JSON.stringify(products)}`);
    let selectProducts = [];
    for (const item of user.cart) {
      const product = products.filter((p) => String(p.productId) === String(item.productId)); 
      //console.log(`Product found for cart item ${item.productId}: ${JSON.stringify(product)}`);
      selectProducts .push(...product);
    }
    // Process order checkout
    const order = await user.checkout(addressId, selectProducts);

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  checkout,
};