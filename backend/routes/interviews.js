const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const { auth, memAnalytics } = require('./auth');
const InterviewSession = require('../models/InterviewSession');
const StudentAnalytics = require('../models/StudentAnalytics');

const upload = multer({ limits: { fileSize: 5000000 } }); // Limit 5MB files

const memSessions = [];

// Comprehensive Question Bank by Topic & Track
const questionBank = {
  Java: [
    { text: "Explain the memory management model in Java, focusing on Heap, Stack, and Garbage Collection algorithms (G1, ZGC).", topic: "Java", difficulty: "Medium" },
    { text: "What is the difference between fail-fast and fail-safe iterators in Concurrent Collections?", topic: "Java", difficulty: "Hard" },
    { text: "How does the synchronized keyword differ from ReentrantLock in terms of concurrency control?", topic: "Java", difficulty: "Medium" },
    { text: "Explain Java Streams API and how parallel Streams achieve internal concurrency.", topic: "Java", difficulty: "Easy" }
  ],
  Python: [
    { text: "How does Python handle memory management using reference counting and generational garbage collection?", topic: "Python", difficulty: "Medium" },
    { text: "Explain the Global Interpreter Lock (GIL) in Python and its impact on multi-threaded CPU-bound programs.", topic: "Python", difficulty: "Hard" },
    { text: "What are decorators, context managers, and generator expressions in Python?", topic: "Python", difficulty: "Easy" },
    { text: "Compare list comprehension vs generator expressions in terms of memory efficiency.", topic: "Python", difficulty: "Easy" }
  ],
  "C++": [
    { text: "Explain RAII (Resource Acquisition Is Initialization) and smart pointers (unique_ptr, shared_ptr, weak_ptr) in C++.", topic: "C++", difficulty: "Medium" },
    { text: "What is virtual table (vtable) mechanism in C++ for runtime polymorphism?", topic: "C++", difficulty: "Hard" },
    { text: "Explain move semantics, rvalue references (&&), and std::move in modern C++11.", topic: "C++", difficulty: "Medium" }
  ],
  JavaScript: [
    { text: "Explain Event Loop, Microtask Queue, and Macrotask Queue execution order in JavaScript.", topic: "JavaScript", difficulty: "Medium" },
    { text: "How do closures work in JavaScript, and what are common memory leak scenarios?", topic: "JavaScript", difficulty: "Easy" },
    { text: "Compare Promises, Async/Await, and Callbacks regarding error handling and event loops.", topic: "JavaScript", difficulty: "Easy" }
  ],
  DSA: [
    { text: "How would you detect a cycle in a Directed Graph vs an Undirected Graph?", topic: "DSA", difficulty: "Hard" },
    { text: "Explain the time and space complexity trade-offs between QuickSort, MergeSort, and HeapSort.", topic: "DSA", difficulty: "Medium" },
    { text: "How do Trie (Prefix Tree) data structures optimize autocomplete and dictionary lookup queries?", topic: "DSA", difficulty: "Medium" }
  ],
  OOP: [
    { text: "Explain SOLID design principles with concrete code examples.", topic: "OOP", difficulty: "Medium" },
    { text: "What is the difference between Composition and Inheritance? Why is Composition preferred?", topic: "OOP", difficulty: "Medium" },
    { text: "Explain Factory, Singleton, and Observer design patterns and when to use them.", topic: "OOP", difficulty: "Easy" }
  ],
  DBMS: [
    { text: "Explain ACID properties in relational databases and how isolation levels (Read Committed, Repeatable Read, Serializable) impact concurrency.", topic: "DBMS", difficulty: "Hard" },
    { text: "Compare B-Tree indexes with Hash indexes in database storage engines.", topic: "DBMS", difficulty: "Medium" },
    { text: "What is database normalization (1NF, 2NF, 3NF, BCNF) and when is denormalization justified?", topic: "DBMS", difficulty: "Medium" }
  ],
  SQL: [
    { text: "Write and explain a complex query involving INNER JOIN, LEFT JOIN, GROUP BY, HAVING, and window functions (ROW_NUMBER, DENSE_RANK).", topic: "SQL", difficulty: "Medium" },
    { text: "How do database execution plans help diagnose slow queries and missing indexes?", topic: "SQL", difficulty: "Hard" },
    { text: "Explain database transactions, SAVEPOINTs, and pessimistic vs optimistic locking.", topic: "SQL", difficulty: "Medium" }
  ],
  "Operating Systems": [
    { text: "Explain Process vs Thread, context switching overhead, and inter-process communication (IPC) methods.", topic: "Operating Systems", difficulty: "Medium" },
    { text: "What is Deadlock? Explain the 4 necessary conditions and Banker's algorithm for deadlock avoidance.", topic: "Operating Systems", difficulty: "Hard" },
    { text: "How does Virtual Memory with Page Faults and LRU Page Replacement work in OS kernel?", topic: "Operating Systems", difficulty: "Medium" }
  ],
  "Computer Networks": [
    { text: "Explain the TCP 3-way handshake, 4-way teardown, and flow control (Sliding Window & Congestion Control).", topic: "Computer Networks", difficulty: "Medium" },
    { text: "What happens when you type a URL in browser? Detail DNS, TCP, TLS handshake, HTTP request/response.", topic: "Computer Networks", difficulty: "Hard" },
    { text: "Compare HTTP/1.1 vs HTTP/2 (Multiplexing) vs HTTP/3 (QUIC/UDP).", topic: "Computer Networks", difficulty: "Medium" }
  ],
  "Computer Architecture": [
    { text: "Explain CPU Instruction Pipelining, Data Hazards, Control Hazards, and Branch Prediction.", topic: "Computer Architecture", difficulty: "Hard" },
    { text: "How does Cache Hierarchy (L1, L2, L3) and Cache Coherence (MESI Protocol) function in multi-core processors?", topic: "Computer Architecture", difficulty: "Hard" }
  ],
  "Web Development": [
    { text: "Explain CORS (Cross-Origin Resource Sharing), Preflight requests, and how to secure REST APIs against XSS and CSRF attacks.", topic: "Web Development", difficulty: "Medium" },
    { text: "Compare Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR).", topic: "Web Development", difficulty: "Easy" },
    { text: "How do WebSockets differ from HTTP Long Polling for real-time bi-directional streaming?", topic: "Web Development", difficulty: "Medium" }
  ],
  HR: [
    { text: "Tell me about yourself, your background, and why you are interested in this position.", topic: "HR", difficulty: "Easy" },
    { text: "Tell me about a time you faced a difficult conflict within a engineering team. How did you handle it?", topic: "HR", difficulty: "Medium" },
    { text: "Where do you see yourself in 5 years, and how does this target role align with your career goals?", topic: "HR", difficulty: "Easy" }
  ],
  Behavioral: [
    { text: "Describe a situation where you had to work under severe pressure to meet a critical deadline.", topic: "Behavioral", difficulty: "Medium" },
    { text: "Give an example of a technical initiative you took that failed. What did you learn and how did you adapt?", topic: "Behavioral", difficulty: "Medium" },
    { text: "Describe how you prioritize competing tasks when multiple stakeholders demand urgent delivery.", topic: "Behavioral", difficulty: "Easy" }
  ],
  Coding: [
    { text: "Implement a function to find the Longest Substring Without Repeating Characters. Discuss time and space complexity.", topic: "Coding", difficulty: "Medium" },
    { text: "Given an array of integers, find two numbers such that they add up to a target sum. Optimize for O(N) runtime.", topic: "Coding", difficulty: "Easy" },
    { text: "Implement LRU Cache (Least Recently Used) with O(1) get and put operations.", topic: "Coding", difficulty: "Hard" }
  ]
};

