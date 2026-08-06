import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

/* ---------- Helper Functions ---------- */
/**
 * Maps raw cart items from DB to full product objects containing quantity.
 */
export const generateCartItemsFrom = (cartData = [], productsData = []) => {
  if (!cartData || !cartData.length || !productsData || !productsData.length) {
    return [];
  }

  const productMap = new Map();
  for (let i = 0; i < productsData.length; i++) {
    productMap.set(String(productsData[i]._id), productsData[i]);
  }

  const cartItems = [];
  for (let i = 0; i < cartData.length; i++) {
    const item = cartData[i];
    const product = productMap.get(String(item.productId));
    if (product) {
      // Create a shallow copy to prevent mutating the original product object in state
      cartItems.push({
        ...product,
        quantity: item.qty,
      });
    }
  }

  return cartItems;
};

/**
 * Calculates total dollar cost of all items in the cart.
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].cost && items[i].quantity) {
      total += items[i].quantity * items[i].cost;
    }
  }
  return total;
};

/**
 * Calculates total number of physical items in the cart.
 */
export const getTotalItems = (items = []) => {
  let qty = 0;
  for (let i = 0; i < items.length; i++) {
    qty += items[i].quantity || 0;
  }
  return qty;
};

/* ---------- Item Quantity Component ---------- */

const ItemQuantity = ({ value, handleAdd, handleDelete, productId ,qty}) => {
  
  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleDelete(productId, value-1,{preventDuplicate: "handleDelete"})}
      >
        <RemoveOutlined />
      </IconButton>

      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>

      <IconButton
        size="small"
        color="primary"
        onClick={() => handleAdd(productId, value+1,{preventDuplicate: "handleAdd"} )}
      >
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/* ---------- Display Cart Items ---------- */

function DisplayCartItems(props) {
  const { image, name, cost, quantity, _id: id } = props.items;

  return (
    <Box display="flex"  alignItems="center" padding="1rem">
      <Box className="image-container">
        <img src={image} alt={name} width="100%" height="100%" />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
        width="100%"
      >
        <div>{name}</div>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!props.isReadOnly ? (
            <ItemQuantity
              value={quantity}
              handleAdd={(id, qty, options) => props.buttonClick(id, qty, options)}
              handleDelete={(id, qty, options) => props.buttonClick(id, qty, options)}
              productId={id}
              qty={quantity}
            />
          ) : (
            <Box>Qty: {quantity}</Box>
          )}

          <Box padding="0.5rem" fontWeight="700">
            ${cost}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Main Cart Component ---------- */
const Cart = ({ products, items = [], handleQuantity, isReadOnly = false }) => {
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <DisplayCartItems
          key={item._id}
          items={item}
          isReadOnly={isReadOnly}
          buttonClick={handleQuantity}
        />
      ))}

      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box color="#3C3C3C">Order total</Box>

        <Box
          color="#3C3C3C"
          fontWeight="700"
          fontSize="1.5rem"
          data-testid="cart-total"
        >
          ${getTotalCartValue(items)}
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" className="cart-footer">
        {!isReadOnly && window.location.pathname !== "/checkout" && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate("/checkout")}
            className="checkout-btn"
            startIcon={<ShoppingCartOutlined />}
          >
            Checkout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Cart;