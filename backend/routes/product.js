var express = require("express");
var router = express.Router();
const { handleError } = require("../utils");
var { products } = require("../db");
const imageController = require("../controllers/productController");

// GET request to retrieve all images
router.get("/images",imageController.getImages);

/*
//get product by id
router.get("/:id", async (req, res) => {
  console.log(
    `Request received for retrieving product with id: ${req.params.id}`
  );
  try {
    const product = await getProduct(req.params.id);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    handleError(res, error);
  }
});
*/
module.exports = router;
