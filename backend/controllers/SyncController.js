const express = require('express');
const router = express.Router();
const Progress = require('../models/progressModel');
const User = require('../models/userModel');
const { requireAuth } = require('../middlewares/authMiddleware');

// POST /api/sync
// body: { clientId, ops: [ { opId, type, payload } ] }
router.post('/', requireAuth, async (req,res,next) => {
  try {
    const { ops = [] } = req.body;
    const results = { synced: [], conflicts: [] };
    const affectedStudents = new Set();

    for(const op of ops){
      try {
        if(op.type === 'progress'){
          const { studentId, lessonId, xpEarned } = op.payload;
          const sid = studentId || req.user.id;
          affectedStudents.add(sid);
          let prog = await Progress.findOne({ student: sid });
          if(!prog) prog = new Progress({ student: sid, lessonsCompleted: [], xp:0, level:1, processedOpIds: []});
          if(op.opId && prog.processedOpIds.includes(op.opId)){
            results.synced.push(op.opId);
            continue;
          }
          if(!prog.lessonsCompleted.map(String).includes(String(lessonId))){
            prog.lessonsCompleted.push(lessonId);
          }
          prog.xp += xpEarned || 10;
          prog.level = Math.floor(prog.xp / 100) + 1;
          if(op.opId) prog.processedOpIds.push(op.opId);
          await prog.save();
          await User.findByIdAndUpdate(sid, { xp: prog.xp, level: prog.level });
          results.synced.push(op.opId || null);
        } else {
          // other op types could be handled
          results.conflicts.push({ opId: op.opId, error: 'Unknown op type' });
        }
      } catch (errOp){
        results.conflicts.push({ opId: op.opId, error: errOp.message });
      }
    }

    const state = {};
    for(const s of Array.from(affectedStudents)){
      state[s] = await Progress.findOne({ student: s }).populate('lessonsCompleted','title fileUrl');
    }

    res.json({ results, state });
  } catch (err){ next(err); }
});

module.exports = router;
