require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./controllers/auth');
const lessonRoutes = require('./controllers/lessons');
const progressRoutes = require('./controllers/progress');
const syncRoutes = require('./controllers/sync');
const notifRoutes = require('./controllers/notifications');
const { errorHandler } = require('./middlewares/errorHandler');
const quizRoutes = require('./controllers/quiz');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Connect DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => { console.error(err); process.exit(1); });

// Routes

app.use('/api/quiz', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notifications', notifRoutes);

app.get('/', (req,res) => res.send('Gamified Learning Backend'));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server running on ${port}`));
