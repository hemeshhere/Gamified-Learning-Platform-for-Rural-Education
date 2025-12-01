const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.requireAuth = async (req,res,next) => {
  try {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({ error:'No token' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash -__v');
    if(!user) return res.status(401).json({ error:'Invalid token' });
    req.user = { id: user._id, role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error:'Unauthorized' });
  }
};

exports.requireRole = (roles = []) => (req,res,next) => {
  if(!req.user) return res.status(401).json({ error:'Unauthorized' });
  if(!roles.includes(req.user.role)) return res.status(403).json({ error:'Forbidden' });
  next();
};
