require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const errorHandler = require('./middlewares/errorHandlerMiddleware');

// ----------- CORS FIX -----------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);

// ---------- PARSING ----------
app.use(express.json());

// ---------- HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: Date.now() });
});

// ---------- LOGGING ----------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- MONGO CONNECT ----------
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Mongo connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err);
  process.exit(1);
});

// ---------- IMPORT ROUTES ----------
const AuthController = require('./controllers/AuthController');
const LessonsController = require('./controllers/LessonsController');
const ProgressController = require('./controllers/ProgressController');
const XpController = require('./controllers/XpController');
const QuizController = require('./controllers/QuizController');
const NotificationsController = require('./controllers/NotificationsController');
const SyncController = require('./controllers/SyncController');
const UserController = require("./controllers/userController");

// ---------- REGISTER ROUTES ----------
app.use('/api/auth', AuthController);
app.use('/api/lessons', LessonsController);
app.use('/api/progress', ProgressController);
app.use('/api/xp', XpController);
app.use('/api/quiz', QuizController);
app.use('/api/notifications', NotificationsController);
app.use('/api/sync', SyncController);
app.use("/api/users", UserController);

// ---------- ROOT ----------
app.get('/', (req, res) => {
  res.send("🚀 Gamified Learning Platform API is Running");
});

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
