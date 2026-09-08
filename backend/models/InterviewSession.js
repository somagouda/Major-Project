const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR'],
    default: 'Technical'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  resumeData: {
    fileName: String,
    parsedSkills: [String],
    detectedRoleMatch: String,
    skillGaps: [{
      skill: String,
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
      }
    }],
    roadmapRecommendations: [String]
  },
  chatHistory: [{
    sender: {
      type: String,
      enum: ['AI', 'Candidate']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    overallScore: Number, // 0 - 100
    whyDidIFail: String, // Exhaustive feedback
    categories: {
      technicalAccuracy: Number,
      communication: Number,
      structureAndApproach: Number
    },
    actionableTips: [String]
  },
  proctorLogs: [{
    type: {
      type: String
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  integrityScore: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
