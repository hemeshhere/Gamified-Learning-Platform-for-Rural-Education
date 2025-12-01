const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type:String, required:true },
  description: String,
  iconUrl: String,
  criteria: Object // simple criteria structure
});

module.exports = mongoose.model('Badge', badgeSchema);
