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

router.delete("/:id", requireAuth, requireRole(["teacher", "admin"]), async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});


// UPDATE STUDENT
router.put("/:id", requireAuth, requireRole(["teacher", "admin"]), async (req, res, next) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
});

router.get("/teachers", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("name email");
  res.json(teachers);
});


module.exports = router;
