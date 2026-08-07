
const { handleError, verifyAuth } = require("../utils");
//var { users } = require("../db");
const User = require("../models/User");
const randomid = require("nanoid").nanoid;

const getAddresses = async (req, res) => {
  try {
    console.log('GET request received to "/user/addresses"');
      if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }
 const userId = req.user._id || req.user.id;
 const userData = await User.findById(userId);

    return res.status(200).json({
      success: true,
      addresses: userData.addresses || []
    });

  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get addresses"
    });
  }
}
//updating address
const updateAddress =  async (req, res) => {
  console.log(`POST request received to "/user/addresses"`);
  const { address,_id } = req.body;

  // Validation
  if (!address || address.length < 20) {
    return res.status(400).json({
      success: false,
      message: "Address should be greater than 20 characters",
    });
  }
  if (address.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Address should be less than 128 characters",
    });
  }

  try {
    const userId = req.user._id || req.user.id;

    // Push new address to user's addresses array in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: { address , _id: randomid() } } },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`Address "${address}" added for user`);
    return res.status(200).json(updatedUser.addresses);
  } catch (err) {
    return handleError(res, err);
  }
};
//deleteitems
const deleteAddress = async (req, res) => {
  console.log(`DELETE request received to "/user/addresses/${req.params.id}"`);
  try {
    const userId = req.user?._id || req.user?.id;
    const addressId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Pull (remove) the address matching addressId from the addresses array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`Address ${addressId} deleted successfully`);
    return res.status(200).json(updatedUser.addresses || []);
  } catch (error) {
    return handleError(res, error);
  }
};



module.exports = {
  getAddresses,updateAddress,deleteAddress
};