// Templates for role gaps and recommendations
const roleTemplates = {
  'Software Development': {
    parsedSkills: ['Java', 'Python', 'Git', 'Data Structures', 'SQL'],
    detectedRoleMatch: 'Software Development - Product Based (82% Match)',
    projects: ['Distributed Task Scheduler', 'Real-time Chat App'],
    skillGaps: [
      { skill: 'Low-Level & High-Level System Design (HLD/LLD)', priority: 'High' },
      { skill: 'Distributed Caching (Redis/Memcached)', priority: 'Medium' }
    ],
    roadmapRecommendations: [
      'Learn SOLID Design principles and design patterns (Singleton, Factory, Observer).',
      'Solve system design problems on Scalability, Load Balancers, and Database Sharding.'
    ]
  },
  'Full Stack': {
    parsedSkills: ['ReactJS', 'NodeJS', 'Express', 'JavaScript', 'MongoDB'],
    detectedRoleMatch: 'Full Stack Web Developer (85% Match)',
    projects: ['E-Commerce Portal', 'Task Management Dashboard'],
    skillGaps: [
      { skill: 'Next.js Server Side Rendering (SSR) & Static Site Gen', priority: 'High' },
      { skill: 'Web Security vulnerabilities (CORS, CSRF, XSS protection)', priority: 'High' }
    ],
    roadmapRecommendations: [
      'Convert a standard React app into Next.js App Router.',
      'Implement custom security middleware to sanitize inputs.'
    ]
  }
};

