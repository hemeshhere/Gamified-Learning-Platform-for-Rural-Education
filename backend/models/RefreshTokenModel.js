const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  tokenHash: String,
  expiresAt: Date,
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
