const Badge = require('../models/badgeModel');
const Progress = require('../models/progressModel');
const Notification = require('../models/notificationModel');

module.exports.checkAndAwardBadges = async (studentId, context = {}) => {
  const prog = await Progress.findOne({ student: studentId });
  if (!prog) return;

  const earnedBadges = [];
  const already = new Set(prog.badges);

  const level = prog.level;
  const lessonsCount = prog.lessonsCompleted.length;
  const quizScore = context.quizScore || null;
  const totalMarks = context.totalMarks || null;

  // LEVEL BADGES

  const levelBadges = [
    { level: 2, badge: "Beginner" },
    { level: 5, badge: "Intermediate" },
    { level: 10, badge: "Advanced" },
    { level: 20, badge: "Master" }
  ];

  levelBadges.forEach(b => {
    if (level >= b.level && !already.has(b.badge)) {
      earnedBadges.push(b.badge);
    }
  });

  // LESSON BADGES

  if (lessonsCount >= 1 && !already.has("First Lesson")) {
    earnedBadges.push("First Lesson");
  }

  if (lessonsCount >= 5 && !already.has("Fast Learner")) {
    earnedBadges.push("Fast Learner");
  }

  if (lessonsCount >= 10 && !already.has("Dedicated Learner")) {
    earnedBadges.push("Dedicated Learner");
  }

  // QUIZ BADGES

  if (quizScore && totalMarks) {
    const percent = (quizScore / totalMarks) * 100;

    if (percent >= 80 && !already.has("Quiz Rookie")) {
      earnedBadges.push("Quiz Rookie");
    }

    if (percent >= 90 && !already.has("Quiz Pro")) {
      earnedBadges.push("Quiz Pro");
    }
  }

  // SAVE BADGES (avoid duplicates)
  
  if (earnedBadges.length > 0) {
    prog.badges.push(...earnedBadges);
    await prog.save();

    // Notify student
    for (const badgeName of earnedBadges) {
      await Notification.create({
        user: studentId,
        type: "badge",
        title: "New Badge Earned!",
        body: `You earned the '${badgeName}' badge!`,
        sentAt: new Date()
      });
    }
  }

  return earnedBadges;
};