// Question Generator Helper based on Track, Topics, and Difficulty
function generateQuestionsForTrack({ type, difficulty, questionCount, topics, resumeData }) {
  const count = Math.min(Math.max(questionCount || 5, 1), 15);
  let pool = [];

  if (type === 'HR') {
    pool = [...questionBank.HR];
  } else if (type === 'Behavioral') {
    pool = [...questionBank.Behavioral];
  } else if (type === 'Coding') {
    pool = [...questionBank.Coding];
  } else if (type === 'Resume Based') {
    if (resumeData && (resumeData.parsedSkills?.length || resumeData.projects?.length)) {
      const skills = resumeData.parsedSkills || ['React', 'Node.js', 'MongoDB'];
      const projects = resumeData.projects || ['E-commerce Web Application'];
      pool = [
        { text: `Your resume highlights experience with ${skills.slice(0, 3).join(', ')}. Can you detail a challenging architecture decision you made using these technologies?`, topic: "Resume Based", difficulty: "Medium" },
        { text: `Tell me about the design and implementation of your project: ${projects[0] || 'your key project'}. What were the key technical hurdles?`, topic: "Resume Based", difficulty: "Medium" },
        { text: `How did you ensure security, performance, and database scalability in ${projects[0] || 'your primary application'}?`, topic: "Resume Based", difficulty: "Hard" },
        { text: `Why did you select ${skills[0] || 'your primary tech stack'} over competing alternatives for your project implementation?`, topic: "Resume Based", difficulty: "Easy" }
      ];
    } else {
      pool = [
        { text: "Walk me through your primary project listed on your resume. What was your personal contribution and architectural design?", topic: "Resume Based", difficulty: "Medium" },
        { text: "Tell me about a technical challenge you resolved in a past project or internship.", topic: "Resume Based", difficulty: "Medium" }
      ];
    }
  } else if (type === 'Mixed') {
    pool = [...questionBank.DSA, ...questionBank.DBMS, ...questionBank.HR, ...questionBank.OOP, ...questionBank.Behavioral];
  } else {
    // Technical
    const selectedTopics = (topics && topics.length > 0) ? topics : ['Java', 'DSA', 'DBMS', 'SQL', 'Web Development'];
    selectedTopics.forEach(top => {
      if (questionBank[top]) {
        pool.push(...questionBank[top]);
      }
    });
    if (pool.length === 0) {
      pool = [...questionBank.DSA, ...questionBank.DBMS, ...questionBank.Java, ...questionBank['Web Development']];
    }
  }

  // Filter or fallbacks to fill count
  const list = [];
  for (let i = 0; i < count; i++) {
    const qItem = pool[i % pool.length];
    list.push({
      questionId: `q_${Date.now()}_${i + 1}`,
      questionText: qItem.text,
      topic: qItem.topic || type,
      difficulty: qItem.difficulty || difficulty || 'Medium',
      userAnswer: '',
      isFollowUp: false,
      evaluation: null,
      feedback: null
    });
  }
  return list;
}

