import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, updateName] = useState("");
  const [username, updateUserName] = useState("");
  const [password, updatePassword] = useState("");
  const [confirmPassword, updateConfirmPassword] = useState("");
  const [loader, updateLoader] = useState(false);

  const navigate = useNavigate();

  const register = async (formData) => {
    updateLoader(true);

    try {
      const res = await axios.post(`${config.endpoint}/auth/register`, {
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });
      if (res.data.success) {
        enqueueSnackbar("Registered successfully", { variant: "success" });
        navigate("/login");
      }
      updateLoader(false);
    } catch (e) {
      updateLoader(false);
      console.log(e);
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

  const validateInput = ({ name, username, password, confirmPassword }) => {
    if (!name) {
      enqueueSnackbar("Name is a required field", { variant: "warning" });
      return false;
    }

    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }

    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }

    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    const data = { name, username, password, confirmPassword };

    if (validateInput(data)) {
      register(data);
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="80vh">
      <Header hasHiddenAuthButtons={true} />

      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />  

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => updateUserName(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            helperText="Password must be at least 6 characters"
            fullWidth
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => updateConfirmPassword(e.target.value)}
          />

          {loader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={handleRegister}>
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>

        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default Register;