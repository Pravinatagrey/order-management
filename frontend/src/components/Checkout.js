import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom, getTotalItems } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        onChange={(e) =>
          handleNewAddress({ ...newAddress, value: e.target.value })
        }
      />

      <Stack direction="row" my="1rem">
        <Button
          variant="contained"
          onClick={() => {
            addAddress(token, newAddress.value);
            handleNewAddress({ isAddingNewAddress: false, value: "" });
          }}
        >
          Add
        </Button>

        <Button
          variant="text"
          onClick={() =>
            handleNewAddress({ isAddingNewAddress: false, value: "" })
          }
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const addressLoaded = useRef(false);
  const { enqueueSnackbar } = useSnackbar();

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });

  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });
// Get All products
  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${config.endpoint}/images`);

      setProducts(res.data);
      return res.data;
    } catch {
      enqueueSnackbar("Could not fetch products", { variant: "error" });
    }
  }, [enqueueSnackbar]);
//Get Cart
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch {
      enqueueSnackbar("Could not fetch cart details", { variant: "error" });
    }
  }, [enqueueSnackbar, token]);

  //get Addressses
  const getAddresses = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if(res.data){
      setAddresses({ ...addresses, all: res.data.addresses });
      }
      return res.data;
    } catch {
      enqueueSnackbar("Could not fetch addresses", { variant: "error" });
    }
  },[enqueueSnackbar,token,addresses]);

  const addAddress = async (token, address) => {
    try {
      const res = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses({ ...addresses, all: res.data });
    } catch (e) {
      enqueueSnackbar(e.response?.data?.message || "Error adding address", {
        variant: "error",
      });
    }
  };

  const deleteAddress = async (token, id) => {
    try {
      const res = await axios.delete(
        `${config.endpoint}/user/addresses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses({ ...addresses, all: res.data });
    } catch (e) {
      enqueueSnackbar(e.response?.data?.message || "Error deleting address", {
        variant: "error",
      });
    }
  };

  const validateRequest = (items, addresses) => {
    if (getTotalCartValue(items) > localStorage.getItem("balance")) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    if (addresses.all.length === 0) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }

    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };

  const performCheckout = async () => {
    const isValid = validateRequest(items, addresses);

    if (!isValid) return;

    try {
      const res = await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        let balance = localStorage.getItem("balance");
        let remaining = balance - getTotalCartValue(items);

        localStorage.setItem("balance", remaining);

        navigate("/thanks");
      }
    } catch (e) {
      enqueueSnackbar(e.response?.data?.message || "Checkout failed", {
        variant: "error",
      });
    }
  };

//On loading page
  useEffect(() => {
    const loadData = async () => {
      const productsData = await getProducts();
      const cartData = await fetchCart();
      if (productsData && cartData) {
        const cartItems = generateCartItemsFrom(cartData, productsData);
        setItems(cartItems);
      }
     if (addressLoaded.current) {
      return;
      }
    addressLoaded.current = true;
    const res = await getAddresses();
    if(res.addresses){
      setAddresses({ ...addresses, all: res.addresses });
    }
    }
    loadData();
  }, [getProducts, fetchCart,getAddresses,addresses]);

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("You must be logged in to access checkout page", {
        variant: "info",
      });
      navigate("/");
    } else {
   //   getAddresses();
    }
  }, [token,enqueueSnackbar,navigate]);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography variant="h4" my="1rem">
              Shipping
            </Typography>

            <Divider />

            <Box>
              {addresses.all.length ? (
                addresses.all.map((add) => (
                  <div
                    key={add._id}
                    className={
                      addresses.selected === add._id
                        ? "address-item selected"
                        : "address-item"
                    }
                    onClick={() =>
                      setAddresses({ ...addresses, selected: add._id })
                    }
                  >
                    <p>{add.address}</p>

                    <Button
                      startIcon={<Delete />}
                      onClick={() => deleteAddress(token, add._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <Typography>No addresses found</Typography>
              )}
            </Box>

            {!newAddress.isAddingNewAddress ? (
              <Button
                variant="contained"
                onClick={() =>
                  setNewAddress({ ...newAddress, isAddingNewAddress: true })
                }
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            )}

            <Typography variant="h4" my="1rem">
              Payment
            </Typography>

            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>

              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={performCheckout}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />

          <Box className="cart" p={1}>
            <h2>Order Details</h2>

            <table>
              <tr>
                <td>Products</td>
                <td>{getTotalItems(items)}</td>
              </tr>

              <tr>
                <td>SubTotal</td>
                <td>${getTotalCartValue(items)}</td>
              </tr>

              <tr>
                <td>Shipping Charges</td>
                <td>$0</td>
              </tr>

              <tr>
                <td>
                  <h3>Total</h3>
                </td>
                <td>
                  <h3>${getTotalCartValue(items)}</h3>
                </td>
              </tr>
            </table>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
