module.exports = {
  isTeacherOrAdmin: (req,res,next) => {
    if(!req.user) return res.status(401).json({ error:'Unauthorized' });
    if(['teacher','admin'].includes(req.user.role)) return next();
    res.status(403).json({ error:'Forbidden' });
  }
};
