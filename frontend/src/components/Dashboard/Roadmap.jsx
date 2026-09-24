import React, { useState, useEffect } from 'react';

const roadmapData = {
  'Software Development': [
    {
      phase: 'Phase 1: Algorithmic Foundations',
      description: 'Master core data structures and algorithmic complexity analysis.',
      skills: ['Big-O Analysis', 'Arrays & Hash Maps', 'Linked Lists & Trees', 'Sorting & Searching'],
      resources: ['LeetCode Easy/Medium problems', 'Practice on Conceptual Quiz cards'],
      checkpoints: [
        'Solve LeetCode 1: Two Sum in the practice engine',
        'Learn the difference between O(N) and O(N log N) sorting',
        'Understand tree traversal algorithms (DFS, BFS)'
      ]
    },
    {
      phase: 'Phase 2: Software Engineering Core',
      description: 'Learn object-oriented design and design patterns that scale.',
      skills: ['SOLID Principles', 'Design Patterns (Singleton, Factory, Observer)', 'System Design Basics'],
      resources: ['Refactoring.Guru', 'Practice System Design MCQs'],
      checkpoints: [
        'Complete the LRU Cache conceptual quiz card',
        'Create a simple project demonstrating object-oriented design patterns',
        'Write unit tests using JUnit, Jest, or PyTest'
      ]
    },
    {
      phase: 'Phase 3: Intermediate Systems',
      description: 'Dive into databases, concurrency, and memory management basics.',
      skills: ['SQL Joins & Indexes', 'Multithreading', 'Memory Allocations (heap/stack)'],
      resources: ['SQL laboratory challenges', 'Database schema indexing tutorials'],
      checkpoints: [
        'Solve the Second Highest Salary SQL problem',
        'Analyze stack vs heap memory usage for your target programming language',
        'Explain race conditions and locking mechanism strategies'
      ]
    },
    {
      phase: 'Phase 4: Interview Acceleration',
      description: 'Simulate technical interview environments and optimize performance.',
      skills: ['Live coding communication', 'Optimal optimization step logic', 'Mock interview scenarios'],
      resources: ['AI Mock Interviewer tab', 'Resume Gap Analyzer'],
      checkpoints: [
        'Conduct a full audio-based AI interview in the AI Interviewer tab',
        'Upload your resume to check for missing skill keywords',
        'Achieve a Theta score higher than 1.5 in the practice engine'
      ]
    }
  ],
  'AI/ML': [
    {
      phase: 'Phase 1: Mathematical Foundations',
      description: 'Understand the underlying mathematics of machine learning algorithms.',
      skills: ['Linear Algebra (SVD, Eigenvalues)', 'Multivariable Calculus (Gradients)', 'Probability & Optimization'],
      resources: ['Khan Academy Linear Algebra', 'ML Math cheatsheets'],
      checkpoints: [
        'Master the Gradient Descent Optimization quiz card',
        'Understand the mathematical significance of Backpropagation derivatives',
        'Explain mean squared error loss optimization steps'
      ]
    },
    {
      phase: 'Phase 2: Classical Machine Learning',
      description: 'Learn core regression, classification, and clustering algorithms.',
      skills: ['Linear & Logistic Regression', 'SVMs & Decision Trees', 'Pandas, NumPy, Scikit-Learn'],
      resources: ['Introduction to Statistical Learning', 'Hands-On Machine Learning book'],
      checkpoints: [
        'Build a classifier using Scikit-Learn on a mock dataset',
        'Solve practice cards related to Supervised vs Unsupervised models',
        'Understand bias-variance trade-offs and cross-validation techniques'
      ]
    },
    {
      phase: 'Phase 3: Deep Learning & NLP/Vision',
      description: 'Move into neural networks, sequential models, and large language models.',
      skills: ['Neural Network layers', 'Transformers & Attention Mechanisms', 'PyTorch & TensorFlow'],
      resources: ['DeepLearning.AI courses', 'Hugging Face documentation'],
      checkpoints: [
        'Answer the Transformer Self-Attention matrix dimensions question correctly',
        'Differentiate between KV-caching with and without complexities',
        'Build a simple multi-layer perceptron neural network'
      ]
    },
    {
      phase: 'Phase 4: AI Mock Interviews & Projects',
      description: 'Prepare for machine learning engineer and data scientist interviews.',
      skills: ['Model evaluation metrics', 'Distributed model training', 'Inference optimization'],
      resources: ['AI Interviewer matching ML roles', 'Resume Parser check'],
      checkpoints: [
        'Run a full AI machine learning interview simulation',
        'Check resume for critical ML skills (e.g. PyTorch, Transformers, MLOps)',
        'Achieve an ML/AI Theta level of 1.5+'
      ]
    }
  ],
  'DevOps': [
    {
      phase: 'Phase 1: Linux & Scripting basics',
      description: 'Learn system administration, networking, and automation.',
      skills: ['Linux Shell commands', 'Bash or Python scripting', 'Networking protocols (HTTP, TCP/IP, DNS)'],
      resources: ['Linux Journey tutorials', 'Interactive shell scripts exercises'],
      checkpoints: [
        'Write a shell script to automate environment diagnostics',
        'Learn VPC subnets and basic security group principles',
        'Solve DevOps level-1 conceptual practice questions'
      ]
    },
    {
      phase: 'Phase 2: Containerization & Orchestration',
      description: 'Package applications and manage clusters.',
      skills: ['Docker layer caching optimizations', 'Kubernetes architecture', 'Pods, Deployments, Services'],
      resources: ['Kubernetes Docs', 'Katacoda interactive labs'],
      checkpoints: [
        'Master the Docker Layer Caching Optimization practice card',
        'Configure a Kubernetes rolling update deployment strategy',
        'Understand distributed quorum configurations (e.g., etcd cluster partitions)'
      ]
    },
    {
      phase: 'Phase 3: Continuous Integration & IaC',
      description: 'Automate build, deployment, and infrastructure configuration.',
      skills: ['CI/CD (GitHub Actions, GitLab CI)', 'Infrastructure as Code (Terraform)', 'Ansible / Configuration management'],
      resources: ['Terraform Getting Started guides', 'GitHub actions workflows'],
      checkpoints: [
        'Create a working GitHub Actions workflow for a node app',
        'Write a basic Terraform script to provision a local cloud resource',
        'Explain Canary vs Blue-Green deployment weights'
      ]
    },
    {
      phase: 'Phase 4: Site Reliability & Live Mocking',
      description: 'Optimize system uptime, logging, and tackle DevOps coding assessments.',
      skills: ['Prometheus & Grafana monitoring', 'Log aggregation', 'DevOps interview scenarios'],
      resources: ['AI Interviewer simulation', 'Daily Practice'],
      checkpoints: [
        'Configure monitoring alerts simulations',
        'Complete a DevOps-oriented interview with the AI coach',
        'Audit your DevOps resume gaps for container tools'
      ]
    }
  ],
  'Cloud': [
    {
      phase: 'Phase 1: Core Cloud Provider Architectures',
      description: 'Get familiar with major cloud vendors and core cloud resources.',
      skills: ['EC2 / Compute instances', 'S3 / Object storage costs', 'IAM / Identity access policies'],
      resources: ['AWS Cloud Practitioner / Azure Fundamentals guides', 'Cloud cost analyzer tools'],
      checkpoints: [
        'Solve the AWS S3 Storage Cost Optimization card',
        'Design a secure network route using a VPC NAT Gateway',
        'Configure multi-factor auth rules for root administrator access'
      ]
    },
    {
      phase: 'Phase 2: High Availability & Scaling',
      description: 'Design web applications that scale dynamically to millions of requests.',
      skills: ['Load Balancers', 'Auto Scaling Groups', 'Multi-Region Replication'],
      resources: ['AWS Well-Architected Framework', 'Global database replication tutorials'],
      checkpoints: [
        'Differentiate between Active-Active DynamoDB global tables and Active-Passive databases',
        'Understand recovery time objectives (RTO) and recovery point objectives (RPO)',
        'Configure auto-scaling triggers based on CPU telemetry spikes'
      ]
    },
    {
      phase: 'Phase 3: Serverless Ecosystems',
      description: 'Build event-driven apps using serverless components.',
      skills: ['AWS Lambda cold starts', 'API Gateway endpoints', 'Serverless databases'],
      resources: ['Serverless Framework documentation', 'AWS Lambda guides'],
      checkpoints: [
        'Solve the AWS Lambda Cold Start Optimization card',
        'Design a serverless API that connects to a DynamoDB cluster',
        'Understand provisioning concurrency limits'
      ]
    },
    {
      phase: 'Phase 4: Cloud Security & System Mocking',
      description: 'Validate cloud architectures and prepare for security-oriented engineering tests.',
      skills: ['KMS encryption keys', 'VPC flow logs auditing', 'Cloud architect case studies'],
      resources: ['AI Interviewer', 'Daily Practice'],
      checkpoints: [
        'Complete a Cloud Engineer role interview mock session',
        'Optimize resume using the analyzer to include cloud certifications',
        'Achieve a passing score in the Cloud conceptual preparation area'
      ]
    }
  ],
  'Full Stack': [
    {
      phase: 'Phase 1: Frontend Engineering',
      description: 'Master core user-interface development frameworks and standard layout design.',
      skills: ['React Virtual DOM reconciliation keys', 'State Management (Redux, Context)', 'Responsive CSS glassmorphism layout'],
      resources: ['MDN Web Docs', 'React documentation tutorials'],
      checkpoints: [
        'Master the React Virtual DOM Reconciliation keys practice question',
        'Build a modern, interactive component using TailwindCSS or Vanilla CSS HSL variables',
        'Understand React state render cycles and memoization rules'
      ]
    },
    {
      phase: 'Phase 2: Backend Architecture',
      description: 'Excellence in server logic, endpoints, and session security.',
      skills: ['RESTful APIs design', 'JWT authentication cookies', 'CSRF and XSS security mitigations'],
      resources: ['Node.js & Express API tutorials', 'OAuth & Session auth docs'],
      checkpoints: [
        'Answer the Cookie Session Auth CSRF mitigation card correctly',
        'Implement an Express route with authentication verification middleware',
        'Configure SameSite cookie safety parameters'
      ]
    },
    {
      phase: 'Phase 3: Database & Caching Optimization',
      description: 'Query optimization, index analysis, and scalability.',
      skills: ['SQL vs NoSQL indexes', 'Cursor-based pagination', 'Redis caching strategies'],
      resources: ['SQL laboratory sandboxes', 'Redis caching guides'],
      checkpoints: [
        'Explain why cursor pagination is faster than offset-limit on huge tables',
        'Solve duplicate person database entries in the SQL sandboxes',
        'Implement database indexes to scale query speeds from O(N) to O(log N)'
      ]
    },
    {
      phase: 'Phase 4: Deployment & System Verification',
      description: 'Real-time integrations and cloud hosting.',
      skills: ['WebSockets & Server-Sent Events', 'Docker containerizing frontend/backend', 'CI/CD workflows'],
      resources: ['AI Interviewer Full Stack interview mocks', 'Resume Analyzer checks'],
      checkpoints: [
        'Explain when to use WebSockets vs Server-Sent Events (SSE)',
        'Complete a full live coding mock interview challenge',
        'Align your Full Stack resume layout with target framework specifications'
      ]
    }
  ]
};

