const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, memAnalytics } = require('./auth');
const StudentAnalytics = require('../models/StudentAnalytics');

// Helper to calculate placement readiness probability based on mastery and behavioral records
const calculatePlacementReadiness = (conceptMastery, behaviorMetrics) => {
  // Mastery accounts for 70% of readiness
  let totalMastery = 0;
  let count = 0;
  conceptMastery.forEach((val) => {
    totalMastery += val;
    count++;
  });
  const avgMastery = count > 0 ? totalMastery / count : 0;

  // Behavior accounts for 30% of readiness
  // High consistency is positive. High procrastination & high burnout are negative.
  const consistency = behaviorMetrics.consistencyRating || 50;
  const procrastination = behaviorMetrics.procrastinationRisk || 0;
  const burnout = behaviorMetrics.burnoutIndicator || 0;
  
  const behavioralBonus = (consistency * 0.6) + ((100 - procrastination) * 0.2) + ((100 - burnout) * 0.2);

  const finalReadiness = Math.round((avgMastery * 0.7) + (behavioralBonus * 0.3));
  return Math.min(Math.max(finalReadiness, 0), 100);
};

// Get current user analytics summary
router.get('/summary', auth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let analytics;

    if (isDbConnected) {
      analytics = await StudentAnalytics.findOne({ user: req.user._id });
      if (!analytics) {
        // Safe creation fallback
        analytics = new StudentAnalytics({
          user: req.user._id,
          readinessScore: 30,
          conceptMastery: {
            'Data Structures': 30,
            'Algorithms': 25,
            'System Design': 20,
            'AI & Machine Learning': 15,
            'DevOps & Cloud': 15
          },
          behaviorMetrics: {
            consistencyRating: 50,
            procrastinationRisk: 20,
            burnoutIndicator: 15
          }
        });
        await analytics.save();
      }
    } else {
      analytics = memAnalytics[req.user._id];
      if (!analytics) {
        analytics = {
          user: req.user._id,
          readinessScore: 30,
          conceptMastery: new Map([
            ['Data Structures', 30],
            ['Algorithms', 25],
            ['System Design', 20],
            ['AI & Machine Learning', 15],
            ['DevOps & Cloud', 15]
          ]),
          practiceHistory: [],
          studySessions: [],
          behaviorMetrics: {
            consistencyRating: 50,
            procrastinationRisk: 20,
            burnoutIndicator: 15
          },
          updatedAt: new Date()
        };
        memAnalytics[req.user._id] = analytics;
      }
    }

    // Convert map to plain object if database model
    let plainMastery = {};
    if (isDbConnected) {
      plainMastery = Object.fromEntries(analytics.conceptMastery);
    } else {
      plainMastery = Object.fromEntries(analytics.conceptMastery);
    }

    res.json({
      readinessScore: analytics.readinessScore,
      conceptMastery: plainMastery,
      behaviorMetrics: analytics.behaviorMetrics,
      practiceHistory: analytics.practiceHistory || [],
      studySessions: analytics.studySessions || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server analytics fetch error: ' + err.message });
  }
});

