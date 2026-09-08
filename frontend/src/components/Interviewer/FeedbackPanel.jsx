import React from 'react';

export default function FeedbackPanel({ feedback, onReset }) {
  if (!feedback) return null;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, background: 'linear-gradient(to right, #fff, var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Performance Evaluation
          </h2>
          <p style={{ fontSize: '0.85rem' }}>Post-Interview NLP Diagnostic Summary</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: feedback.overallScore >= 75 ? 'var(--success)' : 'var(--accent)', textShadow: '0 0 10px rgba(236,72,153,0.3)' }}>
            {feedback.overallScore}%
          </div>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Overall Score</span>
        </div>
      </div>

      {/* Why Did I Fail Highlight Box */}
      <div 
        className="glass-card" 
        style={{ 
          borderLeft: '4px solid var(--accent)', 
          background: 'rgba(236, 72, 153, 0.05)', 
          padding: '1.25rem' 
        }}
      >
        <h4 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}>
          ⚠️ Why Did I Fail? Feedback Panel
        </h4>
        <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: '1.5' }}>
          {feedback.whyDidIFail}
        </p>
      </div>

      {/* Score Categories */}
      <div>
        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Evaluation Vector Metrics</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Technical Accuracy & Depth</span>
              <strong style={{ color: '#fff' }}>{feedback.categories.technicalAccuracy}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div 
                className="readiness-bar-inner" 
                style={{ 
                  width: `${feedback.categories.technicalAccuracy}%`, 
                  background: 'linear-gradient(90deg, var(--secondary), var(--primary))' 
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Communication & STAR Structure</span>
              <strong style={{ color: '#fff' }}>{feedback.categories.communication}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div 
                className="readiness-bar-inner" 
                style={{ 
                  width: `${feedback.categories.communication}%`, 
                  background: 'linear-gradient(90deg, var(--secondary), var(--accent))' 
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span>Structural Strategy & Edge Cases</span>
              <strong style={{ color: '#fff' }}>{feedback.categories.structureAndApproach}%</strong>
            </div>
            <div className="readiness-bar-outer" style={{ height: '8px' }}>
              <div 
                className="readiness-bar-inner" 
                style={{ 
                  width: `${feedback.categories.structureAndApproach}%`, 
                  background: 'linear-gradient(90deg, var(--primary), var(--accent))' 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Proctor Integrity Report */}
      {feedback.integrityScore !== undefined && (
        <div className="integrity-report">
          <div className="integrity-header">
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>🛡️ Proctor Integrity Report</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time focus & workspace compliance metrics</p>
            </div>
            <div 
              className={`integrity-score-wheel ${
                feedback.integrityScore >= 85 ? 'high' : feedback.integrityScore >= 60 ? 'medium' : 'low'
              }`}
            >
              {feedback.integrityScore}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Logged Workspace Compliance Warnings:
            </span>
            {feedback.proctorLogs && feedback.proctorLogs.length > 0 ? (
              <div className="integrity-log-list">
                {feedback.proctorLogs.map((log, idx) => (
                  <div key={idx} className="integrity-log-item">
                    <span>⚠️ {log.message}</span>
                    <span className="integrity-log-time">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                style={{ 
                  background: 'rgba(16, 185, 129, 0.05)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: '6px', 
                  padding: '0.5rem 0.75rem', 
                  fontSize: '0.8rem', 
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ✅ Perfect compliance. No integrity violations or suspicious movements detected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actionable Tips */}
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--success)' }}>Recommended Recovery Actions</h4>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {feedback.actionableTips.map((tip, idx) => (
            <li key={idx} style={{ color: '#fff' }}>{tip}</li>
          ))}
        </ul>
      </div>

      <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={onReset}>
        Try Another Interview Track
      </button>
    </div>
  );
}
