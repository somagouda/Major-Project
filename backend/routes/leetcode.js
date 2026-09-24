const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { auth, memAnalytics } = require('./auth');
const Problem = require('../models/Problem');
const ProblemSubmission = require('../models/ProblemSubmission');
const StudentAnalytics = require('../models/StudentAnalytics');
const { runCode } = require('../services/codeRunner');

const { buildFullDataset } = require('../seeders/fullQuestionDataset');

const CACHE_FILE = path.join(__dirname, '../leetcode_cache.json');
const memSubmissions = [];

// Dynamic 20+ Questions Per Subtopic Database (~2,700 total questions across all 7 subjects)
const problemDatabase = buildFullDataset();

// Helper to filter problems by metadata & exact subtopic hierarchy
const filterProblems = (reqQuery) => {
  const { 
    subject, 
    topicId, 
    subtopicId, 
    questionType, 
    difficulty, 
    searchQuery, 
    sourceType, 
    company, 
    year, 
    round, 
    recentlyAsked, 
    frequentlyReported 
  } = reqQuery;

  let list = [...problemDatabase];

  if (subject) {
    list = list.filter(p => p.subject.toUpperCase() === subject.toUpperCase());
  }
  if (subtopicId) {
    list = list.filter(p => p.subtopicId === subtopicId);
  } else if (topicId) {
    list = list.filter(p => p.topicId === topicId || (p.subtopicId && p.subtopicId.startsWith(topicId)));
  }

  if (questionType && questionType !== 'All') {
    list = list.filter(p => p.questionType === questionType);
  }
  if (difficulty && difficulty !== 'All') {
    list = list.filter(p => p.difficulty === difficulty);
  }
  if (sourceType && sourceType !== 'all') {
    list = list.filter(p => p.sourceType === sourceType);
  }
  if (company && company !== 'All') {
    list = list.filter(p => p.company === company || (p.companies && p.companies.includes(company)));
  }
  if (year && year !== 'All') {
    list = list.filter(p => p.year === parseInt(year, 10));
  }
  if (round && round !== 'All') {
    list = list.filter(p => p.round === round);
  }
  if (recentlyAsked === 'true' || recentlyAsked === true) {
    list = list.filter(p => p.sourceType === 'verified_interview_report' || p.sourceType === 'community_report');
  }
  if (frequentlyReported === 'true' || frequentlyReported === true) {
    list = list.filter(p => p.reportCount && p.reportCount > 1);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.slug.toLowerCase().includes(q) || 
      (p.company && p.company.toLowerCase().includes(q))
    );
  }

  // Sort by recentness (year desc) and report count
  list.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.reportCount || 0) - (a.reportCount || 0));

  return list;
};

// 1. GET /api/leetcode/problems (Search, Subtopic Filter & Paginated Problems)
router.get('/problems', auth, async (req, res) => {
  try {
    const list = filterProblems(req.query);

    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const paginatedList = list.slice(startIndex, startIndex + limit);
      return res.json({
        problems: paginatedList,
        total: list.length,
        totalPages: Math.ceil(list.length / limit),
        page: page
      });
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problems: ' + err.message });
  }
});

// 1b. GET /api/leetcode/subtopic-stats (Dynamic Subtopic & Filter Header Stats)
router.get('/subtopic-stats', auth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const matchingProblems = filterProblems(req.query);
    const problemIdSet = new Set(matchingProblems.map(p => p.id || p.problemId));

    let userSubmissions = [];
    if (isDbConnected) {
      userSubmissions = await ProblemSubmission.find({ user: req.user._id });
    } else {
      userSubmissions = memSubmissions.filter(s => s.user.toString() === req.user._id.toString());
    }

    const attemptedSet = new Set();
    const solvedSet = new Set();
    let totalAttempts = 0;

    userSubmissions.forEach(sub => {
      if (problemIdSet.has(sub.problemId)) {
        attemptedSet.add(sub.problemId);
        totalAttempts++;
        if (sub.status === 'Accepted') {
          solvedSet.add(sub.problemId);
        }
      }
    });

    const totalQuestions = matchingProblems.length;
    const attemptedCount = attemptedSet.size;
    const solvedCount = solvedSet.size;
    const accuracy = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;
    const mastery = totalQuestions > 0 ? Math.min(98, Math.round((solvedCount / totalQuestions) * 100 + (accuracy > 70 ? 15 : 0))) : 0;

    res.json({
      totalQuestions,
      solvedCount,
      attemptedCount,
      accuracy,
      mastery
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subtopic stats: ' + err.message });
  }
});

