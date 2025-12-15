const express = require("express");
const router = express.Router();

const Notification = require("../models/notificationModel");
const User = require("../models/userModel");   // ✅ REQUIRED FIX
const emailService = require("../services/emailServices");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

// SEND NOTIFICATION (Teacher/Admin only)

router.post(
  "/",
  requireAuth,
  requireRole(["teacher", "admin"]),
  async (req, res, next) => {
    try {
      const { userId, title, body } = req.body;

      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
      }

      // If userId is empty → broadcast to all students
      if (!userId || userId.trim() === "") {
        const students = await User.find({ role: "student" });

        const notifications = await Promise.all(
          students.map((stu) =>
            Notification.create({
              user: stu._id,
              type: "broadcast",
              title,
              body,
              sentAt: new Date(),
            })
          )
        );

        return res.json({
          ok: true,
          message: "Broadcast sent to all students",
          count: notifications.length,
        });
      }

      // Otherwise send to single user

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const note = await Notification.create({
        user: user._id,
        type: "teacher",
        title,
        body,
        sentAt: new Date(),
      });

      res.json({ ok: true, notification: note });
    } catch (err) {
      next(err);
    }
  }
);


// GET NOTIFICATIONS FOR THE LOGGED-IN USER

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const notes = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(notes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
