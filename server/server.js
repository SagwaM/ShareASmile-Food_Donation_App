require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const http = require('http');  // Needed for WebSockets
const { Server } = require('socket.io'); // Import Socket.io
const Message = require('./models/Message'); // ✅ Import Message model

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Attach Socket.io
app.set('io', io); // Attach Socket.io instance to Express app

const cleanupExpiredDonations = require('./utils/cleanupExpiredDonations'); // Auto-runs cleanup task
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const statsRoutes = require('./routes/statsRoutes'); // ✅ Import statsRoutes

// ✅ Secure CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*", // Restrict CORS in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Default route
app.get('/', (req, res) => {
  res.send('Food Donation Platform API is running...');
});


// Store online users
const onlineUsers = new Map();
// ✅ WebSocket Connection Handling
io.on('connection', (socket) => {
  console.log('🔌 New user connected:', socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId); // ✅ Join a private room for targeted messages
    console.log(`📡 User ${userId} joined their private room`);
  });

  // Handle typing indicator
  socket.on("typing", ({ senderId, receiver, isTyping }) => {
    io.to(receiver).emit('typingIndicator', { senderId, isTyping });
  });

  // Handle new message notification
  socket.on('sendMessage', (message) => {
    const receiverSocket = onlineUsers.get(message.receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', message);
    } else {
      io.to(message.receiver).emit('newMessageNotification', {
        senderId: message.sender,
        message: message.content,
        timestamp: message.timestamp
      });
    }
  });

  socket.on("markAsRead", async (messageId) => {
    const message = await Message.findById(messageId);
    if (message && !message.read) { // Ensure we only update unread messages
      message.read = true;
      await message.save();
      // ✅ Notify sender only
      io.to(message.sender).emit("messageRead", { messageId});
    }
  });

  // Remove user from online list on disconnect
  socket.on('disconnect', () => {
    console.log('❌  User disconnected:', socket.id);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
  });
});

// Run cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log("⏳ Running scheduled cleanup for expired donations...");
  await cleanupExpiredDonations();
});

// Serve static files (uploaded images)
app.use('/uploads', express.static( 'uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/stats", statsRoutes); // ✅ Attach statsRoutes

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
