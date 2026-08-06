import { Button, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {

  const { enqueueSnackbar } = useSnackbar();

  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  const navigate = useNavigate();

  const login = async (formData) => {

    try {

      const res = await axios.post(`${config.endpoint}/auth/login`, formData);

      if (res.data.success) {

        enqueueSnackbar("Logged in successfully", { variant: "success" });

        const { token, username, balance } = res.data;

        persistLogin(token, username, balance);
      }

    } catch (e) {

      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check backend connection.",
          { variant: "error" }
        );
      }
    }
  };

  const validateInput = ({ username, password }) => {

    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }

    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }

    return true;
  };

  const persistLogin = (token, username, balance) => {

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);

    navigate("/");
  };

  const handleLogin = () => {

    const data = { username, password };

    if (validateInput(data)) {
      login(data);
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">

      <Header hasHiddenAuthButtons={true} />

      <Box className="content">
        <Stack spacing={2} className="form">

          <h2 className="title">Login</h2>

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
          />

          <Button variant="contained" className="button" onClick={handleLogin}>
            LOGIN TO FOODEATs
          </Button>

          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Register now
            </Link>
          </p>

        </Stack>
      </Box>

      <Footer />

    </Box>
  );
};

export default Login;