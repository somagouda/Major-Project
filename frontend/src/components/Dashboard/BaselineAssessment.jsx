import React, { useState } from 'react';

const quizQuestions = [
  {
    id: 1,
    question: "What is the worst-case time complexity of sorting an array of N elements using QuickSort?",
    options: ["O(N log N)", "O(N)", "O(N²)", "O(1)"],
    correctIndex: 2
  },
  {
    id: 2,
    question: "Which of the following database concepts guarantees that database transactions are processed reliably?",
    options: ["CAP Theorem", "ACID Properties", "BASE Model", "CRUD Actions"],
    correctIndex: 1
  },
  {
    id: 3,
    question: "In Kubernetes, what is the smallest deployable unit of computing that you can create and manage?",
    options: ["Container", "Pod", "Service", "Node"],
    correctIndex: 1
  },
  {
    id: 4,
    question: "What is the main purpose of an activation function in a Deep Neural Network?",
    options: ["To regularize weights", "To scale input parameters", "To introduce non-linearity", "To compute gradients"],
    correctIndex: 2
  },
  {
    id: 5,
    question: "Which AWS service is designed to execute serverless backend code in response to system events?",
    options: ["AWS EC2", "AWS S3", "AWS Lambda", "AWS RDS"],
    correctIndex: 2
  }
];

export default function BaselineAssessment({ token, onOnboardComplete, preselectedRole }) {
  const [role, setRole] = useState(preselectedRole || '');
  const [step, setStep] = useState(preselectedRole ? 'quiz' : 'role_selection'); // role_selection, quiz, submitting
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const roles = [
    { name: 'Software Development', desc: 'DSA, backend algorithms, databases, code architecture' },
    { name: 'AI/ML', desc: 'Statistics, neural networks, PyTorch, model deployment pipelines' },
    { name: 'DevOps', desc: 'Docker, Kubernetes, CI/CD automation, cloud orchestration' },
    { name: 'Cloud', desc: 'Solutions architecture, serverless, VPC networks, AWS configurations' },
    { name: 'Full Stack', desc: 'React rendering, Express microservices, databases, state engines' }
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    setStep('quiz'); // Immediately launch quiz
  };

  const handleNextStep = () => {
    if (!role) {
      setError('Please select a target role to proceed.');
      return;
    }
    setStep('quiz');
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQ]: optionIndex });
  };

  const handleQuizNext = () => {
    if (answers[currentQ] === undefined) {
      setError('Please choose an answer before proceeding.');
      return;
    }
    setError('');
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateAndSubmit();
    }
  };

  const calculateAndSubmit = async () => {
    setStep('submitting');
    
    // Calculate correct score out of 10
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    
    const baselineScore = (correctCount / quizQuestions.length) * 10; // scale 0-10

    try {
      const response = await fetch('http://localhost:5000/api/auth/onboard', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetRole: role, baselineScore })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Onboarding failed.');
      
      onOnboardComplete(data);
    } catch (err) {
      setError(err.message);
      setStep('quiz');
    }
  };

  return (
    <div className="glass-container" style={{ maxWidth: '700px', margin: '3rem auto' }}>
      {step === 'role_selection' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Setup Your Target Career Path
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Select your discipline. We will configure your adaptive placement questionnaires, mock interviews, and skill checks to match your career goals.
          </p>

          {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {roles.map((r) => (
              <div 
                key={r.name}
                className="option-button"
                style={{ 
                  borderWidth: '1.5px',
                  borderColor: role === r.name ? 'var(--primary)' : 'var(--glass-border)',
                  background: role === r.name ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)'
                }}
                onClick={() => handleRoleSelect(r.name)}
              >
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: role === r.name ? 'var(--primary)' : '#fff', margin: 0 }}>{r.name}</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0, marginTop: '0.2rem' }}>{r.desc}</p>
                  </div>
                  {role === r.name && <span className="badge badge-primary">Selected</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            * Note: Selecting a career path will immediately start the diagnostic baseline quiz.
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <span className="badge badge-secondary">Question {currentQ + 1} of {quizQuestions.length}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Baseline Evaluation</span>
          </div>

          <h3 style={{ marginBottom: '1.5rem' }}>{quizQuestions[currentQ].question}</h3>

          {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <div style={{ marginBottom: '1.5rem' }}>
            {quizQuestions[currentQ].options.map((opt, oIdx) => (
              <button
                key={oIdx}
                className={`option-button ${answers[currentQ] === oIdx ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(oIdx)}
              >
                {opt}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleQuizNext}>
            {currentQ === quizQuestions.length - 1 ? 'Finish Assessment' : 'Save & Continue'}
          </button>
        </div>
      )}

      {step === 'submitting' && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="progress-ring-container" style={{ animation: 'float 3s ease-in-out infinite', marginBottom: '1.5rem' }}>
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="30" stroke="var(--primary)" strokeWidth="6" fill="transparent" strokeDasharray="180" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', animation: 'fadeIn 1s linear infinite' }}/>
            </svg>
          </div>
          <h3>Analyzing Baseline Profile...</h3>
          <p>Mapping question responses, generating initial skill map models, and calculating placement readiness indexes.</p>
        </div>
      )}
    </div>
  );
}
