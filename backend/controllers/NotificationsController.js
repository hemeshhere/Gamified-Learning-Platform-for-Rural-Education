const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');
const emailService = require('../services/emailServices');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// Send notification (teacher/admin)
router.post('/', requireAuth, requireRole(['teacher','admin']), async (req,res,next) => {
  try {
    const { userId, title, body } = req.body;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ error:'User not found' });

    const note = await Notification.create({ user: user._id, type:'progress', title, body, sentAt: new Date() });

    // send email (fire-and-forget)
    if(user.email){
      try {
        await emailService.sendMail({
          to: user.email,
          subject: title,
          text: body
        });
      } catch (emailErr){
        console.warn('Email send failed', emailErr.message);
      }
    }

    res.json({ ok:true, notification: note });
  } catch (err){ next(err); }
});

module.exports = router;
