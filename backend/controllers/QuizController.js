const express = require('express');
const router = express.Router();

const Quiz = require('../models/quizModel');
const Attempt = require('../models/attemptModel');
const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rolesMiddleware');
const { QUIZ_MAX_XP } = require('../utils/xpUtils');

// CREATE QUIZ (Teacher/Admin)

router.post('/', requireAuth, requireRole(['teacher', 'admin']), async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});

// GET ALL QUIZZES

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
});

// GET QUIZ BY ID (Needed by QuizAttempt.jsx)

router.get('/:quizId', requireAuth, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// DELETE QUIZ (teacher/admin)
router.delete('/:quizId', requireAuth, requireRole(['teacher','admin']), async (req, res, next) => {
  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!deleted) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });

  } catch (err) {
    next(err);
  }
});


// STUDENT SUBMITS QUIZ ATTEMPT

router.post('/attempt/:quizId', requireAuth, async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { answers } = req.body;

    // 1. BLOCK MULTIPLE ATTEMPTS
    const alreadyAttempted = await Attempt.findOne({
      student: req.user.id,
      quiz: quizId
    });

    if (alreadyAttempted) {
      return res.status(400).json({
        error: "You have already submitted this quiz.",
        attemptId: alreadyAttempted._id,
        score: alreadyAttempted.score,
        xpEarned: alreadyAttempted.xpEarned
      });
    }

    // 2. FIND QUIZ
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // 3. SCORE CALCULATION
    const qmap = new Map();
    quiz.questions.forEach(q => qmap.set(String(q._id), q));

    let score = 0;
    let totalMarks = 0;

    for (const ans of (answers || [])) {
      const q = qmap.get(String(ans.questionId));
      if (!q) continue;

      const marks = Number(q.marks || 1);
      totalMarks += marks;

      if (q.type === 'mcq' && q.answerIndex === ans.answer) {
        score += marks;
      }
    }

    const xpEarned =
      totalMarks > 0 ? Math.round((score / totalMarks) * QUIZ_MAX_XP) : 0;

    // 4. SAVE NEW ATTEMPT
    const attempt = await Attempt.create({
      student: req.user.id,
      quiz: quizId,
      answers,
      score,
      xpEarned
    });

    // 5. UPDATE PROGRESS
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

    await User.findByIdAndUpdate(req.user.id, {
      xp: prog.xp,
      level: prog.level
    });

    // 6. BADGE ENGINE
    const badgeEngine = require('../services/badgeEngineServices');
    const newBadges = await badgeEngine.checkAndAwardBadges(req.user.id, {
      quizScore: score,
      totalMarks
    });

    // 7. RESPONSE
    res.json({
      message: 'Attempt recorded',
      score,
      totalMarks,
      xpEarned,
      attemptId: attempt._id,
      newXp: prog.xp,
      newLevel: prog.level,
      newBadges
    });

  } catch (err) {
    next(err);
  }
});

// GET ALL ATTEMPTS FOR CURRENT STUDENT

router.get('/attempts', requireAuth, async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id }).populate(
      'quiz',
      'title'
    );
    res.json(attempts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
