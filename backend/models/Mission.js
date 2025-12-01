const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: String,
  description: String,
  lesson: { type: mongoose.Schema.Types.ObjectId, ref:'Lesson' },
  xpReward: { type:Number, default:10 },
  badgeReward: { type: mongoose.Schema.Types.ObjectId, ref:'Badge' }
});

module.exports = mongoose.model('Mission', missionSchema);
