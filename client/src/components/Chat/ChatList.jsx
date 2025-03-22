import React from "react";
import { Box, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";


const ChatList = ({ participants = [], allUsers= [], messages= [], currentUser, onSelectUser }) => {
    console.log("Participants:", participants);
console.log("All Users:", allUsers);
console.log("Messages:", messages);
console.log("Current User:", currentUser);

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor: "#fff", overflowY: "auto" }}>
      {/* Participants Section */}
      <Typography variant="h6" sx={{ mb: 1 }}>Participants</Typography>

      {/* Recent Chats & Start New Chat */}
      <Typography variant="subtitle1" sx={{ pl: 2, pt: 1, fontWeight: "bold" }}>Recent Chats</Typography>
      <List>
        {participants.length > 0 ? (
          participants.map((user) => (
            <ListItem key={user._id} button onClick={() => onSelectUser(user)}>
              <ListItemText primary={user.name} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ pl: 2, color: "gray" }}>No active chats</Typography>
        )}
      </List>

      <Typography variant="subtitle1" sx={{ pl: 2, pt: 2, fontWeight: "bold" }}>Start New Chat</Typography>
      <List>
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <ListItem key={user._id} button onClick={() => onSelectUser(user)}>
              <ListItemText primary={user.name} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" sx={{ pl: 2, color: "gray" }}>No new users available</Typography>
        )}
      </List>
    </Box>
  );
};

export default ChatList;
