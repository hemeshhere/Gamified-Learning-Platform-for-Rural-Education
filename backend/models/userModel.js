const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], default: 'student' },
  phone: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: false },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
