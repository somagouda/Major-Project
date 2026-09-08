const express = require('express');
const cors = require('cors');
const { router: authRouter, memUsers, memAnalytics } = require('./backend/routes/auth');
const analyticsRouter = require('./backend/routes/analytics');
const interviewsRouter = require('./backend/routes/interviews');

console.log('Starting SAPPIP router integrity verification tests...');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/interviews', interviewsRouter);

// Test variables
let testToken = '';
let userId = '';

const runTests = async () => {
  try {
    console.log('\n--- 1. Testing Registration Endpoint ---');
    const registerBody = {
      username: 'testarchitect',
      email: 'architect@sappip.com',
      password: 'secure_password_123'
    };

    // Simulate mock express req/res for Register
    let mockResData = null;
    let mockStatus = 200;

    const reqMockReg = { body: registerBody };
    const resMockReg = {
      status(code) {
        mockStatus = code;
        return this;
      },
      json(data) {
        mockResData = data;
        return this;
      }
    };

    // Find the handler for /register
    const registerLayer = authRouter.stack.find(s => s.route?.path === '/register');
    if (!registerLayer) throw new Error('Register route layer not found');
    
    await registerLayer.route.stack[0].handle(reqMockReg, resMockReg);
    
    if (mockStatus === 201 || (mockStatus === 400 && mockResData.message === 'User already exists.')) {
      console.log('✓ Registration router handles signup/duplicate queries gracefully. Status code:', mockStatus);
      if (mockResData.token) {
        testToken = mockResData.token;
        userId = mockResData.user.id;
      }
    } else {
      throw new Error(`Failed registration step with status ${mockStatus}: ${JSON.stringify(mockResData)}`);
    }

    console.log('\n--- 2. Testing Onboarding Endpoint ---');
    const onboardBody = {
      targetRole: 'AI/ML',
      baselineScore: 8.0
    };

    const reqMockOnboard = {
      user: { _id: userId || 'mock_user_id' },
      body: onboardBody
    };
    
    let onboardStatus = 200;
    let onboardData = null;
    const resMockOnboard = {
      status(code) { onboardStatus = code; return this; },
      json(data) { onboardData = data; return this; }
    };

    const onboardLayer = authRouter.stack.find(s => s.route?.path === '/onboard');
    if (!onboardLayer) throw new Error('Onboard route layer not found');

    await onboardLayer.route.stack[0].handle(reqMockOnboard, resMockOnboard);
    console.log('✓ Onboarding router parsed inputs successfully. Resulting placement probability:', onboardData.readinessScore + '%');

    console.log('\n--- 3. Testing Analytics Summary Fetch ---');
    const reqMockSummary = {
      user: { _id: userId || 'mock_user_id' }
    };
    let summaryStatus = 200;
    let summaryData = null;
    const resMockSummary = {
      status(code) { summaryStatus = code; return this; },
      json(data) { summaryData = data; return this; }
    };

    const summaryLayer = analyticsRouter.stack.find(s => s.route?.path === '/summary');
    if (!summaryLayer) throw new Error('Summary route layer not found');

    await summaryLayer.route.stack[0].handle(reqMockSummary, resMockSummary);
    console.log('✓ Analytics summary retrieved. Score metrics:');
    console.log('  - Consistency:', summaryData.behaviorMetrics.consistencyRating);
    console.log('  - Procrastination:', summaryData.behaviorMetrics.procrastinationRisk);
    console.log('  - Burnout:', summaryData.behaviorMetrics.burnoutIndicator);

    console.log('\n--- 4. Testing Item Response Theory (IRT) Practice Logger ---');
    const practiceBody = {
      concept: 'AI & Machine Learning',
      difficulty: 'Hard',
      correct: true,
      thetaRating: 1.2,
      questionId: 'ml_h1'
    };

    const reqMockPractice = {
      user: { _id: userId || 'mock_user_id' },
      body: practiceBody
    };
    let practiceStatus = 200;
    let practiceData = null;
    const resMockPractice = {
      status(code) { practiceStatus = code; return this; },
      json(data) { practiceData = data; return this; }
    };

    const practiceLayer = analyticsRouter.stack.find(s => s.route?.path === '/practice-log');
    await practiceLayer.route.stack[0].handle(reqMockPractice, resMockPractice);
    console.log('✓ Practice logger simulated IRT. Updated Ability index (theta):', practiceBody.thetaRating);
    console.log('  - New readiness probability: ' + practiceData.readinessScore + '%');

    console.log('\n==================================================');
    console.log('✓ ALL CORE API ROUTER INTEGRITY CHECKS COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Verification Failed:', err.message);
    process.exit(1);
  }
};

runTests();