// Post a practice engine result (affects IRT theta and updates concept mastery score)
router.post('/practice-log', auth, async (req, res) => {
  const { concept, difficulty, correct, thetaRating, questionId } = req.body;
  if (!concept || !difficulty || correct === undefined || thetaRating === undefined) {
    return res.status(400).json({ message: 'Missing fields for practice logging.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let analytics;

    if (isDbConnected) {
      analytics = await StudentAnalytics.findOne({ user: req.user._id });
    } else {
      analytics = memAnalytics[req.user._id];
    }

    if (!analytics) {
      return res.status(404).json({ message: 'Student analytics record not found.' });
    }

    // Update practice history
    const newLog = { questionId, concept, difficulty, correct, thetaRating, timestamp: new Date() };
    
    // Update concept mastery dynamically
    // Correct hard answers boost mastery quickly. Wrong answers subtract.
    let masteryChange = 0;
    const diffMultiplier = { 'Easy': 3, 'Medium': 6, 'Hard': 10, 'Expert': 15 };
    const mult = diffMultiplier[difficulty] || 5;

    if (correct) {
      masteryChange = mult;
    } else {
      masteryChange = -Math.round(mult * 0.4);
    }

    let currentMastery = 0;
    if (isDbConnected) {
      currentMastery = analytics.conceptMastery.get(concept) || 0;
      let newMastery = Math.min(Math.max(currentMastery + masteryChange, 0), 100);
      analytics.conceptMastery.set(concept, newMastery);
      analytics.practiceHistory.push(newLog);
      
      // Update consistency rating (more activity -> better consistency)
      const currentConsistency = analytics.behaviorMetrics.consistencyRating;
      analytics.behaviorMetrics.consistencyRating = Math.min(currentConsistency + 2, 100);
      
      // Reduce procrastination score on active submit
      const currentProc = analytics.behaviorMetrics.procrastinationRisk;
      analytics.behaviorMetrics.procrastinationRisk = Math.max(currentProc - 3, 0);

      // Recalculate readiness
      analytics.readinessScore = calculatePlacementReadiness(analytics.conceptMastery, analytics.behaviorMetrics);
      analytics.updatedAt = new Date();
      await analytics.save();
    } else {
      currentMastery = analytics.conceptMastery.get(concept) || 0;
      let newMastery = Math.min(Math.max(currentMastery + masteryChange, 0), 100);
      analytics.conceptMastery.set(concept, newMastery);
      analytics.practiceHistory.push(newLog);

      // Update consistency and procrastination
      analytics.behaviorMetrics.consistencyRating = Math.min(analytics.behaviorMetrics.consistencyRating + 2, 100);
      analytics.behaviorMetrics.procrastinationRisk = Math.max(analytics.behaviorMetrics.procrastinationRisk - 3, 0);

      // Recalculate readiness
      analytics.readinessScore = calculatePlacementReadiness(analytics.conceptMastery, analytics.behaviorMetrics);
      analytics.updatedAt = new Date();
    }

    res.json({
      message: 'Practice history and concept mastery updated.',
      newMastery: Math.min(Math.max(currentMastery + masteryChange, 0), 100),
      readinessScore: analytics.readinessScore,
      behaviorMetrics: analytics.behaviorMetrics
    });
  } catch (err) {
    res.status(500).json({ message: 'Server practice log error: ' + err.message });
  }
});

// Update behavioral metrics (e.g. log a study session, or direct adjustments of behavioral gauges)
router.post('/behavior-log', auth, async (req, res) => {
  const { studyDuration, procrastinationAdjustment, burnoutAdjustment } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let analytics;

    if (isDbConnected) {
      analytics = await StudentAnalytics.findOne({ user: req.user._id });
    } else {
      analytics = memAnalytics[req.user._id];
    }

    if (!analytics) {
      return res.status(404).json({ message: 'Student analytics record not found.' });
    }

    if (studyDuration) {
      analytics.studySessions.push({ durationMinutes: studyDuration, timestamp: new Date() });
      // Boost consistency
      analytics.behaviorMetrics.consistencyRating = Math.min((analytics.behaviorMetrics.consistencyRating || 50) + 5, 100);
    }

    if (procrastinationAdjustment !== undefined) {
      const current = analytics.behaviorMetrics.procrastinationRisk || 0;
      analytics.behaviorMetrics.procrastinationRisk = Math.min(Math.max(current + procrastinationAdjustment, 0), 100);
    }

    if (burnoutAdjustment !== undefined) {
      const current = analytics.behaviorMetrics.burnoutIndicator || 0;
      analytics.behaviorMetrics.burnoutIndicator = Math.min(Math.max(current + burnoutAdjustment, 0), 100);
    }

    // Recalculate readiness score
    analytics.readinessScore = calculatePlacementReadiness(analytics.conceptMastery, analytics.behaviorMetrics);
    
    if (isDbConnected) {
      analytics.updatedAt = new Date();
      await analytics.save();
    } else {
      analytics.updatedAt = new Date();
    }

    res.json({
      message: 'Behavioral metrics synced successfully.',
      behaviorMetrics: analytics.behaviorMetrics,
      readinessScore: analytics.readinessScore
    });
  } catch (err) {
    res.status(500).json({ message: 'Server behavior log error: ' + err.message });
  }
});

module.exports = router;
