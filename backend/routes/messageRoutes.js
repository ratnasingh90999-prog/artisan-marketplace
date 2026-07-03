import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
  const { recipientId, text } = req.body;

  if (!recipientId || !text) {
    return res.status(400).json({ message: 'Recipient and message text are required' });
  }

  try {
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      text,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get message history with a specific user
// @route   GET /api/chat/:partnerId
// @access  Private
router.get('/:partnerId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.partnerId },
        { sender: req.params.partnerId, recipient: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as read where sender is partner and recipient is current user
    await Message.updateMany(
      { sender: req.params.partnerId, recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations/list
// @access  Private
router.get('/conversations/list', protect, async (req, res) => {
  try {
    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar role')
      .populate('recipient', 'name avatar role');

    const conversationMap = new Map();

    for (const msg of messages) {
      const partner = msg.sender._id.toString() === req.user._id.toString() ? msg.recipient : msg.sender;
      if (!partner) continue;

      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: msg.text,
          unread: !msg.read && msg.recipient._id.toString() === req.user._id.toString(),
          updatedAt: msg.createdAt,
        });
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
