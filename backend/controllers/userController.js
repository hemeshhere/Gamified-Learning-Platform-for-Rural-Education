const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

// GET all students
router.get("/students", requireAuth, requireRole(["teacher", "admin"]), async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email xp level createdAt");

    res.json(students);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