// Evaluation Engine for submitted answer
function evaluateAnswer(questionText, userAnswer, type) {
  const answerStr = (userAnswer || '').trim();
  const wordCount = answerStr.split(/\s+/).filter(Boolean).length;
  const lower = answerStr.toLowerCase();

  let tech = 65;
  let relevance = 70;
  let comm = 65;
  let clarity = 70;
  let completeness = 65;
  let confidence = 75;

  if (wordCount < 10) {
    tech -= 25; relevance -= 20; comm -= 30; clarity -= 20; completeness -= 35; confidence -= 30;
  } else if (wordCount > 40) {
    comm += 15; completeness += 20; clarity += 10;
  }

  // Topic keywords bonus
  if (lower.includes('complexity') || lower.includes('o(n') || lower.includes('index') || lower.includes('cache') || lower.includes('star') || lower.includes('architecture') || lower.includes('async') || lower.includes('mutex') || lower.includes('solid') || lower.includes('acid')) {
    tech += 15;
    relevance += 15;
    confidence += 10;
  }

  tech = Math.min(Math.max(tech, 30), 98);
  relevance = Math.min(Math.max(relevance, 35), 98);
  comm = Math.min(Math.max(comm, 30), 98);
  clarity = Math.min(Math.max(clarity, 35), 98);
  completeness = Math.min(Math.max(completeness, 25), 98);
  confidence = Math.min(Math.max(confidence, 30), 98);

  const score = Math.round((tech + relevance + comm + clarity + completeness + confidence) / 6);

  let whatWentWell = "Good core structure and relevant terminology used in the explanation.";
  let whatWasMissing = "Could elaborate further on trade-offs, edge cases, or performance metrics.";
  let whatCouldBeImproved = "Try providing a clear 3-part response: high-level concept, technical implementation, and real-world example.";
  let suggestedAnswer = `A strong response should clearly state: "1. Definition & Core Principle, 2. Technical implementation details, 3. Trade-offs or performance impact (e.g. O(N) complexity or resource budgets)."`;
  let topicsToRevise = ["Core Fundamentals", "System Trade-offs"];

  if (score >= 80) {
    whatWentWell = "Excellent comprehensive breakdown with strong technical depth and clear articulation.";
    whatWasMissing = "Minor mention of high-scale cost considerations.";
    whatCouldBeImproved = "Incorporate quantifiable benchmarks or metrics from past projects.";
  } else if (score < 60) {
    whatWentWell = "Identified the primary topic concept.";
    whatWasMissing = "Lacked technical details, missing concrete examples, and incomplete explanation.";
    whatCouldBeImproved = "Study the fundamental theory and structure your answer using clear bullet points or the STAR method.";
  }

  return {
    evaluation: { technicalKnowledge: tech, relevance, communication: comm, clarity, completeness, confidence, score },
    feedback: { whatWentWell, whatWasMissing, whatCouldBeImproved, suggestedAnswer, topicsToRevise }
  };
}

// Generate Dynamic Follow-up Question based on candidate's answer keywords
function generateDynamicFollowUp(userAnswer, topic) {
  const text = (userAnswer || '').toLowerCase();
  
  if (text.includes('react') || text.includes('frontend') || text.includes('view')) {
    return "You mentioned React. How did you manage global state (e.g., Redux, Context API, Zustand) and prevent unnecessary component re-renders?";
  }
  if (text.includes('mongodb') || text.includes('nosql') || text.includes('database')) {
    return "Since you utilized MongoDB, why did you choose document-based storage over a relational SQL database? How did you handle schema validation?";
  }
  if (text.includes('cache') || text.includes('redis') || text.includes('memory')) {
    return "Regarding the caching strategy you noted, how do you handle cache stampedes and cache invalidation when data updates frequently under heavy traffic?";
  }
  if (text.includes('auth') || text.includes('jwt') || text.includes('token') || text.includes('security')) {
    return "How did you handle token refresh mechanisms and prevent Cross-Site Scripting (XSS) or CSRF attacks during user authentication?";
  }
  if (text.includes('conflict') || text.includes('team') || text.includes('teammate')) {
    return "That's an interesting approach to team dynamic. How did your teammate react to your suggested resolution, and what concrete compromise was achieved?";
  }
  
  return `Building on your response regarding ${topic || 'system design'}, what specific edge cases or failure scenarios did you test for?`;
}

