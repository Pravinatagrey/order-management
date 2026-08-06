import { Box } from "@mui/system";
import React from "react";
import f from "../assets/image2.avif"
import "./Footer.css";

const Footer = () => {
 
  return (
    <Box className="footer">
      <Box>
        <img src={f} width="50rem" alt="food-icon"/>
      </Box>
      <p className="footer-text">
        FOODEATs is your one step solution to the buy the latest trending items
        with Fastest Delivery to your doorstep
      </p>
    </Box>
  );
};

export default Footer;
