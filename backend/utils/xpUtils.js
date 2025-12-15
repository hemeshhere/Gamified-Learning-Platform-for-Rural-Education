exports.calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

exports.addXp = (currentXp = 0, earned = 0) => {
  const xp = Number(currentXp || 0) + Number(earned || 0);
  return { xp, level: exports.calculateLevel(xp) };
};

// standardized award amounts (you can tweak)
exports.DEFAULT_LESSON_XP = 10;
exports.QUIZ_MAX_XP = 20; // xp awarded for perfect quiz score
