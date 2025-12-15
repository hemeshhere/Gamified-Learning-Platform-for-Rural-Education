const express = require('express');
const router = express.Router();

const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const Lesson = require('../models/lessonModel');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rolesMiddleware');
const { calculateLevel } = require('../utils/xpUtils');

// ADD XP using student email + lesson title
router.post('/add', requireAuth, requireRole(['teacher', 'admin']), async (req, res, next) => {
  try {
    const { studentEmail, lessonTitle, xpEarned } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ error: "studentEmail is required" });
    }

    // Find student by email
    const student = await User.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // If lesson title provided, find the lesson
    let lesson = null;
    if (lessonTitle) {
      lesson = await Lesson.findOne({ title: lessonTitle });
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
    }

    // Get or create progress document
    let prog = await Progress.findOne({ student: student._id });

    if (!prog) {
      prog = new Progress({
        student: student._id,
        lessonsCompleted: [],
        xp: 0,
        level: 1,
        processedOpIds: []
      });
    }

    // Add lesson to completed list (if provided)
    if (lesson && !prog.lessonsCompleted.includes(lesson._id)) {
      prog.lessonsCompleted.push(lesson._id);
    }

    // Add XP
    const xpToAdd = Number(xpEarned) || 10;
    prog.xp += xpToAdd;
    prog.level = calculateLevel(prog.xp);

    await prog.save();

    //  Update user xp & level
    await User.findByIdAndUpdate(student._id, {
      xp: prog.xp,
      level: prog.level
    });

    // Award badges
    const badgeEngine = require('../services/badgeEngineServices');
    const newBadges = await badgeEngine.checkAndAwardBadges(student._id);

    return res.json({
      message: "XP added successfully",
      student: student.email,
      xp: prog.xp,
      level: prog.level,
      newBadges
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