// 1c. GET /api/leetcode/random-problem (🎲 Random Practice respecting active filters)
router.get('/random-problem', auth, async (req, res) => {
  try {
    const pool = filterProblems(req.query);

    if (pool.length === 0) {
      return res.status(404).json({ message: 'No questions in pool matching current filters' });
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    res.json(pool[randomIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Error selecting random problem: ' + err.message });
  }
});

// 2. GET /api/leetcode/problems/:id (Problem Detail & Source Metadata)
router.get('/problems/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let problem = null;

    if (isDbConnected) {
      problem = await Problem.findOne({ problemId: id });
    }
    if (!problem) {
      problem = problemDatabase.find(p => p.id === id || p.problemId === id || p.slug === id);
    }

    if (!problem) {
      problem = {
        id,
        problemId: id,
        title: id.replace(/-/g, ' ').toUpperCase(),
        slug: id,
        subject: 'DSA',
        topicId: 'dsa-arrays-two-pointer',
        topicName: 'Data Structures',
        subtopicName: 'Arrays',
        difficulty: 'Medium',
        description: `Given an input sequence for problem ${id}, solve the algorithm efficiently using optimal runtime complexity.`,
        examples: [{ input: '[1, 2, 3]', output: '6', explanation: 'Calculated optimal result.' }],
        constraints: ['1 <= N <= 10^5'],
        supportedLanguages: ['JavaScript', 'Python', 'Java', 'C++'],
        starterCode: { JavaScript: `function solution(input) { return input; }` },
        sampleTestCases: [{ input: '[1, 2, 3]', expectedOutput: '6' }],
        hints: ['Hint 1: Consider time and space complexity trade-offs.'],
        sourceType: 'practice',
        company: 'Standard Practice',
        role: 'Practice Role',
        round: 'Practice Round',
        reportedDate: 'Standard Library',
        year: 2026,
        reportCount: 1,
        verified: true
      };
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem detail: ' + err.message });
  }
});

// 3. POST /api/leetcode/problems/:id/run (Run Code)
router.post('/problems/:id/run', auth, async (req, res) => {
  const { id } = req.params;
  const { language, code, testCases } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code parameter is required.' });
  }

  try {
    const targetProblem = problemDatabase.find(p => p.id === id || p.problemId === id) || {};
    const testList = testCases && testCases.length > 0 ? testCases : (targetProblem.sampleTestCases || [{ input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }]);

    const execResult = await runCode(language || 'JavaScript', code, testList);
    res.json(execResult);
  } catch (err) {
    res.status(500).json({ message: 'Code execution error: ' + err.message });
  }
});

// 4. POST /api/leetcode/problems/:id/submit (Submit Code & Update StudentAnalytics)
router.post('/problems/:id/submit', auth, async (req, res) => {
  const { id } = req.params;
  const { language, code, topicId } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code content is required.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let problem = problemDatabase.find(p => p.id === id || p.problemId === id) || {};

    const fullTestCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    if (fullTestCases.length === 0) {
      fullTestCases.push({ input: 'Sample Input', expectedOutput: 'Expected Match' });
    }

    const execResult = await runCode(language || 'JavaScript', code, fullTestCases);

    const lowerCode = code.toLowerCase();
    let timeComplexity = 'O(N)';
    let spaceComplexity = 'O(1)';
    let wrongAnswerExplanation = null;

    if (lowerCode.includes('for') && lowerCode.includes('while')) {
      timeComplexity = 'O(N²)';
    } else if (lowerCode.includes('binary') || lowerCode.includes('mid')) {
      timeComplexity = 'O(log N)';
    }

    if (lowerCode.includes('map') || lowerCode.includes('set') || lowerCode.includes('array')) {
      spaceComplexity = 'O(N)';
    }

    let whatWentWell = "Submitted solution passed structural checks and maintained clean syntax.";
    let problemsInApproach = "Consider boundary checking for empty inputs and memory bounds.";
    let betterApproach = "A Hash Map or Two Pointer approach offers optimal O(N) time complexity.";
    let optimizationSuggestions = [
      "Check space allocation when building dynamic arrays.",
      "Consider early return conditions to optimize runtime."
    ];

    if (execResult.status === 'Wrong Answer') {
      wrongAnswerExplanation = "Your logic produced an incorrect result for one or more test cases. Verify loop indices, boundary conditions, and handling of duplicate or negative elements.";
    } else if (execResult.status === 'Compilation Error') {
      wrongAnswerExplanation = execResult.log;
    }

    const aiFeedback = {
      whatWentWell,
      problemsInApproach,
      wrongAnswerExplanation,
      betterApproach,
      optimizationSuggestions
    };

    const targetTopicId = topicId || problem.topicId || 'dsa-arrays-two-pointer';
    const isAccepted = execResult.status === 'Accepted';

    // Update StudentAnalytics
    try {
      let analytics;
      const cleanConceptKey = problem.topicName || 'Data Structures';

      if (isDbConnected) {
        analytics = await StudentAnalytics.findOne({ user: req.user._id });
        if (analytics) {
          const prevMastery = analytics.conceptMastery.get(cleanConceptKey) || 40;
          const delta = isAccepted ? (problem.difficulty === 'Hard' ? 12 : problem.difficulty === 'Medium' ? 8 : 5) : -3;
          analytics.conceptMastery.set(cleanConceptKey, Math.min(Math.max(prevMastery + delta, 10), 98));
          analytics.practiceHistory.push({
            questionId: id,
            concept: cleanConceptKey,
            difficulty: problem.difficulty || 'Medium',
            correct: isAccepted,
            thetaRating: isAccepted ? 1.4 : 0.8,
            timestamp: new Date()
          });
          analytics.updatedAt = new Date();
          await analytics.save();
        }
      } else {
        analytics = memAnalytics[req.user._id];
        if (analytics && analytics.conceptMastery) {
          const prevMastery = analytics.conceptMastery.get(cleanConceptKey) || 40;
          const delta = isAccepted ? 8 : -3;
          analytics.conceptMastery.set(cleanConceptKey, Math.min(Math.max(prevMastery + delta, 10), 98));
          analytics.updatedAt = new Date();
        }
      }
    } catch (aErr) {
      console.warn('Analytics update warning:', aErr.message);
    }

    const submissionData = {
      user: req.user._id,
      problemId: id,
      topicId: targetTopicId,
      language: language || 'JavaScript',
      code,
      status: execResult.status,
      runtime: execResult.runtime,
      memory: execResult.memory,
      passedTestCases: execResult.passedTestCases,
      totalTestCases: execResult.totalTestCases,
      timeComplexity,
      spaceComplexity,
      aiFeedback,
      timestamp: new Date()
    };

    if (isDbConnected) {
      const dbSub = new ProblemSubmission(submissionData);
      await dbSub.save();
    } else {
      memSubmissions.push(submissionData);
    }

    res.json({
      status: execResult.status,
      log: execResult.log,
      passedTestCases: execResult.passedTestCases,
      totalTestCases: execResult.totalTestCases,
      runtime: execResult.runtime,
      memory: execResult.memory,
      timeComplexity,
      spaceComplexity,
      results: execResult.results,
      aiFeedback
    });
  } catch (err) {
    res.status(500).json({ message: 'Submission evaluation error: ' + err.message });
  }
});

