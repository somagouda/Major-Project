import React, { useState } from 'react';

export default function ResumeParser({ user, token, onGapsUpdated }) {
  const getDefaultRole = () => {
    if (user?.targetRole === 'Software Development') return 'Software Development (Product Based)';
    if (user?.targetRole === 'AI/ML') return 'AI/ML Engineering';
    if (user?.targetRole === 'DevOps') return 'DevOps Engineering';
    if (user?.targetRole === 'Cloud') return 'Cloud Solutions Architect';
    if (user?.targetRole === 'Full Stack') return 'Full Stack Developer';
    return 'Software Development (Product Based)';
  };

  const [targetRole, setTargetRole] = useState(getDefaultRole());
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setParsing(true);
    setError('');
    
    // Create form data to submit
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('targetRole', targetRole);

    try {
      const response = await fetch('http://localhost:5000/api/interviews/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error parsing resume.');
      
      setParsedData(data);
    } catch (err) {
      setError(err.message);
      
      // Offline fallback mock data matching targetRole
      let templateKey = targetRole;
      if (targetRole === 'Software Development (Product Based)') templateKey = 'Software Development';
      else if (targetRole === 'Software Development (Service Based)') templateKey = 'Software Development (Service Based)';
      else if (targetRole === 'AI/ML Engineering') templateKey = 'AI/ML';
      else if (targetRole === 'DevOps Engineering') templateKey = 'DevOps';
      else if (targetRole === 'Cloud Solutions Architect') templateKey = 'Cloud';
      else if (targetRole === 'Full Stack Developer') templateKey = 'Full Stack';

      const template = {
        'Software Development': {
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
        }
      }[templateKey] || {
        skillGaps: [
          { skill: 'Core Web Development foundations', priority: 'High' }
        ],
        roadmapRecommendations: [
          'Select a dedicated target role to customize your placement preparation.'
        ],
        resumeAdditions: [
          'Add a dedicated Skills matrix at the top of the resume matching the selected track.'
        ]
      };

      setParsedData({
        fileName: selectedFile.name,
        parsedSkills: ['JavaScript', 'HTML/CSS', 'React.js', 'Python'],
        detectedRoleMatch: `${targetRole} (Offline Mock Match: 80%)`,
        skillGaps: template.skillGaps.map(g => ({ ...g, checked: false })),
        roadmapRecommendations: template.roadmapRecommendations,
        resumeAdditions: template.resumeAdditions
      });
    } finally {
      setParsing(false);
    }
  };

  const handleCheckGap = (index) => {
    const updatedGaps = [...parsedData.skillGaps];
    updatedGaps[index].checked = !updatedGaps[index].checked;
    setParsedData({ ...parsedData, skillGaps: updatedGaps });

    if (onGapsUpdated) {
      onGapsUpdated();
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI Resume Analyzer & Skill Gap Finder
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Upload your resume (PDF, DOCX, or TXT). Select your target job track below, and our parser will evaluate your skill alignment, outline specific learning roadmaps, and recommend content additions to enhance your resume.
      </p>

      {/* Target Role Selector */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Target Career Role
        </label>
        <select 
          className="glass-input"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          style={{ background: '#0a0915', height: '38px', padding: '0 0.75rem' }}
          disabled={parsing || parsedData !== null}
        >
          <option value="Software Development (Product Based)">Software Development (Product Based)</option>
          <option value="Software Development (Service Based)">Software Development (Service Based)</option>
          <option value="AI/ML Engineering">AI/ML Engineering</option>
          <option value="DevOps Engineering">DevOps Engineering</option>
          <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
        </select>
      </div>

      {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

      {!parsedData && !parsing && (
        <div 
          className="upload-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resume-file-input').click()}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
          <strong>Drag & drop resume, or click to browse</strong>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Supports PDF, DOCX, or TXT up to 5MB</p>
          <input 
            type="file" 
            id="resume-file-input" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx"
          />
        </div>
      )}

      {parsing && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ height: '100%', width: '60%', background: 'var(--primary)', borderRadius: '2px', animation: 'pulseGlow 1.5s infinite' }}></div>
          </div>
          <h4>Extracting text & matching career criteria...</h4>
        </div>
      )}

      {parsedData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <strong style={{ color: '#fff' }}>{parsedData.fileName}</strong>
              <p style={{ fontSize: '0.8rem' }}>Matched Target: <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{parsedData.detectedRoleMatch}</span></p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setParsedData(null)}>
              Re-upload
            </button>
          </div>

          {/* Skill Gap Checklist (What all to learn) */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>What to Learn (Skill Gaps)</h4>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Complete these topics to cover placement readiness requirements for the selected track:</p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {parsedData.skillGaps.map((gap, idx) => (
                <div key={idx} className="checklist-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      className="checklist-checkbox"
                      checked={gap.checked || false}
                      onChange={() => handleCheckGap(idx)}
                    />
                    <span style={{ fontSize: '0.85rem', color: gap.checked ? 'var(--text-muted)' : '#fff', textDecoration: gap.checked ? 'line-through' : 'none' }}>
                      {gap.skill}
                    </span>
                  </div>
                  <span className={`badge ${gap.priority === 'High' ? 'badge-danger' : gap.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                    {gap.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Learning Roadmap (Steps to learn) */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Action Plan Steps</h4>
            <div className="roadmap-timeline">
              {parsedData.roadmapRecommendations.map((rec, idx) => (
                <div key={idx} className="roadmap-step">
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>Step {idx + 1}</span>
                  <p style={{ fontSize: '0.85rem', color: '#fff' }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Content Additions (What should be added to the resume) */}
          {parsedData.resumeAdditions && (
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>What to Add to Your Resume</h4>
              <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Integrate these projects, keywords, and performance benchmarks to bypass ATS filters and match this track:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {parsedData.resumeAdditions.map((addition, idx) => (
                  <div key={idx} className="checklist-item" style={{ 
                    background: 'rgba(236,72,153,0.03)', 
                    border: '1px dashed rgba(236,72,153,0.2)', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    justifyContent: 'flex-start'
                  }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem', lineHeight: '1' }}>+</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', textAlign: 'left', lineHeight: '1.4' }}>
                      {addition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
