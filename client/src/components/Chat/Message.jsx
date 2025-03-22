import React from "react";
import { Box, Typography } from "@mui/material";
import { ThemeProviderWrapper } from "@/context/ThemeContext";

const Message = ({ message, isSender }) => {
  return (
    <ThemeProviderWrapper>
    <Box sx={{
      display: "flex",
      justifyContent: isSender ? "flex-end" : "flex-start",
      mb: 1,
      px: 1, // Ensures spacing from edges
    }}>
      <Box
        sx={{
          maxWidth: "60%", // Limit message width
          p: 1.5,
          borderRadius: isSender ? "15px 15px 0px 15px" : "15px 15px 15px 0px",
          backgroundColor: isSender ? "#005A9C" : "#4CAF50", // Green for sender, gray for receiver
          color: isSender ? "#fff" : "#000",
          wordWrap: "break-word", // Ensures long messages wrap properly
          whiteSpace: "pre-wrap", // Handles multiline messages correctly
        }}
      >
      <Typography variant="body1" sx={{ wordBreak: "break-word" }}>{message.content}</Typography>
        <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5,  color: isSender ? "#E0E0E0" : "#555", }}>
        {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",})}
        </Typography>
      </Box>
      
    </Box>
    </ThemeProviderWrapper>
  );
};

export default Message;
