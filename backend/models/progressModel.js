const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref:'User', unique:true },
  lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref:'Lesson' }],
  xp: { type:Number, default:0 },
  level: { type:Number, default:1 },
  badges: [String],
  processedOpIds: [String] // for offline dedupe
});

module.exports = mongoose.model('Progress', progressSchema);