// 1. Upload resume (parser mock API)
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  const fileName = req.file ? req.file.originalname : 'resume_file.pdf';
  const rawRole = req.body.targetRole || req.user.targetRole || 'Software Development';
  
  setTimeout(() => {
    let role = rawRole;
    if (rawRole.includes('Full Stack')) role = 'Full Stack';
    const template = roleTemplates[role] || roleTemplates['Software Development'];
    
    const parsedData = {
      fileName,
      parsedSkills: template.parsedSkills,
      detectedRoleMatch: template.detectedRoleMatch || rawRole,
      projects: template.projects || ['Full Stack Dashboard'],
      skillGaps: template.skillGaps,
      roadmapRecommendations: template.roadmapRecommendations
    };

    res.json(parsedData);
  }, 800);
});

// 2. Start Interview Session (POST /start & POST /session)
const handleStartInterview = async (req, res) => {
  const { type, difficulty, questionCount, durationMinutes, topics, resumeData } = req.body;
  const userTrack = type || 'Technical';
  const userDiff = difficulty || 'Medium';
  const qCount = parseInt(questionCount, 10) || 5;
  const dur = parseInt(durationMinutes, 10) || 15;
  const selectedTopics = topics || ['Java', 'DSA', 'DBMS', 'SQL'];

  const questionsList = generateQuestionsForTrack({
    type: userTrack,
    difficulty: userDiff,
    questionCount: qCount,
    topics: selectedTopics,
    resumeData
  });

  const firstQuestionText = questionsList[0] ? questionsList[0].questionText : "Tell me about yourself and your technical background.";

  const newSessionData = {
    user: req.user._id,
    type: userTrack,
    difficulty: userDiff,
    questionCount: qCount,
    durationMinutes: dur,
    topics: selectedTopics,
    resumeData: resumeData || null,
    status: 'in_progress',
    questionsList,
    currentQuestionIndex: 0,
    chatHistory: [{
      sender: 'AI',
      message: firstQuestionText,
      timestamp: new Date()
    }],
    createdAt: new Date()
  };

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      const dbSession = new InterviewSession(newSessionData);
      session = await dbSession.save();
    } else {
      session = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...newSessionData
      };
      memSessions.push(session);
    }

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server interview start error: ' + err.message });
  }
};

router.post('/start', auth, handleStartInterview);
router.post('/session', auth, handleStartInterview);

// 3. Get Interview History (GET /history)
router.get('/history', auth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let history = [];

    if (isDbConnected) {
      history = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      history = memSessions.filter(s => s.user.toString() === req.user._id.toString());
    }

    // Calculate overall statistics
    const completed = history.filter(h => h.status === 'completed');
    const totalCount = completed.length;
    let avgScore = 0;
    let bestScore = 0;

    if (totalCount > 0) {
      const scores = completed.map(c => (c.finalReport?.overallScore || c.feedback?.overallScore || 70));
      avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalCount);
      bestScore = Math.max(...scores);
    }

    res.json({
      history,
      stats: {
        totalCompleted: totalCount,
        averageScore: avgScore,
        bestScore,
        recentImprovement: totalCount > 1 ? '+12%' : 'Baseline set'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history: ' + err.message });
  }
});

