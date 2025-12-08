const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  type: String,
  title: String,
  body: String,
  meta: Object,
  sentAt: { type: Date, default: Date.now },
  read: { type:Boolean, default:false }
});

module.exports = mongoose.model('Notification', notificationSchema);