// 5. POST /api/leetcode/problems/:id/hint (Progressive Hints)
router.post('/problems/:id/hint', auth, async (req, res) => {
  const { id } = req.params;
  const { hintIndex } = req.body;

  const problem = problemDatabase.find(p => p.id === id || p.problemId === id);
  const hints = problem ? problem.hints : [
    "Hint 1: Think about how you can reduce runtime complexity.",
    "Hint 2: Store visited values in a Hash Map.",
    "Hint 3: Use a two-pointer traversal technique."
  ];

  const idx = parseInt(hintIndex, 10) || 0;
  const hintText = hints[idx % hints.length] || hints[0];

  res.json({
    hintIndex: idx,
    totalHints: hints.length,
    hintText
  });
});

// 6. GET /api/leetcode/submissions/history (Submission History)
router.get('/submissions/history', auth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let list = [];

    if (isDbConnected) {
      list = await ProblemSubmission.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(20);
    } else {
      list = memSubmissions.filter(s => s.user.toString() === req.user._id.toString());
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions: ' + err.message });
  }
});

// Legacy LeetCode cache endpoint compatibility
router.get('/all', async (req, res) => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cachedData = fs.readFileSync(CACHE_FILE, 'utf8');
      return res.json(JSON.parse(cachedData));
    }
    res.json(problemDatabase);
  } catch (err) {
    res.json(problemDatabase);
  }
});

// Legacy LeetCode code review endpoint compatibility
router.post('/review', async (req, res) => {
  const { codeText, language } = req.body;
  const execResult = await runCode(language || 'JavaScript', codeText || '', [{ input: 'Sample', expectedOutput: 'Sample' }]);
  
  res.json({
    success: execResult.status === 'Accepted',
    log: execResult.log,
    metrics: {
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      passedTestCases: execResult.passedTestCases,
      totalTestCases: execResult.totalTestCases,
      runtime: execResult.runtime,
      memory: execResult.memory
    },
    results: execResult.results,
    suggestions: ["Code complies with standard syntax."]
  });
});

module.exports = router;
