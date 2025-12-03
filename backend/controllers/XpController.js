const express = require('express');
const router = express.Router();

const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rolesMiddleware'); 
// const { isTeacherOrAdmin } = require('../middlewares/roles');  // If you prefer this

const { calculateLevel } = require('../utils/xpUtils');

// Add XP route
router.post('/add', requireAuth, requireRole(['teacher', 'admin']), async (req, res, next) => {
  try {
    const { studentId, xp } = req.body;

    if (!studentId || typeof xp === 'undefined') {
      return res.status(400).json({ error: 'studentId and xp required' });
    }

    let prog = await Progress.findOne({ student: studentId });

    if (!prog) {
      prog = new Progress({
        student: studentId,
        lessonsCompleted: [],
        xp: 0,
        level: 1,
        processedOpIds: []
      });
    }

    prog.xp += Number(xp);
    prog.level = calculateLevel(prog.xp);

    await prog.save();
    await User.findByIdAndUpdate(studentId, { xp: prog.xp, level: prog.level });  
    const badgeEngine = require('../services/badgeEngineServices');
    const newBadges = await badgeEngine.checkAndAwardBadges(studentId);

    res.json({
      message: 'XP added',
      studentId,
      xp: prog.xp,
      level: prog.level,
      newBadges
    });


  } catch (err) {
    next(err);
  }
});

module.exports = router;
