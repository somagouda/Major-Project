const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const { auth } = require('./auth');
const InterviewSession = require('../models/InterviewSession');

const upload = multer({ limits: { fileSize: 5000000 } }); // Limit 5MB files

const memSessions = [];

// Templates for role gaps and recommendations
const roleTemplates = {
  'Software Development': {
    parsedSkills: ['Java', 'Python', 'Git', 'Data Structures', 'SQL'],
    detectedRoleMatch: 'Software Development - Product Based (82% Match)',
    skillGaps: [
      { skill: 'Low-Level & High-Level System Design (HLD/LLD)', priority: 'High' },
      { skill: 'Distributed Caching (Redis/Memcached)', priority: 'Medium' },
      { skill: 'Concurrency & Multi-threading models', priority: 'Medium' },
      { skill: 'Graph & Tree Algorithms (Advanced DSA)', priority: 'Low' }
    ],
    roadmapRecommendations: [
      'Learn SOLID Design principles and design patterns (Singleton, Factory, Observer).',
      'Solve system design problems on Scalability, Load Balancers, and Database Sharding.',
      'Practice medium-to-hard LeetCode questions focusing on Dynamic Programming and Graphs.'
    ],
    resumeAdditions: [
      'Add a dedicated section for System Design projects, highlighting use of Load Balancers and Redis caching.',
      'Include metric-driven achievements, e.g., "Optimized database queries to improve response times by 30%."',
      'List Multi-threading/Concurrency tools (e.g. Java Concurrency API, Go Goroutines) under your technical skills.'
    ]
  },
  'Software Development (Service Based)': {
    parsedSkills: ['Java', 'C++', 'Basic SQL', 'OOP Concepts'],
    detectedRoleMatch: 'Software Development - Service Based (80% Match)',
    skillGaps: [
      { skill: 'Client Communication & SDLC Methodologies (Agile/Scrum)', priority: 'High' },
      { skill: 'Cloud Platform basics (AWS/Azure)', priority: 'Medium' },
      { skill: 'Version Control (Advanced Git branching)', priority: 'Medium' }
    ],
    roadmapRecommendations: [
      'Learn standard SDLC models, focus on Agile methodologies and Jira workflows.',
      'Get certified in cloud fundamentals (AWS Cloud Practitioner or Azure Fundamentals).',
      'Study clean code principles and documentation structures.'
    ],
    resumeAdditions: [
      'Highlight cross-functional collaboration, client communication, and team management accomplishments.',
      'List SDLC frameworks, Git workflows, and testing fundamentals under technical expertise.',
      'Add projects demonstrating end-to-end SDLC execution, from requirement analysis to deployment.'
    ]
  },
  'AI/ML': {
    parsedSkills: ['Python', 'Pandas', 'Numpy', 'Scikit-Learn', 'SQL'],
    detectedRoleMatch: 'AI/ML Engineering (75% Match)',
    skillGaps: [
      { skill: 'Deep Learning frameworks (PyTorch/TensorFlow)', priority: 'High' },
      { skill: 'Large Language Model (LLM) Fine-Tuning & Prompt Engineering', priority: 'High' },
      { skill: 'MLOps & Model Deployment (Docker, Triton, AWS SageMaker)', priority: 'Medium' },
      { skill: 'Vector Databases (Pinecone/Milvus)', priority: 'Medium' }
    ],
    roadmapRecommendations: [
      'Complete a course on PyTorch foundations and neural networks.',
      'Build a simple RAG (Retrieval Augmented Generation) pipeline using LangChain and Pinecone.',
      'Explore MLOps pipelines and deploy a Flask/FastAPI model inference endpoint containerized in Docker.'
    ],
    resumeAdditions: [
      'Mention experience with PyTorch/TensorFlow framework architectures explicitly in your project descriptions.',
      'Add a project on LLMs, Fine-tuning, or Retrieval Augmented Generation (RAG) with vector search.',
      'List PyTorch, Triton, Docker, and specific evaluation metrics (F1-score, BLEU) under your core skills.'
    ]
  },
  'DevOps': {
    parsedSkills: ['Linux', 'Shell Scripting', 'Docker', 'Git', 'AWS'],
    detectedRoleMatch: 'DevOps Engineering (78% Match)',
    skillGaps: [
      { skill: 'Container Orchestration (Kubernetes/EKS)', priority: 'High' },
      { skill: 'Infrastructure as Code (Terraform/Ansible)', priority: 'High' },
      { skill: 'Advanced CI/CD Pipeline optimization (GitHub Actions/Jenkins)', priority: 'Medium' },
      { skill: 'Prometheus & Grafana (System Monitoring & Logging)', priority: 'Medium' }
    ],
    roadmapRecommendations: [
      'Study Kubernetes architecture (pods, deployments, services, ingress) and set up minikube locally.',
      'Write Terraform modules to provision simple VPC resources on AWS.',
      'Set up a full GitHub Actions workflow to build, test, lint, and deploy a dummy app.'
    ],
    resumeAdditions: [
      'Detail a project where you provisioned infrastructure using Terraform or Ansible.',
      'Explicitly highlight Kubernetes orchestration experience (e.g., configuring multi-pod deployments, services, or ingress controller rules).',
      'List Docker, Kubernetes, Terraform, and Prometheus/Grafana as core infrastructure skills.'
    ]
  },
  'Cloud': {
    parsedSkills: ['AWS Basic Services (S3, EC2)', 'Python', 'Networking Foundations'],
    detectedRoleMatch: 'Cloud Solutions Architecture (70% Match)',
    skillGaps: [
      { skill: 'Multi-Region High Availability Architectures', priority: 'High' },
      { skill: 'Cloud Security & IAM Policies', priority: 'High' },
      { skill: 'Serverless Architectures (AWS Lambda, API Gateway)', priority: 'Medium' },
      { skill: 'Infrastructure Cost Optimization practices', priority: 'Low' }
    ],
    roadmapRecommendations: [
      'Study for the AWS Certified Solutions Architect exam curriculum.',
      'Implement an API with API Gateway, AWS Lambda, and DynamoDB (Serverless Framework).',
      'Learn network CIDR sizing, subnet divisions, NAT gateways, and custom route tables.'
    ],
    resumeAdditions: [
      'Describe a serverless deployment using AWS Lambda, API Gateway, and DynamoDB.',
      'Detail secure VPC configuration achievements, mentioning public/private subnets, NAT gateways, and IAM policy principles.',
      'Include any cloud certifications (e.g., AWS Certified Solutions Architect) prominently near the header.'
    ]
  },
  'Full Stack': {
    parsedSkills: ['ReactJS', 'NodeJS', 'Express', 'JavaScript', 'HTML/CSS', 'MongoDB'],
    detectedRoleMatch: 'Full Stack Web Developer (85% Match)',
    skillGaps: [
      { skill: 'Next.js Server Side Rendering (SSR) & Static Site Gen', priority: 'High' },
      { skill: 'State Management Libraries (Zustand, Redux Toolkit)', priority: 'Medium' },
      { skill: 'GraphQL APIs and Apollo Client integrations', priority: 'Medium' },
      { skill: 'Web Security vulnerabilities (CORS, CSRF, XSS protection)', priority: 'High' }
    ],
    roadmapRecommendations: [
      'Convert a standard React app into Next.js App Router and measure Core Web Vitals improvements.',
      'Implement custom security middleware to sanitize inputs, check headers (Helmet), and handle CORS safely.',
      'Build a small dashboard using GraphQL queries and mutations.'
    ],
    resumeAdditions: [
      'Add Next.js SSR/SSG implementation details to your frontend projects to showcase modern rendering familiarity.',
      'Include a section about Web Security implementations (e.g., sanitizing inputs against XSS, configuring CSRF protection, SameSite cookies).',
      'Mention experience with State Management tools (e.g. Zustand, Redux Toolkit) in your tech stack list.'
    ]
  },
  'None': {
    parsedSkills: ['General Computer Science', 'Problem Solving'],
    detectedRoleMatch: 'General Associate (60% Match)',
    skillGaps: [
      { skill: 'Core Web Development foundations', priority: 'High' },
      { skill: 'Version Control (Git/GitHub)', priority: 'High' },
      { skill: 'Relational Database Queries (SQL)', priority: 'Medium' }
    ],
    roadmapRecommendations: [
      'Select a dedicated target role to customize your placement preparation.',
      'Learn core Git controls (commit, push, branches, pull requests).',
      'Practice simple SQL statements on PostgreSQL or MySQL.'
    ],
    resumeAdditions: [
      'Add a dedicated Skills matrix at the top of the resume matching the selected track.',
      'Highlight foundational logic problems solved or coursework completed.'
    ]
  }
};

