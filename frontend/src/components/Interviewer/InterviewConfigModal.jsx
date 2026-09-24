import React, { useState } from 'react';

const availableTopics = [
  'Java', 'Python', 'C++', 'JavaScript', 'DSA', 'OOP', 
  'DBMS', 'SQL', 'Operating Systems', 'Computer Networks', 
  'Computer Architecture', 'Web Development'
];

export default function InterviewConfigModal({ track, onClose, onStart }) {
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [selectedTopics, setSelectedTopics] = useState(['Java', 'DSA', 'DBMS', 'SQL']);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = () => {
    onStart({
      type: track ? track.title : 'Technical',
      difficulty,
      questionCount,
      durationMinutes,
      topics: selectedTopics
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Configure {track ? track.title : 'Technical'} Interview
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Customize duration, questions, difficulty and topics</p>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fff' }}>
            Select Difficulty Level:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                className={`btn ${difficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.6rem' }}
                onClick={() => setDifficulty(diff)}
              >
                {diff === 'Easy' ? '🌱 Easy' : diff === 'Medium' ? '⚡ Medium' : '🔥 Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fff' }}>
            Number of Questions:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                className={`btn ${questionCount === cnt ? 'btn-accent' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.6rem' }}
                onClick={() => setQuestionCount(cnt)}
              >
                {cnt} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fff' }}>
            Estimated Duration:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[10, 20, 30].map((dur) => (
              <button
                key={dur}
                className={`btn ${durationMinutes === dur ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.6rem' }}
                onClick={() => setDurationMinutes(dur)}
              >
                ⏱️ {dur} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Technical Topics (For Technical / Mixed tracks) */}
        {(track?.title === 'Technical' || track?.title === 'Mixed' || !track) && (
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fff' }}>
              Select Technical Topics:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableTopics.map((top) => {
                const isSel = selectedTopics.includes(top);
                return (
                  <span
                    key={top}
                    className={`topic-chip ${isSel ? 'selected' : ''}`}
                    onClick={() => toggleTopic(top)}
                  >
                    {isSel ? '✓ ' : '+ '}{top}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Start Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={handleSubmit}>
            🚀 Start {track ? track.title : 'Technical'} Interview
          </button>
        </div>
      </div>
    </div>
  );
}
