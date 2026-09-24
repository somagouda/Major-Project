import React, { useState } from 'react';

export default function InterviewHistoryView({ history, onSelectInterview, onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Interview History & Transcripts
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Review all past interview sessions, questions, answers, and feedback</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Center
        </button>
      </div>

      {(!history || history.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No previous interviews completed yet. Start an interview track to record your performance!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#fff' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Track</th>
                <th style={{ padding: '0.75rem' }}>Difficulty</th>
                <th style={{ padding: '0.75rem' }}>Questions</th>
                <th style={{ padding: '0.75rem' }}>Score</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => {
                const score = item.finalReport?.overallScore || item.feedback?.overallScore || 70;
                return (
                  <tr key={item._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-accent">{item.type || 'Technical'}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-primary">{item.difficulty || 'Medium'}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.questionCount || item.questionsList?.length || 5} Questions
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: score >= 75 ? 'var(--success)' : 'var(--accent)' }}>
                      {score}%
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                        ✓ {item.status || 'completed'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedItem(item)}
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Transcript Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              <h3>{selectedItem.type} Interview Transcript</h3>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }} onClick={() => setSelectedItem(null)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {(selectedItem.questionsList && selectedItem.questionsList.length > 0
                ? selectedItem.questionsList
                : selectedItem.chatHistory || []
              ).map((q, idx) => (
                <div key={idx} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                    Q{idx + 1}: {q.questionText || q.message}
                  </div>
                  {q.userAnswer && (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--accent)' }}>Candidate Answer:</strong>
                      <p style={{ margin: 0, color: '#fff' }}>{q.userAnswer}</p>
                    </div>
                  )}
                  {q.evaluation && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                      Score: {q.evaluation.score}% | Technical: {q.evaluation.technicalKnowledge}% | Communication: {q.evaluation.communication}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