// 1. Upload resume (mock parser)
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  const fileName = req.file ? req.file.originalname : 'mock_resume_file.pdf';
  const rawRole = req.body.targetRole || req.user.targetRole || 'Software Development';
  
  // Simulated delay to feel like a real AI parsing model
  setTimeout(() => {
    let role = rawRole;
    if (rawRole === 'Software Development (Product Based)') role = 'Software Development';
    else if (rawRole === 'Software Development (Service Based)') role = 'Software Development (Service Based)';
    else if (rawRole === 'AI/ML Engineering') role = 'AI/ML';
    else if (rawRole === 'DevOps Engineering') role = 'DevOps';
    else if (rawRole === 'Cloud Solutions Architect') role = 'Cloud';
    else if (rawRole === 'Full Stack Developer') role = 'Full Stack';

    const template = roleTemplates[role] || roleTemplates['Software Development'];
    
    const parsedData = {
      fileName,
      parsedSkills: template.parsedSkills,
      detectedRoleMatch: template.detectedRoleMatch || rawRole,
      skillGaps: template.skillGaps,
      roadmapRecommendations: template.roadmapRecommendations,
      resumeAdditions: template.resumeAdditions || [
        "Include quantifiable metrics of performance optimizations.",
        "Add a dedicated Skills matrix at the top of the resume matching the selected track."
      ]
    };

    res.json(parsedData);
  }, 1000);
});