// 4. Submit Question Answer (POST /:id/answer & POST /session/:id/respond)
const handleAnswerQuestion = async (req, res) => {
  const { id } = req.params;
  const { message, answer } = req.body;
  const userAnswerText = answer || message;

  if (!userAnswerText) {
    return res.status(400).json({ message: 'Answer string is required.' });
  }

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      session = await InterviewSession.findById(id);
    } else {
      session = memSessions.find(s => s._id.toString() === id);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Session is already completed.' });
    }

    // Add candidate chat message
    session.chatHistory.push({
      sender: 'Candidate',
      message: userAnswerText,
      timestamp: new Date()
    });

    const currentIndex = session.currentQuestionIndex || 0;
    let currentQuestion = session.questionsList && session.questionsList[currentIndex];

    if (!currentQuestion) {
      currentQuestion = {
        questionId: `q_${Date.now()}`,
        questionText: "Question",
        topic: session.type,
        difficulty: session.difficulty,
        userAnswer: userAnswerText
      };
      if (!session.questionsList) session.questionsList = [];
      session.questionsList.push(currentQuestion);
    }

    // Evaluate answer
    currentQuestion.userAnswer = userAnswerText;
    const { evaluation, feedback } = evaluateAnswer(currentQuestion.questionText, userAnswerText, session.type);
    currentQuestion.evaluation = evaluation;
    currentQuestion.feedback = feedback;

    // Check if we should insert a dynamic follow-up question
    let followUpCreated = false;
    let nextQuestion = null;

    if (!currentQuestion.isFollowUp && (currentIndex + 1 < session.questionCount)) {
      const followUpText = generateDynamicFollowUp(userAnswerText, currentQuestion.topic);
      const followUpObj = {
        questionId: `followup_${Date.now()}`,
        questionText: followUpText,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        userAnswer: '',
        isFollowUp: true,
        followUpContext: `Follow-up on previous answer regarding ${currentQuestion.topic}`,
        evaluation: null,
        feedback: null
      };

      // Insert follow up right after current question
      session.questionsList.splice(currentIndex + 1, 0, followUpObj);
      followUpCreated = true;
    }

    // Advance question index
    session.currentQuestionIndex = currentIndex + 1;
    const isCompleted = session.currentQuestionIndex >= session.questionsList.length;

    let aiNextMessage = "";
    if (isCompleted) {
      aiNextMessage = "Thank you! You have completed all questions in this session. Please click 'View Final Report' to see your comprehensive breakdown.";
    } else {
      nextQuestion = session.questionsList[session.currentQuestionIndex];
      aiNextMessage = nextQuestion.questionText;
    }

    session.chatHistory.push({
      sender: 'AI',
      message: aiNextMessage,
      timestamp: new Date()
    });

    if (isDbConnected) {
      await session.save();
    }

    res.json({
      evaluatedQuestion: currentQuestion,
      nextQuestion: isCompleted ? null : session.questionsList[session.currentQuestionIndex],
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.questionsList.length,
      isCompleted,
      chatHistory: session.chatHistory,
      status: session.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Answer evaluation error: ' + err.message });
  }
};

router.post('/:id/answer', auth, handleAnswerQuestion);
router.post('/session/:id/respond', auth, handleAnswerQuestion);

