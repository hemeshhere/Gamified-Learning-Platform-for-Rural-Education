require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const errorHandler = require('./middlewares/errorHandlerMiddleware');
// Global Middlewares
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Mongo connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err);
  process.exit(1);
});

// IMPORT CONTROLLERS
const AuthController = require('./controllers/AuthController');
const LessonsController = require('./controllers/LessonsController');
const ProgressController = require('./controllers/ProgressController');
const XpController = require('./controllers/XpController');
const QuizController = require('./controllers/QuizController');
const NotificationsController = require('./controllers/NotificationsController');
const SyncController = require('./controllers/SyncController');

// REGISTER ROUTES
app.use('/api/auth', AuthController);
app.use('/api/lessons', LessonsController);
app.use('/api/progress', ProgressController);
app.use('/api/xp', XpController);
app.use('/api/quiz', QuizController);
app.use('/api/notifications', NotificationsController);
app.use('/api/sync', SyncController);

// BASE ROUTE
app.get('/', (req, res) => {
  res.send("🚀 Gamified Learning Platform API is Running");
});

// GLOBAL ERROR HANDLER

app.use(errorHandler);

// START SERVER
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
