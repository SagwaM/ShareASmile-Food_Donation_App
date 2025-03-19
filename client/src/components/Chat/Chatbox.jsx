import React, {useEffect, useState} from "react";
import { Box, Typography, TextField, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";


const Chatbox = ({onClose}) => {
  const [participants, setParticipants] = useState([]); // Store participants
  const [selectedUser, setSelectedUser] = useState(null); // Track selected chat
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(""); // Store new message
  const [currentUserId, setCurrentUserId] = useState(null); // Store logged-in user's ID

  const token = localStorage.getItem("token");

  // Fetch chat participants when chatbox opens
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/message/conversations/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("API Response:", response.data);  // Debugging log

       // Get the current logged-in user's ID
        const currentUserResponse = await axios.get("http://localhost:5000/api/user/67bc395a79db9b2715c2bb7f", {
        headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserId = currentUserResponse.data._id; // Ensure this is the correct field

        // Extract unique participants from sender & receiver fields
        const uniqueUserIds = new Map();
        response.data.conversations.forEach(({ senderDetails, receiverDetails }) => {
            if (senderDetails._id !== currentUserId) {
                uniqueUserIds.set(senderDetails._id.toString(), senderDetails);
              }
        });
        const userDetails = await Promise.all(
            [...uniqueUserIds.keys()].map(async (id) => {
              const userResponse = await axios.get( `http://localhost:5000/api/user/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return userResponse.data; // Assuming API returns { id, name }
            })
          );
    
        setParticipants(userDetails);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, []);

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/message/userId`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.messages); // Assuming API returns { messages: [...] }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id); // Fetch messages when user is selected
  };
  
  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      const response = await axios.post("http://localhost:5000/api/message/",
        {
          receiverId: selectedUser._id,
          content: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update chat with the new message
      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",  // Inherit full width of parent
        height: "100%",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      {/* Chat Header */}
      <Box sx={{
         p: 2, 
         backgroundColor: "#1976d2",
         color: "#fff", 
         display: "flex", 
         justifyContent: "space-between", 
         alignItems: "center",
         borderTopLeftRadius: "10px",
         borderTopRightRadius: "10px",
         }}>
        <Typography variant="h6">{selectedUser ? selectedUser.name : "Chats"}</Typography>
        <IconButton onClick={onClose} sx={{ 
            color: "#fff", 
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "success.main",
            "&:hover": { backgroundColor: "primary.dark"} 
            }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Participants List */}
      {!selectedUser ? (
        <Box sx={{ flexGrow: 1, p: 2, backgroundColor: "#fff", overflowY: "auto" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Participants</Typography>
          <List>
            {participants.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem button={true} onClick={() => handleSelectUser(user)} key={user._id}>
                  <ListItemText primary={user.name} />
                </ListItem>
                <Divider  key={`divider-${user.id}`} />
              </React.Fragment>
            ))}
          </List>
        </Box>
    ) : (

      /* Chat Messages Area (Only shown when a user is selected)*/
      <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", backgroundColor: "#fff", borderRadius: "0px",}}>
        {messages.length > 0 ? (
            messages.map((msg, index) => (
              <Box key={index} sx={{
                display: "flex",
                justifyContent: msg.senderId === selectedUser._id ? "flex-start" : "flex-end",
                mb: 1,
              }}>
                <Typography 
                  sx={{
                    backgroundColor: msg.senderId === selectedUser._id ? "#ddd" : "#1976d2",
                    color: msg.senderId === selectedUser._id ? "#000" : "#fff",
                    p: 1,
                    borderRadius: "8px",
                    maxWidth: "70%",
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
            No messages yet...
            </Typography>
          )}
      </Box>
    )}

      {/* Chat Input */}
      {selectedUser && (
      <Box sx={{ 
        p: 1, 
        display: "flex", 
        alignItems: "center", 
        borderTop: "1px solid #ddd",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton color="success" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
      )}
    </Box>
  );
};

// **Ensure this is a default export**
export default Chatbox;
