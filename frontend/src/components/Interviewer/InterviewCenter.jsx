import React from 'react';

const tracks = [
  {
    id: 'technical',
    title: 'Technical',
    badge: 'Core Computer Science',
    description: 'Assess core software engineering principles, algorithms, databases, system architecture, OOP, and web development fundamentals.',
    difficulty: 'Medium / Hard',
    duration: '15 - 30 Mins',
    questions: '5 - 15 Questions',
    color: '#8b5cf6',
    icon: '💻'
  },
  {
    id: 'hr',
    title: 'HR',
    badge: 'Recruitment & Fit',
    description: 'Evaluate interpersonal communication, organizational alignment, salary expectations, career roadmap, and team collaboration.',
    difficulty: 'Easy / Medium',
    duration: '10 - 20 Mins',
    questions: '5 - 10 Questions',
    color: '#06b6d4',
    icon: '🤝'
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    badge: 'STAR Methodology',
    description: 'Test situation handling, conflict resolution, leadership under pressure, and personal reflection using the STAR framework.',
    difficulty: 'Medium',
    duration: '15 Mins',
    questions: '5 - 10 Questions',
    color: '#ec4899',
    icon: '🗣️'
  },
  {
    id: 'coding',
    title: 'Coding',
    badge: 'Algorithms & Data Structures',
    description: 'Hands-on live problem solving with code editor, language selector, complexity analysis, constraints, and test case execution.',
    difficulty: 'Medium / Hard',
    duration: '20 - 30 Mins',
    questions: '3 - 5 Problems',
    color: '#10b981',
    icon: '⚡'
  },
  {
    id: 'resume',
    title: 'Resume Based',
    badge: 'Project & Experience Deep-dive',
    description: 'Questions customized directly around your uploaded resume, listed skills, tech stack, and key engineering projects.',
    difficulty: 'Medium',
    duration: '15 Mins',
    questions: '5 - 10 Questions',
    color: '#f59e0b',
    icon: '📄'
  },
  {
    id: 'mixed',
    title: 'Mixed',
    badge: 'Full Mock Recruitment Loop',
    description: 'A complete end-to-end recruitment simulation combining CS core technical, coding, HR, and behavioral questions.',
    difficulty: 'Hard',
    duration: '30 Mins',
    questions: '10 - 15 Questions',
    color: '#6366f1',
    icon: '🎯'
  }
];

export default function InterviewCenter({ stats, history, onConfigureTrack, onViewHistory }) {
  const completedCount = stats?.totalCompleted || 0;
  const avgScore = stats?.averageScore || 0;
  const bestScore = stats?.bestScore || 0;
  const improvement = stats?.recentImprovement || '+12%';

  return (
    <div className="glass-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Interview Center & Assessment Hub
          </h1>
          <p style={{ margin: 0 }}>
            Select an interview track to launch your proctored AI interview preparation session.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onViewHistory}>
          📜 View History ({completedCount})
        </button>
      </div>

      {/* Performance Statistics Overview Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{completedCount}</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Interviews Completed
          </span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: avgScore >= 75 ? 'var(--success)' : 'var(--secondary)' }}>
            {avgScore}%
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Average Score
          </span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{bestScore}%</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Best Performance Score
          </span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{improvement}</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Improvement Rate
          </span>
        </div>
      </div>

      {/* Tracks Grid */}
      <div>
        <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>Available Interview Tracks</h3>
        <div className="interview-center-grid">
          {tracks.map((tr) => (
            <div key={tr.id} className="track-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="track-card-badge" style={{ background: `${tr.color}25`, color: tr.color, border: `1px solid ${tr.color}50` }}>
                    {tr.badge}
                  </span>
                  <span style={{ fontSize: '1.8rem' }}>{tr.icon}</span>
                </div>

                <h3 style={{ margin: '0.5rem 0', color: '#fff' }}>{tr.title} Interview</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  {tr.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                  <span>Difficulty: <strong style={{ color: '#fff' }}>{tr.difficulty}</strong></span>
                  <span>Duration: <strong style={{ color: '#fff' }}>{tr.duration}</strong></span>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', background: `linear-gradient(135deg, ${tr.color}, #6d28d9)` }}
                  onClick={() => onConfigureTrack(tr)}
                >
                  Start Interview ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Preview Section */}
      {history && history.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: '#fff' }}>Recent Interview Sessions</h4>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={onViewHistory}>
              View All History
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.slice(0, 3).map((item, idx) => {
              const score = item.finalReport?.overallScore || item.feedback?.overallScore || 70;
              return (
                <div key={item._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{item.type || 'Technical'} Track</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: score >= 75 ? 'var(--success)' : 'var(--accent)' }}>
                    {score}% Score
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
