const express = require('express');
const router = express.Router();
const Lesson = require('../models/LessonModel');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// create lesson (teacher/admin)
router.post('/', requireAuth, requireRole(['teacher','admin']), async (req,res,next) => {
  try {
    const { title, description, fileUrl, language, grade } = req.body;
    const lesson = await Lesson.create({ title, description, fileUrl, language, grade, createdBy: req.user.id });
    res.status(201).json(lesson);
  } catch (err){ next(err); }
});

// list lessons (filter optional)
router.get('/', requireAuth, async (req,res,next) => {
  try {
    const filter = {};
    if(req.query.grade) filter.grade = req.query.grade;
    if(req.query.language) filter.language = req.query.language;
    const lessons = await Lesson.find(filter).populate('createdBy','name');
    res.json(lessons);
  } catch (err){ next(err); }
});

module.exports = router;