// 2. Create Interview Session
router.post('/session', auth, async (req, res) => {
  const { type } = req.body; // Technical or HR
  const role = req.user.targetRole || 'Software Development';

  const firstQuestion = type === 'HR'
    ? "Tell me about a time you had a conflict with a teammate. How did you resolve it, and what did you learn?"
    : `Let's discuss coding for ${role} positions. How do you approach caching dynamic database results to reduce response times? What tools and design considerations do you keep in mind?`;

  const newSessionData = {
    user: req.user._id,
    type: type || 'Technical',
    status: 'in_progress',
    chatHistory: [{
      sender: 'AI',
      message: firstQuestion,
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
    res.status(500).json({ message: 'Server session creation error: ' + err.message });
  }
});

// 3. User responds to AI question (Exchange chatbot messages)
router.post('/session/:id/respond', auth, async (req, res) => {
  const { message } = req.body;
  const { id } = req.params;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
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

    // Add candidate response
    session.chatHistory.push({
      sender: 'Candidate',
      message,
      timestamp: new Date()
    });

    // Generate AI response based on the message and history length
    const turns = session.chatHistory.filter(c => c.sender === 'Candidate').length;
    let aiResponse = "";
    
    if (turns === 1) {
      aiResponse = session.type === 'HR'
        ? "That is a great example of team collaboration. How did your teammate react to your suggested resolution? And could you elaborate on the core compromise you reached?"
        : "Excellent point regarding cache-aside strategies. In your scenario, how do you handle cache stampede (or cache dog-piling) if thousands of requests hit a stale cache entry simultaneously?";
    } else if (turns === 2) {
      aiResponse = session.type === 'HR'
        ? "Understood, empathy and direct communication are key. For my last question: Why are you interested in this target role specifically, and what makes you the right fit?"
        : "Makes sense. Using mutex locks or pre-populating caches are standard resolutions. Finally: Let's talk database design. How would you design a database schema to handle massive read operations vs write operations for the target role?";
    } else {
      aiResponse = "Thank you for the detailed answers. I have gathered enough information to evaluate your performance. I will now compile my feedback analysis. Please click 'Complete Session'.";
    }

    session.chatHistory.push({
      sender: 'AI',
      message: aiResponse,
      timestamp: new Date()
    });

    if (isDbConnected) {
      await session.save();
    }

    res.json({
      chatHistory: session.chatHistory,
      status: session.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server session response error: ' + err.message });
  }
});

// 4. Complete session and compile "Why Did I Fail?" diagnostics
router.post('/session/:id/complete', auth, async (req, res) => {
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
      return res.status(404).json({ message: 'Session not found.' });
    }

    session.status = 'completed';
    const { proctorLogs, integrityScore } = req.body || {};
    session.proctorLogs = proctorLogs || [];
    session.integrityScore = integrityScore !== undefined ? integrityScore : 100;

    // Mock analysis algorithm
    const candidateMessages = session.chatHistory
      .filter(c => c.sender === 'Candidate')
      .map(c => c.message.toLowerCase());
    
    let technicalAccuracy = 60;
    let communication = 70;
    let structureAndApproach = 65;

    // Evaluate message depth
    const totalWordCount = candidateMessages.join(' ').split(/\s+/).filter(Boolean).length;
    if (totalWordCount > 150) {
      communication += 15;
      structureAndApproach += 10;
    }
    if (candidateMessages.some(msg => msg.includes('cache') || msg.includes('redis') || msg.includes('mutex') || msg.includes('design') || msg.includes('conflict'))) {
      technicalAccuracy += 20;
    }

    technicalAccuracy = Math.min(technicalAccuracy, 95);
    communication = Math.min(communication, 95);
    structureAndApproach = Math.min(structureAndApproach, 95);

    const overallScore = Math.round((technicalAccuracy + communication + structureAndApproach) / 3);

    // Why Did I Fail NLP description mapping
    let whyDidIFail = "";
    let actionableTips = [];

    if (session.type === 'HR') {
      if (overallScore < 75) {
        whyDidIFail = "You failed to fully structure your behavioral responses using the STAR methodology (Situation, Task, Action, Result). Your descriptions focused heavily on the team's problem rather than highlighting your direct, personal actions. Additionally, the communication style lacked a structured reflection on key learnings.";
        actionableTips = [
          "Use the STAR method explicitly: dedicate 20% to Situation/Task, 60% to Actions, and 20% to the Result.",
          "Avoid using passive 'we did this' phrasing. Focus on 'I designed this' or 'I initiated a chat'.",
          "Explicitly conclude with a 1-sentence learning takeaway."
        ];
      } else {
        whyDidIFail = "You performed well! However, you could improve by showcasing measurable impact. For example, instead of saying 'the team was happy,' quantify the results by mentioning how much time was saved or the percentage increase in team velocity.";
        actionableTips = [
          "Include quantifiable metrics in behavioral answers.",
          "Describe how you scale collaborative efforts to higher-level cross-functional groups."
        ];
      }
    } else {
      // Technical
      if (overallScore < 75) {
        whyDidIFail = "You failed to address key edge cases in scaling and cache consistency. While you successfully explained standard Cache-Aside concepts, you failed to detail what happens during a cache stampede or system failure. Your explanation of schema database partitions did not present concrete sharding keys, showing a gap in high-scale systems architecture.";
        actionableTips = [
          "Revise caching recovery topics, specifically cache-stampede strategies (using lock exclusions or early background renewals).",
          "Practice drafting distributed schemas with explicit hash partition keys.",
          "Practice explaining your code structure step-by-step before writing solutions."
        ];
      } else {
        whyDidIFail = "Excellent system structure. The core weakness was in cost-scaling analysis. You recommended standard heavy caching layouts without noting the memory expense overhead of Redis clusters at scale.";
        actionableTips = [
          "Incorporate system cost and resource budget constraints in your architecture reviews.",
          "Revise database replica synchronization delays."
        ];
      }
    }

    // Apply proctor score deductions if integrity is low
    let finalOverallScore = overallScore;
    let finalTechnicalAccuracy = technicalAccuracy;
    let finalCommunication = communication;
    let finalStructureAndApproach = structureAndApproach;

    if (session.integrityScore < 85) {
      const penalty = Math.round((100 - session.integrityScore) * 0.4);
      finalTechnicalAccuracy = Math.max(30, technicalAccuracy - penalty);
      finalCommunication = Math.max(30, communication - penalty);
      finalStructureAndApproach = Math.max(30, structureAndApproach - penalty);
      finalOverallScore = Math.round((finalTechnicalAccuracy + finalCommunication + finalStructureAndApproach) / 3);

      whyDidIFail += `\n\n[Proctor Integrity Notice] Your overall assessment score was penalized because the system detected multiple integrity violations during your session (Integrity Score: ${session.integrityScore}%). Specifically, we logged: ${session.proctorLogs.map(l => l.message).join(', ') || 'unspecified camera/focus issues'}. In a professional recruitment environment, these flags would result in immediate disqualification.`;
      
      actionableTips.push("Maintain constant eye contact with the screen and camera during interviews.");
      actionableTips.push("Do not switch tabs, minimize the window, or navigate away from the active browser tab.");
      actionableTips.push("Ensure you are alone in a well-lit room to avoid multiple face detections.");
    }

    session.feedback = {
      overallScore: finalOverallScore,
      whyDidIFail,
      categories: {
        technicalAccuracy: finalTechnicalAccuracy,
        communication: finalCommunication,
        structureAndApproach: finalStructureAndApproach
      },
      actionableTips,
      integrityScore: session.integrityScore,
      proctorLogs: session.proctorLogs
    };

    if (isDbConnected) {
      await session.save();
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server session completion error: ' + err.message });
  }
});

// 5. Get Session Feedback directly
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

    res.json(session.feedback || null);
  } catch (err) {
    res.status(500).json({ message: 'Server session feedback fetch error: ' + err.message });
  }
});

module.exports = router;
