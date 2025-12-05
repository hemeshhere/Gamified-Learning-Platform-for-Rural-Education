const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type:String, required:true },
  description: String,
  fileUrl: String,
  videoUrl: String,
  language: String,
  grade: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);
