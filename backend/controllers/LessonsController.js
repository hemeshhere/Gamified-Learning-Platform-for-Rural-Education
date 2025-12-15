const express = require('express');
const router = express.Router();
const Lesson = require('../models/lessonModel');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// CREATE LESSON (teacher/admin)

router.post('/', requireAuth, requireRole(['teacher','admin']), async (req,res,next) => {
  try {
    const { title, description, fileUrl, videoUrl, language, grade } = req.body;

    const lesson = await Lesson.create({
      title,
      description,
      fileUrl,
      videoUrl,
      language,
      grade,
      createdBy: req.user.id
    });

    res.status(201).json(lesson);
  } catch (err){ 
    next(err); 
  }
});

// GET ALL LESSONS (students + teachers)

router.get('/', requireAuth, async (req,res,next) => {
  try {
    const filter = {};

    if(req.query.grade) filter.grade = req.query.grade;
    if(req.query.language) filter.language = req.query.language;

    const lessons = await Lesson.find(filter).populate('createdBy','name');
    res.json(lessons);

  } catch (err){ 
    next(err); 
  }
});


// GET SINGLE LESSON BY ID (Needed for LessonViewer.jsx)

router.get('/:id', requireAuth, async (req,res,next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);

  } catch (err) {
    next(err);
  }
});

// DELETE LESSON (teacher/admin)

router.delete('/:id', requireAuth, requireRole(['teacher','admin']), async (req, res, next) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted successfully" });

  } catch (err) {
    next(err);
  }
});


module.exports = router;
