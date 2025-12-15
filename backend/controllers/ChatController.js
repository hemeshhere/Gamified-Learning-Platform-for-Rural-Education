const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/userModel");
const { requireAuth } = require("../middlewares/authMiddleware");

// GET TEACHERS LIST (for students)
router.get("/teachers", requireAuth, async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name email _id");
    res.json(teachers);
  } catch (err) {
    next(err);
  }
});

// GET STUDENTS LIST (for teachers)
router.get("/students", requireAuth, async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("name email _id");
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET FULL CONVERSATION BETWEEN TWO USERS

router.get("/conversation/:userId", requireAuth, async (req, res, next) => {
  try {
    const me = String(req.user.id);
    const other = String(req.params.userId);

    if (!other) return res.status(400).json({ error: "Chat partner missing" });

    const messages = await ChatMessage.find({
      $or: [
        { sender: me, receiver: other },
        { sender: other, receiver: me }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// SEND MESSAGE

router.post("/send", requireAuth, async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ error: "Receiver & message required" });
    }

    const msg = await ChatMessage.create({
      sender: String(req.user.id),
      receiver: String(receiverId),
      message
    });

    // Important: format the message for frontend usage
    
    const formattedMessage = {
      _id: msg._id,
      sender: String(msg.sender),
      receiver: String(msg.receiver),
      message: msg.message,
      createdAt: msg.createdAt
    };

    res.json(formattedMessage);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
