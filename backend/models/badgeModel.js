const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type:String, required:true },
  description: String,
  iconUrl: String,
  criteria: Object 
});

module.exports = mongoose.model('Badge', badgeSchema);
