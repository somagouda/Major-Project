const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentAnalytics = require('../models/StudentAnalytics');

const JWT_SECRET = process.env.JWT_SECRET || 'sappip_secret_key_12345';

// Memory fallback databases
const memUsers = [];
const memAnalytics = {};

// JWT Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authorization token, access denied.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) req.user = { _id: decoded.id, username: 'Candidate', email: 'candidate@example.com' };
      else req.user = user;
    } else {
      const user = memUsers.find(u => u._id && u._id.toString() === decoded.id);
      req.user = user || { _id: decoded.id || 'guest_123', username: 'Candidate', email: 'candidate@example.com' };
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied.' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    
    // Check user existence
    let userExists = false;
    if (isDbConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) userExists = true;
    } else {
      userExists = memUsers.some(u => u.email === email.toLowerCase());
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (isDbConnected) {
      const dbUser = new User({
        username,
        email,
        password: hashedPassword
      });
      newUser = await dbUser.save();
      
      // Initialize analytics schema
      const dbAnalytics = new StudentAnalytics({
        user: newUser._id,
        readinessScore: 0,
        conceptMastery: {
          'Data Structures': 0,
          'Algorithms': 0,
          'System Design': 0,
          'AI & Machine Learning': 0,
          'DevOps & Cloud': 0
        },
        behaviorMetrics: {
          consistencyRating: 50,
          procrastinationRisk: 10,
          burnoutIndicator: 10
        }
      });
      await dbAnalytics.save();
    } else {
      newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        targetRole: 'None',
        isOnboarded: false,
        baselineScore: 0,
        createdAt: new Date()
      };
      memUsers.push(newUser);
      
      memAnalytics[newUser._id] = {
        user: newUser._id,
        readinessScore: 0,
        conceptMastery: new Map([
          ['Data Structures', 0],
          ['Algorithms', 0],
          ['System Design', 0],
          ['AI & Machine Learning', 0],
          ['DevOps & Cloud', 0]
        ]),
        practiceHistory: [],
        studySessions: [],
        behaviorMetrics: {
          consistencyRating: 50,
          procrastinationRisk: 10,
          burnoutIndicator: 10
        },
        updatedAt: new Date()
      };
    }

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      targetRole: newUser.targetRole,
      isOnboarded: newUser.isOnboarded,
      baselineScore: newUser.baselineScore
    };
    
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server registration error: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let user;

    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = memUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      targetRole: user.targetRole,
      isOnboarded: user.isOnboarded,
      baselineScore: user.baselineScore
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server login error: ' + err.message });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    targetRole: user.targetRole,
    isOnboarded: user.isOnboarded,
    baselineScore: user.baselineScore
  });
});

// Onboarding Details Submissions
router.post('/onboard', auth, async (req, res) => {
  const { targetRole, baselineScore } = req.body;
  if (!targetRole || baselineScore === undefined) {
    return res.status(400).json({ message: 'Missing targetRole or baselineScore.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let updatedUser;

    // Calculate initial placement readiness probability based on baseline
    const readinessScore = Math.min(Math.max(Math.round(baselineScore * 10), 0), 100);

    if (isDbConnected) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { targetRole, baselineScore, isOnboarded: true },
        { new: true }
      );
      
      // Sync analytics data
      await StudentAnalytics.findOneAndUpdate(
        { user: req.user._id },
        { 
          readinessScore,
          $set: {
            'conceptMastery.Data Structures': Math.round(baselineScore * 8),
            'conceptMastery.Algorithms': Math.round(baselineScore * 7),
            'conceptMastery.System Design': Math.round(baselineScore * 6),
            'conceptMastery.AI & Machine Learning': Math.round(baselineScore * 5),
            'conceptMastery.DevOps & Cloud': Math.round(baselineScore * 5)
          }
        }
      );
    } else {
      const idx = memUsers.findIndex(u => u._id.toString() === req.user._id.toString());
      if (idx !== -1) {
        memUsers[idx].targetRole = targetRole;
        memUsers[idx].baselineScore = baselineScore;
        memUsers[idx].isOnboarded = true;
        updatedUser = memUsers[idx];
      }

      if (memAnalytics[req.user._id]) {
        memAnalytics[req.user._id].readinessScore = readinessScore;
        const mastery = memAnalytics[req.user._id].conceptMastery;
        mastery.set('Data Structures', Math.round(baselineScore * 8));
        mastery.set('Algorithms', Math.round(baselineScore * 7));
        mastery.set('System Design', Math.round(baselineScore * 6));
        mastery.set('AI & Machine Learning', Math.round(baselineScore * 5));
        mastery.set('DevOps & Cloud', Math.round(baselineScore * 5));
      }
    }

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      targetRole: updatedUser.targetRole,
      isOnboarded: updatedUser.isOnboarded,
      baselineScore: updatedUser.baselineScore,
      readinessScore
    });
  } catch (err) {
    res.status(500).json({ message: 'Server onboarding error: ' + err.message });
  }
});

module.exports = { router, auth, memUsers, memAnalytics };
