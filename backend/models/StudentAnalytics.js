const mongoose = require('mongoose');

const StudentAnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  readinessScore: {
    type: Number,
    default: 0 // 0 to 100 %
  },
  conceptMastery: {
    type: Map,
    of: Number,
    default: {} // Key: Concept name, Value: 0 - 100 rating
  },
  practiceHistory: [{
    questionId: String,
    concept: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Expert']
    },
    correct: Boolean,
    thetaRating: Number, // IRT parameter theta
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  studySessions: [{
    durationMinutes: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  behaviorMetrics: {
    consistencyRating: {
      type: Number,
      default: 50 // 0 - 100
    },
    procrastinationRisk: {
      type: Number,
      default: 20 // 0 - 100
    },
    burnoutIndicator: {
      type: Number,
      default: 15 // 0 - 100
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentAnalytics', StudentAnalyticsSchema);
