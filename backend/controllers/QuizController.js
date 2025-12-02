const express = require('express');
const router = express.Router();

const Quiz = require('../models/quizModel');
const Attempt = require('../models/attemptModel');
const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rolesMiddleware'); // if you used requireRole; otherwise use isTeacherOrAdmin for create
const { QUIZ_MAX_XP } = require('../utils/xpUtils');

// -- teacher/admin create quiz (if desired)
router.post('/',requireAuth,requireRole(['teacher', 'admin']),async (req, res, next) => {
    try {
      const quiz = await Quiz.create(req.body);
      res.status(201).json(quiz);
    } catch (err) {
      next(err);
    }
});


// -- student submits attempt & receives XP based on score
router.post('/attempt/:quizId', requireAuth, async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // build map of questions
    const qmap = new Map();
    quiz.questions.forEach(q => qmap.set(String(q._id), q));

    let score = 0;
    let totalMarks = 0;

    for (const ans of (answers || [])) {
      const q = qmap.get(String(ans.questionId));
      if (!q) continue;

      const marks = Number(q.marks || 1);
      totalMarks += marks;

      if (q.type === 'mcq') {
        if (typeof q.answerIndex !== 'undefined' && q.answerIndex === ans.answer) {
          score += marks;
        }
      }
    }

    // xp calculation
    const xpEarned = totalMarks > 0
      ? Math.round((score / totalMarks) * QUIZ_MAX_XP)
      : 0;

    // save attempt
    const attempt = await Attempt.create({
      student: req.user.id,
      quiz: quizId,
      answers,
      score,
      xpEarned
    });

    // update progress
    let prog = await Progress.findOne({ student: req.user.id });
    if (!prog) {
      prog = new Progress({
        student: req.user.id,
        lessonsCompleted: [],
        xp: 0,
        level: 1,
        processedOpIds: []
      });
    }

    prog.xp += xpEarned;
    prog.level = Math.floor(prog.xp / 100) + 1;
    await prog.save();

    // update user xp + level
    await User.findByIdAndUpdate(req.user.id, {
      xp: prog.xp,
      level: prog.level
    });

    // BADGE ENGINE INTEGRATION HERE
    const badgeEngine = require('../services/badgeEngineService');
    const newBadges = await badgeEngine.checkAndAwardBadges(req.user.id, {
      quizScore: score,
      totalMarks: totalMarks
    });

    // response
    res.json({
      message: "Attempt recorded",
      score,
      totalMarks,
      xpEarned,
      attemptId: attempt._id,
      newXp: prog.xp,
      newLevel: prog.level,
      newBadges   // ⬅️ include awarded badges
    });

  } catch (err) {
    next(err);
  }
});



// optional: list attempts for current user
router.get('/attempts', requireAuth, async (req,res,next) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id }).populate('quiz','title');
    res.json(attempts);
  } catch (err){ next(err); }
});

module.exports = router;
