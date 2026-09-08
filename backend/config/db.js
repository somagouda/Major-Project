const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sappip';
  
  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout to fail fast
    });
    isConnected = true;
    console.log('MongoDB Connected Successfully.');
  } catch (err) {
    console.error(`MongoDB Connection Failed: ${err.message}`);
    console.warn('Backend is running in fallback MOCK-DATA mode (in-memory changes will not persist across restarts).');
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
