const mongoose = require('mongoose');

const ProblemSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  topicId: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded'],
    required: true
  },
  runtime: {
    type: String,
    default: '0ms'
  },
  memory: {
    type: String,
    default: '0MB'
  },
  passedTestCases: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  timeComplexity: {
    type: String,
    default: 'O(N)'
  },
  spaceComplexity: {
    type: String,
    default: 'O(1)'
  },
  aiFeedback: {
    whatWentWell: String,
    problemsInApproach: String,
    wrongAnswerExplanation: String,
    betterApproach: String,
    optimizationSuggestions: [String]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProblemSubmission', ProblemSubmissionSchema);
