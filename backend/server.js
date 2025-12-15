require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const errorHandler = require('./middlewares/errorHandlerMiddleware');

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "https://gamified-learning-platform-for-rural-education-1za125yui.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow mobile apps/Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.log("❌ CORS BLOCKED:", origin);
    return callback(new Error("CORS not allowed by server."));
  },
  credentials: true,
}));

app.options("*", cors());

// BODY PARSER

app.use(express.json());

// HEALTH CHECK

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: Date.now() });
});

// REQUEST LOGGER

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MONGO CONNECTION

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });
  
// SOCKET.IO SETUP

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true }
});

// store userId → socket.id mapping
const userSockets = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // When user joins
  socket.on("join-room", (userId) => {
    userSockets[userId] = socket.id;
    socket.join(String(userId));
    console.log(`📌 User ${userId} joined room ${userId}`);
  });

  // When user sends a message
  socket.on("send-message", (msg) => {
    console.log("📨 Sending message to:", msg.receiver);

    // Emit to receiver
    io.to(String(msg.receiver)).emit("receive-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ROUTES IMPORT

const AuthController = require('./controllers/AuthController');
const LessonsController = require('./controllers/LessonsController');
const ProgressController = require('./controllers/ProgressController');
const XpController = require('./controllers/XpController');
const QuizController = require('./controllers/QuizController');
const NotificationsController = require('./controllers/NotificationsController');
const SyncController = require('./controllers/SyncController');
const UserController = require("./controllers/userController");
const ChatController = require("./controllers/ChatController");

// ROUTES REGISTER

app.use('/api/auth', AuthController);
app.use('/api/lessons', LessonsController);
app.use('/api/progress', ProgressController);
app.use('/api/xp', XpController);
app.use('/api/quiz', QuizController);
app.use('/api/notifications', NotificationsController);
app.use('/api/sync', SyncController);
app.use("/api/users", UserController);
app.use("/api/chat", ChatController);

// ROOT

app.get('/', (req, res) => {
  res.send("🚀 Gamified Learning Platform API is Running");
});

// GLOBAL ERROR HANDLER

app.use(errorHandler);
// START SERVER
const PORT = process.env.PORT || 5010;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
