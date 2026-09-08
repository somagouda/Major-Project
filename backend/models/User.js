const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    enum: ['Software Development', 'AI/ML', 'DevOps', 'Cloud', 'Full Stack', 'None'],
    default: 'None'
  },
  isOnboarded: {
    type: Boolean,
    default: false
  },
  baselineScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
