const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR', 'Behavioral', 'Coding', 'Resume Based', 'Mixed'],
    default: 'Technical'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questionCount: {
    type: Number,
    default: 5
  },
  durationMinutes: {
    type: Number,
    default: 15
  },
  topics: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['configured', 'in_progress', 'completed'],
    default: 'in_progress'
  },
  resumeData: {
    fileName: String,
    parsedSkills: [String],
    detectedRoleMatch: String,
    projects: [String],
    experience: [String],
    skillGaps: [{
      skill: String,
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
      }
    }],
    roadmapRecommendations: [String]
  },
  questionsList: [{
    questionId: String,
    questionText: String,
    topic: String,
    difficulty: String,
    userAnswer: String,
    isFollowUp: {
      type: Boolean,
      default: false
    },
    followUpContext: String,
    evaluation: {
      technicalKnowledge: Number,
      relevance: Number,
      communication: Number,
      clarity: Number,
      completeness: Number,
      confidence: Number,
      score: Number
    },
    feedback: {
      whatWentWell: String,
      whatWasMissing: String,
      whatCouldBeImproved: String,
      suggestedAnswer: String,
      topicsToRevise: [String]
    }
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
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
      structureAndApproach: Number,
      problemSolving: Number,
      relevance: Number,
      clarity: Number,
      completeness: Number
    },
    actionableTips: [String]
  },
  finalReport: {
    overallScore: Number,
    categories: {
      technicalKnowledge: Number,
      communication: Number,
      problemSolving: Number,
      relevance: Number,
      clarity: Number,
      completeness: Number
    },
    strengths: [String],
    weakAreas: [String],
    recommendedPractice: [String]
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

