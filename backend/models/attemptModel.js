const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref:'Quiz' },
  answers: [Object],
  score: Number,
  xpEarned: Number,
  createdAt: { type:Date, default: Date.now }
});
attemptSchema.index({ student: 1, quiz: 1 }, { unique: true });
module.exports = mongoose.model('Attempt', attemptSchema);
