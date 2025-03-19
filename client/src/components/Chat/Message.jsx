import React, { useState } from "react";
import { Fab, Box, Paper, Typography, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbox UI */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 300,
            maxHeight: 400,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Paper elevation={4} sx={{ p: 2 }}>
            {/* Chat Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Chat</Typography>
              <IconButton size="small" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Placeholder Content */}
            <Typography variant="body2">Select a user to start chatting...</Typography>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Chatbox;
