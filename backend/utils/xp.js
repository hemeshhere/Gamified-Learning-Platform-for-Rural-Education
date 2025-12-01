exports.calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

exports.addXp = (currentXp, earned) => {
  const xp = (currentXp || 0) + (earned || 0);
  return { xp, level: exports.calculateLevel(xp) };
};
