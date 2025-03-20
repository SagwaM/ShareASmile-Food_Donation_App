import React, { useState } from "react";
import axios from "axios";
import { Paper, TextField, Button, Typography, Box, InputAdornment,IconButton, } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {useNavigate} from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize navigation
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
        newPassword,
      });

      iziToast.success({
        title: "Success",
        message: response.data.message,
        position: "topRight",
        timeout: 3000,
      });

      setEmail("");
      setNewPassword("");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 seconds delay to show success message
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to update password",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          width: "350px",
          textAlign: "center",
          backgroundColor: (theme) => theme.palette.mode === "dark" ? "#333" : "#fff",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
               ),
            }}
          />
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
               ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Reset Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