export default function Roadmap({ user, setActiveTab }) {
  const defaultRole = user?.targetRole && roadmapData[user.targetRole] ? user.targetRole : 'Software Development';
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [checkedItems, setCheckedItems] = useState({});

  // Sync state if user role changes
  useEffect(() => {
    if (user?.targetRole && roadmapData[user.targetRole]) {
      setSelectedRole(user.targetRole);
    }
  }, [user]);

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smartplacement_roadmap_checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse roadmap checklist:', e);
      }
    }
  }, []);

  const handleToggleCheck = (role, phaseIndex, checkpointIndex) => {
    const key = `${role}_${phaseIndex}_${checkpointIndex}`;
    const newChecked = {
      ...checkedItems,
      [key]: !checkedItems[key]
    };
    setCheckedItems(newChecked);
    localStorage.setItem('smartplacement_roadmap_checklist', JSON.stringify(newChecked));
  };

  const activeRoadmap = roadmapData[selectedRole] || roadmapData['Software Development'];

  // Calculate completion percentage for the active role
  const totalCheckpoints = activeRoadmap.reduce((acc, phase) => acc + phase.checkpoints.length, 0);
  const completedCheckpoints = activeRoadmap.reduce((acc, phase, pIdx) => {
    const checkedInPhase = phase.checkpoints.filter((_, cIdx) => checkedItems[`${selectedRole}_${pIdx}_${cIdx}`]);
    return acc + checkedInPhase.length;
  }, 0);
  const progressPercent = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

  return (
    <div className="glass-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Interactive Career Roadmap
        </h1>
        <p>Your step-by-step master plan to achieve your target job. Complete conceptual practices, SQL laboratories, and coding sessions to check off your milestones.</p>
      </div>

      {/* Role Selection Row */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Browse Career Track Roadmaps</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.keys(roadmapData).map((r) => (
                <button
                  key={r}
                  className={`btn ${selectedRole === r ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.8rem',
                    borderColor: selectedRole === r ? 'var(--accent)' : 'var(--glass-border)',
                    background: selectedRole === r ? 'linear-gradient(135deg, var(--accent), #8b5cf6)' : 'rgba(255,255,255,0.03)'
                  }}
                  onClick={() => setSelectedRole(r)}
                >
                  {r} {user?.targetRole === r && <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem', color: '#fff' }}>🎯</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Analytics */}
          <div style={{ minWidth: '150px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progress: {completedCheckpoints} / {totalCheckpoints} Done</span>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '4px',
              marginTop: '0.5rem',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(to right, var(--success), var(--secondary))',
                borderRadius: '4px',
                transition: 'width 0.4s ease-out'
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'block', marginTop: '0.25rem' }}>{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      {/* Topic Mastery Status Overview */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '0.75rem' }}>Topic Mastery & Roadmap Status</h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
          Real-time topic readiness calculated from your problem submissions, baseline assessment, and interview performance.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {[
            { topic: 'Arrays & Two Pointer', topicId: 'dsa-arrays-two-pointer', mastery: 78, status: '🟢 Good', icon: '🟢' },
            { topic: 'Sliding Window', topicId: 'dsa-arrays-sliding-window', mastery: 42, status: '🟡 Learning', icon: '🟡' },
            { topic: "Kadane's Algorithm", topicId: 'dsa-arrays-kadane', mastery: 25, status: '🔴 Needs Practice', icon: '🔴' },
            { topic: 'SQL & Database Joins', topicId: 'dbms-sql', mastery: 85, status: '🔥 Strong', icon: '🔥' },
            { topic: 'Trees & Graph Traversal', topicId: 'dsa-trees-bfs-dfs', mastery: 92, status: '✓ Mastered', icon: '✓' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.85rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{item.topic}</strong>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{item.status}</span>
              </div>
              
              <div className="readiness-bar-outer" style={{ height: '7px', marginBottom: '0.5rem' }}>
                <div className="readiness-bar-inner" style={{
                  width: `${item.mastery}%`,
                  background: item.mastery >= 90 ? 'var(--success)' : item.mastery >= 75 ? 'var(--secondary)' : item.mastery >= 40 ? 'var(--warning)' : 'var(--danger)'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.mastery}% Mastery</span>
                {item.mastery < 65 && (
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab('practice');
                      } else {
                        window.location.hash = '#practice';
                      }
                    }}
                  >
                    ⚡ Practice Weak Topic
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        {/* Central timeline line */}
        <div style={{
          position: 'absolute',
          left: '25px',
          top: '20px',
          bottom: '20px',
          width: '2px',
          background: 'linear-gradient(to bottom, var(--accent) 0%, rgba(139, 92, 246, 0.4) 50%, rgba(255,255,255,0.05) 100%)',
          zIndex: 0
        }} />

        {activeRoadmap.map((step, pIdx) => {
          const phaseCheckedCount = step.checkpoints.filter((_, cIdx) => checkedItems[`${selectedRole}_${pIdx}_${cIdx}`]).length;
          const isPhaseCompleted = phaseCheckedCount === step.checkpoints.length;

          return (
            <div key={pIdx} style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
              {/* Node Circle */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: isPhaseCompleted ? 'var(--success)' : phaseCheckedCount > 0 ? 'var(--accent)' : '#0f0e20',
                border: '3px solid',
                borderColor: isPhaseCompleted ? 'var(--success)' : phaseCheckedCount > 0 ? 'var(--accent)' : 'var(--glass-border)',
                boxShadow: phaseCheckedCount > 0 ? '0 0 15px rgba(139,92,246,0.3)' : 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.1rem',
                color: '#fff',
                fontWeight: 'bold',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}>
                {isPhaseCompleted ? '✓' : pIdx + 1}
              </div>

              {/* Step Content Card */}
              <div className="glass-card" style={{ flex: 1, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{step.phase}</h3>
                  <span className={`badge ${isPhaseCompleted ? 'badge-success' : phaseCheckedCount > 0 ? 'badge-warning' : 'badge-secondary'}`} style={{ fontSize: '0.75rem' }}>
                    {isPhaseCompleted ? 'Completed' : phaseCheckedCount > 0 ? 'In Progress' : 'Planned'}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{step.description}</p>

                {/* Grid for Skills and Resources */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                  <div>
                    <h5 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Skills to Master</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {step.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Recommended Resources</h5>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {step.resources.map((res, rIdx) => (
                        <li key={rIdx} style={{ marginBottom: '0.25rem' }}>{res}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Checkpoint Checklist */}
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem' }}>
                  <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#fff' }}>Milestone Checklist</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {step.checkpoints.map((checkpoint, cIdx) => {
                      const isItemChecked = !!checkedItems[`${selectedRole}_${pIdx}_${cIdx}`];
                      return (
                        <label
                          key={cIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            fontSize: '0.85rem',
                            color: isItemChecked ? 'var(--text-muted)' : '#fff',
                            textDecoration: isItemChecked ? 'line-through' : 'none',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isItemChecked}
                            onChange={() => handleToggleCheck(selectedRole, pIdx, cIdx)}
                            style={{
                              marginTop: '0.15rem',
                              accentColor: 'var(--accent)',
                              cursor: 'pointer'
                            }}
                          />
                          <span>{checkpoint}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Real Placement Question Integration Card */}
      <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.1) 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>🎯 Integrated Real Placement Practice Engine</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Every milestone in your {selectedRole} roadmap is linked with real company interview experiences & verified question sets.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', background: 'rgba(234,88,12,0.2)', color: '#fb923c', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(234,88,12,0.4)', fontWeight: 600 }}>
              🔥 Verified Interview Reports
            </span>
            <span style={{ fontSize: '0.78rem', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.4)', fontWeight: 600 }}>
              🛡️ Official Standard Questions
            </span>
            <span style={{ fontSize: '0.78rem', background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.4)', fontWeight: 600 }}>
              🤖 AI Concept Generators
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