// 5. Complete Interview & Compile Final Report (POST /:id/complete & POST /session/:id/complete)
const handleCompleteInterview = async (req, res) => {
  const { id } = req.params;
  const { proctorLogs, integrityScore } = req.body || {};

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      session = await InterviewSession.findById(id);
    } else {
      session = memSessions.find(s => s._id.toString() === id);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    session.status = 'completed';
    session.proctorLogs = proctorLogs || [];
    session.integrityScore = integrityScore !== undefined ? integrityScore : 100;

    // Aggregate category scores across evaluated questions
    const evalList = (session.questionsList || [])
      .map(q => q.evaluation)
      .filter(Boolean);

    let tech = 70, comm = 70, prob = 72, rel = 75, clar = 70, comp = 68;

    if (evalList.length > 0) {
      tech = Math.round(evalList.reduce((acc, e) => acc + (e.technicalKnowledge || 70), 0) / evalList.length);
      comm = Math.round(evalList.reduce((acc, e) => acc + (e.communication || 70), 0) / evalList.length);
      rel = Math.round(evalList.reduce((acc, e) => acc + (e.relevance || 70), 0) / evalList.length);
      clar = Math.round(evalList.reduce((acc, e) => acc + (e.clarity || 70), 0) / evalList.length);
      comp = Math.round(evalList.reduce((acc, e) => acc + (e.completeness || 70), 0) / evalList.length);
      prob = Math.round((tech + comp) / 2);
    }

    let overallScore = Math.round((tech + comm + prob + rel + clar + comp) / 6);

    // Apply proctor penalty if integrity violations logged
    if (session.integrityScore < 85) {
      const penalty = Math.round((100 - session.integrityScore) * 0.4);
      tech = Math.max(30, tech - penalty);
      comm = Math.max(30, comm - penalty);
      overallScore = Math.round((tech + comm + prob + rel + clar + comp) / 6);
    }

    // Determine Strengths, Weak Areas, and Recommended Practice
    const strengths = [];
    const weakAreas = [];
    const recommendedPractice = [];

    if (tech >= 75) strengths.push("Strong core technical knowledge and language syntax.");
    else {
      weakAreas.push("Technical Knowledge & Memory Management");
      recommendedPractice.push("Revise Core Concepts → Memory Models → Thread Safety");
    }

    if (rel >= 75) strengths.push("Highly relevant and direct answer formulations.");
    else {
      weakAreas.push("Answer Relevance & Direct Addressing");
      recommendedPractice.push("Practice direct question answering without introductory fluff.");
    }

    if (comm >= 75) strengths.push("Clear communication structure and fluent expression.");
    else {
      weakAreas.push("Communication Structure & Clarity");
      recommendedPractice.push("Structure answers using STAR (Situation, Task, Action, Result) method.");
    }

    if (session.topics && session.topics.length > 0) {
      session.topics.forEach(top => {
        if (overallScore < 70) {
          weakAreas.push(`${top} Concepts`);
          recommendedPractice.push(`Practice ${top} → Interview Questions & Code Snippets`);
        }
      });
    }

    if (strengths.length === 0) strengths.push("Consistent effort and complete responses across all questions.");
    if (weakAreas.length === 0) weakAreas.push("Edge Case Analysis & Memory Optimization");
    if (recommendedPractice.length === 0) recommendedPractice.push("Practice System Design & Scalability Trade-offs");

    const finalReport = {
      overallScore,
      categories: {
        technicalKnowledge: tech,
        communication: comm,
        problemSolving: prob,
        relevance: rel,
        clarity: clar,
        completeness: comp
      },
      strengths,
      weakAreas,
      recommendedPractice
    };

    session.finalReport = finalReport;
    session.feedback = {
      overallScore,
      whyDidIFail: overallScore < 75 
        ? `Your primary area for improvement is: ${weakAreas.join(', ')}. Focus on providing structured, metric-driven answers.` 
        : `Great job! You achieved a solid overall score of ${overallScore}%. Review recommended practice topics to refine edge case handling.`,
      categories: {
        technicalAccuracy: tech,
        communication: comm,
        structureAndApproach: prob
      },
      actionableTips: recommendedPractice
    };

    // Integrate results with StudentAnalytics
    try {
      let analytics;
      if (isDbConnected) {
        analytics = await StudentAnalytics.findOne({ user: req.user._id });
        if (analytics) {
          weakAreas.forEach(area => {
            const cleanTopic = area.replace(' Concepts', '');
            if (analytics.conceptMastery.has(cleanTopic)) {
              const prevMastery = analytics.conceptMastery.get(cleanTopic);
              analytics.conceptMastery.set(cleanTopic, Math.max(25, prevMastery - 5));
            }
          });
          analytics.updatedAt = new Date();
          await analytics.save();
        }
      } else {
        analytics = memAnalytics[req.user._id];
        if (analytics) {
          weakAreas.forEach(area => {
            const cleanTopic = area.replace(' Concepts', '');
            if (analytics.conceptMastery && analytics.conceptMastery.has(cleanTopic)) {
              const prevMastery = analytics.conceptMastery.get(cleanTopic);
              analytics.conceptMastery.set(cleanTopic, Math.max(25, prevMastery - 5));
            }
          });
          analytics.updatedAt = new Date();
        }
      }
    } catch (aErr) {
      console.warn('StudentAnalytics sync note:', aErr.message);
    }

    if (isDbConnected) {
      await session.save();
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Interview completion error: ' + err.message });
  }
};

router.post('/:id/complete', auth, handleCompleteInterview);
router.post('/session/:id/complete', auth, handleCompleteInterview);

// 6. Get Interview by ID (GET /:id)
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      session = await InterviewSession.findById(id);
    } else {
      session = memSessions.find(s => s._id.toString() === id);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching interview session: ' + err.message });
  }
});

// 7. Get Interview Report (GET /:id/report & GET /session/:id/feedback)
router.get('/:id/report', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      session = await InterviewSession.findById(id);
    } else {
      session = memSessions.find(s => s._id.toString() === id);
    }

    if (!session) {
      return res.status(404).json({ message: 'Interview report not found.' });
    }

    res.json(session.finalReport || session.feedback || null);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report: ' + err.message });
  }
});

router.get('/session/:id/feedback', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;

    if (isDbConnected) {
      session = await InterviewSession.findById(id);
    } else {
      session = memSessions.find(s => s._id.toString() === id);
    }

    if (!session) {
      return res.status(404).json({ message: 'Session feedback not found.' });
    }

    res.json(session.feedback || session.finalReport || null);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback: ' + err.message });
  }
});

module.exports = router;
