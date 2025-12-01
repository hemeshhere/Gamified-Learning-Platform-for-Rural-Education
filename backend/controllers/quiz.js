const express = require('express');
const router = express.Router();

const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { requireAuth } = require('../middlewares/auth');

// -------------------------
// Submit Quiz Attempt
// -------------------------
router.post('/attempt/:quizId', requireAuth, async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { answers } = req.body; // [{questionId: "...", answer: 2}, ...]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    let total = 0;

    // map questions for easy lookup
    const questionMap = new Map();
    quiz.questions.forEach(q => questionMap.set(String(q._id), q));

    // scoring
    answers.forEach(ans => {
      const q = questionMap.get(ans.questionId);
      if (!q) return;

      total += q.marks || 1;

      if (q.type === 'mcq') {
        if (q.answerIndex === ans.answer) {
          score += q.marks || 1;
        }
      }

      // Extend for "short" questions (manual/AI grading)
    });

    // XP calculation
    const xpEarned = Math.round((score / total) * 20); // e.g., 20 XP for full score

    // Save attempt
    const attempt = await Attempt.create({
      student: req.user.id,
      quiz: quizId,
      answers,
      score,
      xpEarned
    });

    // Update progress XP
    let progress = await Progress.findOne({ student: req.user.id });
    if (!progress) {
      progress = new Progress({
        student: req.user.id,
        lessonsCompleted: [],
        xp: 0,
        level: 1
      });
    }

    progress.xp += xpEarned;
    progress.level = Math.floor(progress.xp / 100) + 1;
    await progress.save();

    // mirror XP on user
    await User.findByIdAndUpdate(req.user.id, {
      xp: progress.xp,
      level: progress.level
    });

    res.json({
      message: "Quiz submitted",
      score,
      total,
      xpEarned,
      attemptId: attempt._id,
      newXp: progress.xp,
      newLevel: progress.level
    });

  } catch (err) {
    next(err);
  }
});

// -------------------------
// Get attempts for a user (optional)
// -------------------------
router.get('/attempts', requireAuth, async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ student: req.user.id })
      .populate('quiz', 'title');
    res.json(attempts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
