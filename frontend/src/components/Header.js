import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import FoodMenuTabs from "./FoodMenuTabs";
import Box from "@mui/material/Box";
//import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const navigate = useNavigate();

  let userName = localStorage.getItem("username");

  const clear = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
      🍕 Food Order
      </Box>
    
      {children}

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => navigate("/")}
        >
          Back to explore
        </Button>
      ) : userName ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={userName} src="/avatar.png" />
          <p>{userName}</p>
          <Button variant="contained" onClick={clear}>
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
          >
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;