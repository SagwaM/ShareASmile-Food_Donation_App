import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, List, ListItem, ListItemText, CircularProgress, Avatar, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import io from "socket.io-client";  // Import socket.io-client
import Message from "./Message";
import {useAuth} from "@/context/AuthContext";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);
// Group messages by date
const groupMessagesByDate = (messages) => {
  const grouped = [];
  let lastDate = null;

  messages.forEach((message) => {
    const messageDateObj = new Date(message.timestamp).toLocaleDateString();
    const formattedDate = format(messageDateObj, "EEEE, MMM d yyyy"); // Example: "Monday, Mar 25, 2025"

    if (formattedDate !== lastDate) {
      grouped.push({ type: "date", content: formattedDate });
      lastDate = formattedDate;
    }
    
    grouped.push({ type: "message", content: message });
  });

  return grouped;
};
const Chatbox = ({ onClose }) => {
  const {user} = useAuth();
  const theme = useTheme();
  const [participants, setParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("Selected user:", selectedUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(response.data._id); // Store the logged-in user's ID
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);
 
  useEffect(() => {
    socket.on("typingIndicator", (data) => {
      console.log("Typing event received:", data); // Debugging line
      if (data.senderId === selectedUser?._id) {
        setIsTyping(data.isTyping);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off("typingIndicator");
    };
  }, [selectedUser]);
  // Fetch chat participants
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const convRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/message/conversations/list`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch all users
        const usersRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const uniqueUsers = new Map();
        convRes.data.conversations.forEach(({ senderDetails, receiverDetails }) => {
          if (!uniqueUsers.has(senderDetails._id)) {
            uniqueUsers.set(senderDetails._id, senderDetails);
          }
          if (!uniqueUsers.has(receiverDetails._id)) {
            uniqueUsers.set(receiverDetails._id, receiverDetails);
          }
        });
    
        // Filter out the logged-in user
        const filteredParticipants = [...uniqueUsers.values()].filter((u) => u._id !== currentUserId);
        // Filter all users to remove those already in chat
        const newUsers = usersRes.data.filter(
          (u) => u._id !== currentUserId && !filteredParticipants.some((p) => p._id === u._id)
        );

        setParticipants(filteredParticipants);
        setAllUsers(newUsers);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

  
    if (currentUserId) {
      fetchChatData();
    }
  }, [currentUserId, token]);


  // Fetch messages for a selected user
  const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/message/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      console.log("Fetched messages:", response.data);
      setMessages(sortedMessages);

      sortedMessages.forEach(async (message) => {
        if (message.receiver === currentUserId && !message.read) {
          try {
            await axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/api/message/${message._id}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error(`Error marking message ${message._id} as read:`, err);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/message/`,
        { receiver: selectedUser._id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");

      // If the user was not in the conversation list, add them
      if (!participants.some((p) => p._id === selectedUser._id)) {
        setParticipants([...participants, selectedUser]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Send typing indicator using WebSocket
  const handleTyping = () => {
    socket.emit("typing", { senderId: currentUserId, receiver: selectedUser?._id, isTyping: true });
  
    setTimeout(() => {
      socket.emit("typing", { senderId: currentUserId, receiver: selectedUser?._id, isTyping: false });
    }, 3000);
  };
  
  if (loading) return <CircularProgress/>;
  return (
    <ThemeProviderWrapper>
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: 3,
        boxShadow: 5,
        p: 2,
        backgroundColor: theme.palette.background.paper, // Adapts to dark mode
        color: theme.palette.text.primary, // Adapts text color
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText, display: "flex", alignItems: "center" }}>
        {selectedUser && (
          <IconButton onClick={() => setSelectedUser(null)} sx={{ color: "#fff", mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        {selectedUser && <Avatar src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${selectedUser.profile_picture}`} sx={{ mr: 2 }} />} 
        <Typography variant="h6">{selectedUser ? selectedUser.name : "Chats"}</Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff", marginLeft: "auto" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Chat List */}
      {!selectedUser ? (
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          <Typography variant="subtitle1" sx={{ pl: 2, pt: 1, fontWeight: "bold" }}>Recent Chats</Typography>
          <List>
            {participants.map((user) => (
              <ListItem
                key={user._id}
                button
                onClick={() => handleSelectUser(user)}
                sx={{
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#17B169" },
                }}
              >
                <Avatar src={user.profile_picture} sx={{ mr: 2 }} />
                <ListItemText primary={user.name} sx={{ fontSize: "16px" }} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" sx={{ pl: 2, pt: 2, fontWeight: "bold" }}>Start New Chat</Typography>
          <List>
            {allUsers.map((user) => (
              <ListItem
                key={user._id}
                button
                onClick={() => handleSelectUser(user)}
                sx={{
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#17B169" },
                }}
              >
                <Avatar src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile_picture}`} sx={{ mr: 2 }} />
                <ListItemText primary={user.name} sx={{ fontSize: "16px" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column" }}>
          {loadingMessages ? (
            <CircularProgress />
          ) : messages.length > 0 ? (
              groupMessagesByDate(messages).map((item, index) =>
                item.type === "date" ? (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      textAlign: "center",
                      color: "gray",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.content}
                  </Typography>
                ) : (
              <Message key={item.content._id} message={item.content} isSender={item.content.sender._id === currentUserId} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No messages yet...</Typography>
          )}
        </Box>
      )}

      {/* Message Input */}
      {isTyping && (
        <Typography variant="caption" sx={{ color: "gray", fontStyle: "italic" }}>
          {selectedUser?.name} is typing...
        </Typography>
      )}

      {selectedUser && (
        <Box sx={{ p: 1, display: "flex", alignItems: "center", borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            size="small"
            value={newMessage}
            onChange={(e) => {setNewMessage(e.target.value); handleTyping();}}
            sx={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.dark,
                },
                "& input": {
                  color: theme.palette.text.primary, // Ensures text is visible
                },
              },
            }}
          />
          <IconButton color="success" onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
    </ThemeProviderWrapper>
  );
};


export default Chatbox;
