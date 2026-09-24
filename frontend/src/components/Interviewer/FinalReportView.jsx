import React from 'react';

export default function FinalReportView({ report, session, onReturnToCenter }) {
  if (!report) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Compiling Interview Performance Report...</h3>
      </div>
    );
  }

  const categories = report.categories || {
    technicalKnowledge: 75,
    communication: 70,
    problemSolving: 78,
    relevance: 80,
    clarity: 72,
    completeness: 70
  };

  const overall = report.overallScore || 75;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Report Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-accent">{session?.type || 'Technical'} Track Report</span>
            <span className="badge badge-primary">{session?.difficulty || 'Medium'}</span>
          </div>
          <h1 style={{ margin: 0, background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Final Interview Evaluation Report
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>AI Diagnostics evaluating overall candidate performance vectors</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: overall >= 75 ? 'var(--success)' : 'var(--accent)', textShadow: '0 0 15px rgba(139,92,246,0.3)' }}>
            {overall}/100
          </div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Overall Score
          </span>
        </div>
      </div>

      {/* 6 Category Vector Ratings */}
      <div>
        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Evaluation Performance Vectors</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Technical Knowledge</span>
              <strong style={{ color: '#fff' }}>{categories.technicalKnowledge}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.technicalKnowledge}%`, background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Communication & Fluency</span>
              <strong style={{ color: '#fff' }}>{categories.communication}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.communication}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Problem Solving & Logic</span>
              <strong style={{ color: '#fff' }}>{categories.problemSolving}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.problemSolving}%`, background: 'linear-gradient(90deg, var(--accent), var(--secondary))' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Answer Relevance</span>
              <strong style={{ color: '#fff' }}>{categories.relevance}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.relevance}%`, background: 'var(--success)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Answer Clarity</span>
              <strong style={{ color: '#fff' }}>{categories.clarity}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.clarity}%`, background: 'var(--secondary)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Completeness & Depth</span>
              <strong style={{ color: '#fff' }}>{categories.completeness}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div className="readiness-bar-inner" style={{ width: `${categories.completeness}%`, background: 'var(--warning)' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Strengths & Weak Areas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Strengths */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            💪 Core Strengths
          </h4>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#fff' }}>
            {(report.strengths || ["Strong technical foundation", "Good project understanding"]).map((str, idx) => (
              <li key={idx}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)', background: 'rgba(236, 72, 153, 0.05)' }}>
          <h4 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            ⚠️ Areas for Improvement
          </h4>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#fff' }}>
            {(report.weakAreas || ["Communication clarity under time pressure", "Deep dive into edge case handling"]).map((weak, idx) => (
              <li key={idx}>{weak}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Practice */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))' }}>
        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          🎯 Recommended Targeted Practice
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {(report.recommendedPractice || ["SQL Joins", "Database Normalization", "System Architecture"]).map((rec, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
              ⚡ {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Return Control */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem' }} onClick={onReturnToCenter}>
          Return to Interview Center
        </button>
      </div>
    </div>
  );
}
