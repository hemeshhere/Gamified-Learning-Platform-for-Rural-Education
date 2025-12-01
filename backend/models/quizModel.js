const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  type: { type:String, enum:['mcq','short'], default:'mcq' },
  options: [String],
  answerIndex: Number,
  marks: { type:Number, default:1 }
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
