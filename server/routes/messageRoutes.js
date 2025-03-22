const express = require('express');
const Message = require('../models/Message');
const { authenticateUser } = require('../middlewares/authMiddleware');
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// ✅ 1. Send a message
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }
    const newMessage = new Message({
      sender: req.user.userId, // Authenticated user as sender
      receiver,
      content,
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();

    // Get sender details
    const senderDetails = await User.findById(req.user.userId).select('name _id');

    const responseMessage = {
      ...savedMessage.toObject(),
      senderName: senderDetails.name,
    };
    // Emit real-time message event via WebSocket
    req.app.get('io').to(receiver).emit('receiveMessage', responseMessage);

    // Emit a new message notification
    req.app.get('io').to(receiver).emit('newMessageNotification', {
        senderId: req.user.userId,
        senderName: senderDetails.name,
        message: content,
        timestamp: new Date()
      });  

    res.status(201).json(responseMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Get unread messages for the logged-in user
router.get('/unread', authenticateUser, async (req, res) => {
    try {
      console.log(`Fetching unread messages for user: ${req.user.userId}`);

      const unreadMessages = await Message.find({ receiver: req.user.userId, read: false })
        .populate('sender', 'name')  // Fetch sender's name
        .sort({ timestamp: 1 });
      console.log(`Unread messages found: ${unreadMessages.length}`);

      res.json(unreadMessages);
    } catch (err) {
      console.error('Error fetching unread messages:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// ✅ 3. Get conversation history between two users
router.get('/:userId', authenticateUser, async (req, res) => {
  try {
    const otherUser = req.params.userId;
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query; // Pagination params

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUser },
        { sender: otherUser, receiver: userId }
      ]
    }).populate('sender', 'name profile_picture').populate('receiver', 'name profile_picture') // Fetch sender & receiver names
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit) // Pagination logic
      .limit(Number(limit));

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 4. Typing Indicator (WebSocket)
router.post('/typing', authenticateUser, (req, res) => {
    try {
      const { receiver, isTyping } = req.body;
  
      // Emit typing event
      req.app.get('io').to(receiver).emit('typingIndicator', {
        senderId: req.user.userId,
        senderName: req.user.name, // Fetch from authentication middleware
        isTyping
      });
  
      res.json({ message: 'Typing event sent' });
    } catch (err) {
      console.error('Error sending typing indicator:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

// ✅ 5. Mark a message as read
router.put('/:messageId/read', authenticateUser, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only the receiver can mark a message as read
    if (message.receiver.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    message.read = true;
    await message.save();

    // Emit real-time event for message read confirmation
    req.app.get('io').to(message.sender).emit('messageRead', {
        messageId: messageId,
        senderId: message.sender,
      });

    res.json({ message: 'Message marked as read' });
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 5. Get chat list (users the logged-in user has talked to)
router.get('/conversations/list', authenticateUser, async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.userId);
      const name = req.user.name;
      
      const messages = await Message.aggregate([
        // Match messages where the user is either sender or receiver
        { 
          $match: { $or: [{ sender: userId }, { receiver: userId }] } 
        },
        { 
          $sort: { timestamp: -1 } // Sort messages by newest first
        },
        {
          $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              pipeline: [
                  { $project: { _id: 1, name: 1, profile_picture: 1 } }
              ],
              as: "senderDetails"
          }
      },
      {
          $lookup: {
              from: "users",
              localField: "receiver",
              foreignField: "_id",
              pipeline: [
                  { $project: { _id: 1, name: 1, profile_picture: 1 } }
              ],
              as: "receiverDetails"
          }
      },
      {
          $project: {
              _id: 0,
              sender: "$sender",
              receiver: "$receiver",
              content: "$content",
              timestamp: "$timestamp",
              senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
              receiverDetails: { $arrayElemAt: ["$receiverDetails", 0] }
          }
      }
  ]);

  console.log("Raw messages from aggregation:", JSON.stringify(messages, null, 2));
  console.log("Raw messages from aggregation:", messages);

  res.json({ conversations: messages });
    } catch (err) {
      console.error('Error fetching conversations:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ✅ 6. Delete a message (only sender can delete their message)
  router.delete('/:messageId', authenticateUser, async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await Message.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      if (message.sender.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      await message.deleteOne();
  
      res.json({ message: 'Message deleted successfully' });
    } catch (err) {
      console.error('Error deleting message:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ✅ 7. Delete an entire conversation (only sender or receiver can delete)
  router.delete('/conversation/:userId', authenticateUser, async (req, res) => {
    try {
      const otherUser = req.params.userId;
      const userId = req.user.userId;
  
      await Message.deleteMany({
        $or: [
          { sender: userId, receiver: otherUser },
          { sender: otherUser, receiver: userId }
        ]
      });
  
      res.json({ message: 'Conversation deleted successfully' });
    } catch (err) {
      console.error('Error deleting conversation:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ✅ 8. Update (Edit) a message (only sender can edit)
  router.put('/:messageId', authenticateUser, async (req, res) => {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
  
      if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
      }
  
      const message = await Message.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      if (message.sender.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      message.content = content;
      await message.save();
  
      // Emit real-time update event
      req.app.get('io').to(message.receiver).emit('messageUpdated', message);
  
      res.json({ message: 'Message updated successfully', updatedMessage: message });
    } catch (err) {
      console.error('Error updating message:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

module.exports = router;
