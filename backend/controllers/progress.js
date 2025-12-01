const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const { requireAuth } = require('../middlewares/auth');

// Update progress (student or teacher)
router.post('/', requireAuth, async (req,res,next) => {
  try {
    // expects: { studentId, lessonId, opId, xpEarned }
    const { studentId, lessonId, opId, xpEarned = 10 } = req.body;
    const idToUse = studentId || req.user.id;

    let prog = await Progress.findOne({ student: idToUse });
    if(!prog){
      prog = new Progress({ student: idToUse, lessonsCompleted: [], xp:0, level:1, processedOpIds: [] });
    }

    // idempotent
    if(opId && prog.processedOpIds.includes(opId)){
      return res.json({ message:'Already processed', progress: prog });
    }

    if(!prog.lessonsCompleted.map(String).includes(String(lessonId))){
      prog.lessonsCompleted.push(lessonId);
    }

    prog.xp += xpEarned;
    prog.level = Math.floor(prog.xp / 100) + 1;

    if(opId) prog.processedOpIds.push(opId);
    await prog.save();

    // mirror xp/level to User doc
    await User.findByIdAndUpdate(idToUse, { xp: prog.xp, level: prog.level });

    res.json({ message:'Progress updated', progress: prog });
  } catch (err){ next(err); }
});

router.get('/:studentId', requireAuth, async (req,res,next) => {
  try {
    const prog = await Progress.findOne({ student: req.params.studentId }).populate('lessonsCompleted','title fileUrl');
    res.json(prog);
  } catch (err){ next(err); }
});

module.exports = router;
