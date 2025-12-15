const express = require('express');
const router = express.Router();
const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const Lesson = require('../models/lessonModel');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rolesMiddleware'); 
const { addXp, DEFAULT_LESSON_XP } = require('../utils/xpUtils');
const badgeEngine = require('../services/badgeEngineServices');

// teacher/admin manual update 

router.post('/', requireAuth, requireRole(['teacher','admin']), async (req, res, next) => {
  try {
    const { studentId, lessonId, xpEarned = DEFAULT_LESSON_XP, opId } = req.body;

    if (!studentId || !lessonId)
      return res.status(400).json({ error: 'studentId and lessonId required' });

    // verify lesson
    const lesson = await Lesson.findById(lessonId).select('_id');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

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

    if (opId && prog.processedOpIds.includes(opId))
      return res.json({ message: 'Already processed', progress: prog });

    if (!prog.lessonsCompleted.map(String).includes(String(lessonId)))
      prog.lessonsCompleted.push(lessonId);

    prog.xp += Number(xpEarned);
    prog.level = Math.floor(prog.xp / 100) + 1;

    if (opId) prog.processedOpIds.push(opId);
    await prog.save();

    await User.findByIdAndUpdate(studentId, { xp: prog.xp, level: prog.level });

    res.json({ message: 'Progress updated (manual)', progress: prog });
  } catch (err) {
    next(err);
  }
});

// student marks lesson complete (automatic XP awarding) 

router.post('/complete', requireAuth, async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { lessonId, opId } = req.body;
    if (!lessonId) return res.status(400).json({ error: 'lessonId required' });

    const lesson = await Lesson.findById(lessonId).select('_id title');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    let prog = await Progress.findOne({ student: studentId });
    if (!prog) {
      prog = new Progress({ student: studentId, lessonsCompleted: [], xp: 0, level: 1, processedOpIds: [] });
    }

    // idempotent by opId
    if (opId && prog.processedOpIds.includes(opId)) {
      return res.json({ message: 'Already processed', progress: prog });
    }

    // add lesson once
    const lessonIdStr = String(lessonId);
    if (!prog.lessonsCompleted.map(String).includes(lessonIdStr)) {
      prog.lessonsCompleted.push(lessonIdStr);
    }

    // award default XP
    const earned = DEFAULT_LESSON_XP;
    prog.xp += earned;
    prog.level = Math.floor(prog.xp / 100) + 1;

    if (opId) prog.processedOpIds.push(opId);
    await prog.save();

    // mirror to user
    await User.findByIdAndUpdate(studentId, { xp: prog.xp, level: prog.level });
    const newBadges = await badgeEngine.checkAndAwardBadges(studentId);
    return res.json({
      message: 'Lesson completed',
      lesson: { id: lesson._id, title: lesson.title },
      xpEarned: earned,
      newBadges,
      progress: prog
    });
      } catch (err) {
        next(err);
      }
});

// GET progress (existing)
// GET progress (auto-create if not exists)
router.get('/:studentId', requireAuth, async (req, res, next) => {
  try {
    let prog = await Progress.findOne({ student: req.params.studentId })
      .populate('lessonsCompleted', 'title fileUrl');

    // If student has no progress, create a fresh record
    if (!prog) {
      prog = await Progress.create({
        student: req.params.studentId,
        lessonsCompleted: [],
        xp: 0,
        level: 1,
        processedOpIds: []
      });
    }

    res.json(prog);

  } catch (err) {
    next(err);
  }
});

// GET student badges
router.get('/badges/:studentId', requireAuth, async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    const prog = await Progress.findOne({ student: studentId })
      .populate("badges", "name icon description");

    if (!prog) {
      return res.json([]);
    }

    res.json(prog.badges || []);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
