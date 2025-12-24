const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const RefreshToken = require('../models/RefreshTokenModel');
const bcrypt = require("bcrypt");

function signAccess(user){
  return jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
}
function createRefreshToken(){
  return crypto.randomBytes(64).toString('hex');
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      role,
      phone,
      passwordHash
    });

    // ---- NEW FIX: return tokens same as login ----
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (err) {
    next(err);
  }
});



router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});


router.post('/refresh', async (req,res,next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ error:'Missing refresh' });
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const rec = await RefreshToken.findOne({ tokenHash: hash });
    if(!rec || rec.expiresAt < new Date()) return res.status(401).json({ error:'Invalid refresh' });
    const user = await User.findById(rec.user);
    const accessToken = signAccess(user);
    res.json({ accessToken });
  } catch (err){ next(err); }
});

const { requireAuth } = require("../middlewares/authMiddleware");

router.post(
  "/change-password",
  requireAuth, //  THIS IS REQUIRED
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const ok = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ error: "Incorrect old password" });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);


router.post('/logout', async (req,res,next) => {
  try {
    const { refreshToken } = req.body;
    if(refreshToken){
      const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await RefreshToken.deleteOne({ tokenHash: hash });
    }
    res.json({ ok:true });
  } catch (err){ next(err); }
});

module.exports = router;
