const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { router: authRouter } = require('./routes/auth');
const analyticsRouter = require('./routes/analytics');
const interviewsRouter = require('./routes/interviews');
const leetcodeRouter = require('./routes/leetcode');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/leetcode', leetcodeRouter);

// Base routing
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'SAPPIP Core Engine API'
  });
});

// Port binding
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`SAPPIP backend bootstrapping...`);
  await connectDB();
  console.log(`SAPPIP server running on port: ${PORT}`);
  console.log(`==================================================`);
});
