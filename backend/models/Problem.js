const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['DSA', 'APTITUDE', 'OS', 'CN', 'DBMS', 'OOPS', 'Programming'],
    default: 'DSA'
  },
  topicId: {
    type: String,
    required: true // e.g. dsa-arrays
  },
  subtopicId: {
    type: String // e.g. dsa-arrays-two-pointer
  },
  topicName: {
    type: String
  },
  subtopicName: {
    type: String
  },
  questionType: {
    type: String,
    enum: ['MCQ', 'Coding', 'Output Prediction', 'Interview', 'Scenario', 'Numerical'],
    default: 'Coding'
  },
  options: [{
    label: String,
    text: String
  }],
  correctAnswer: {
    type: String
  },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: true
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  supportedLanguages: {
    type: [String],
    default: ['JavaScript', 'Python', 'Java', 'C++']
  },
  starterCode: {
    type: Map,
    of: String,
    default: {}
  },
  sampleTestCases: [{
    input: String,
    expectedOutput: String
  }],
  hiddenTestCases: [{
    input: String,
    expectedOutput: String
  }],
  hints: [String],
  solutionApproach: {
    bruteForce: {
      timeComplexity: String,
      spaceComplexity: String,
      explanation: String
    },
    optimal: {
      timeComplexity: String,
      spaceComplexity: String,
      explanation: String,
      code: String
    }
  },
  companies: [String],
  sourceType: {
    type: String,
    enum: ['official', 'verified_interview_report', 'community_report', 'practice', 'ai_generated'],
    default: 'practice'
  },
  sourceUrl: {
    type: String
  },
  company: {
    type: String
  },
  role: {
    type: String
  },
  round: {
    type: String
  },
  reportedDate: {
    type: String
  },
  year: {
    type: Number,
    default: 2026
  },
  canonicalProblemId: {
    type: String
  },
  reportCount: {
    type: Number,
    default: 1
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Problem', ProblemSchema);
