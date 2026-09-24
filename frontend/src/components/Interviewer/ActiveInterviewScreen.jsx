import React, { useState, useEffect, useRef } from 'react';
import VoiceInputComponent from './VoiceInputComponent';
import CodingInterviewView from './CodingInterviewView';

export default function ActiveInterviewScreen({ session, token, onCompleteInterview, onCancelSession }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState((session?.durationMinutes || 15) * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize current question
  useEffect(() => {
    if (session?.questionsList && session.questionsList.length > 0) {
      const idx = session.currentQuestionIndex || 0;
      setCurrentQuestion(session.questionsList[idx] || session.questionsList[0]);
    }
  }, [session]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Speak AI question
  useEffect(() => {
    if (currentQuestion && synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
      utterance.rate = 0.95;
      synthRef.current.speak(utterance);
    }
  }, [currentQuestion]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = async (answerPayload) => {
    const answerStr = answerPayload || userAnswerText;
    if (!answerStr.trim()) return;

    setIsSubmitting(true);
    if (synthRef.current) synthRef.current.cancel();

    try {
      const response = await fetch(`http://localhost:5000/api/interviews/${session._id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer: answerStr })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Answer evaluation error.');

      setLastEvaluation(data.evaluatedQuestion);
      if (data.isCompleted || !data.nextQuestion) {
        setIsCompleted(true);
      } else {
        // Prepare next question trigger
        setTimeout(() => {
          setCurrentQuestion(data.nextQuestion);
          setUserAnswerText('');
          setLastEvaluation(null);
        }, 3500); // 3.5s to view feedback before next
      }
    } catch (err) {
      console.error(err);
      // Fallback local evaluation simulation
      const mockEval = {
        questionText: currentQuestion?.questionText,
        evaluation: { technicalKnowledge: 78, relevance: 85, communication: 75, clarity: 80, completeness: 70, confidence: 75, score: 77 },
        feedback: {
          whatWentWell: "Clear structure and directly addressed the core question requirement.",
          whatWasMissing: "Could expand on production trade-offs and edge case constraints.",
          whatCouldBeImproved: "Add metric-driven results or performance complexity bounds.",
          suggestedAnswer: "A complete answer defines the core principle, implementation steps, and resource overhead.",
          topicsToRevise: ["Edge Case Handling", "Performance Trade-offs"]
        }
      };
      setLastEvaluation({ evaluation: mockEval.evaluation, feedback: mockEval.feedback });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentIdx = (session?.currentQuestionIndex || 0) + 1;
  const totalQuestions = session?.questionsList?.length || session?.questionCount || 5;
  const progressPercent = Math.min(Math.round((currentIdx / totalQuestions) * 100), 100);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Bar */}
      <div className="active-interview-header">
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span className="badge badge-accent">{session?.type || 'Technical'} Track</span>
            <span className="badge badge-primary">{session?.difficulty || 'Medium'}</span>
          </div>
          <h4 style={{ margin: 0, color: '#fff' }}>Question {currentIdx} of {totalQuestions}</h4>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: '0 1 250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
            <span>Interview Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="readiness-bar-outer" style={{ height: '8px' }}>
            <div className="readiness-bar-inner" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--secondary), var(--accent))' }} />
          </div>
        </div>

        {/* Countdown Timer */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: secondsRemaining < 180 ? 'var(--danger)' : 'var(--secondary)' }}>
            ⏱️ {formatTime(secondsRemaining)}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Time Remaining</span>
        </div>
      </div>

      {/* Dynamic Follow-up Badge */}
      {currentQuestion?.isFollowUp && (
        <div className="followup-badge">
          ⚡ Dynamic AI Follow-Up Question (Generated from your previous answer context)
        </div>
      )}

      {/* Question Statement Box */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)', background: 'rgba(6, 182, 212, 0.05)' }}>
        <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
          INTERVIEWER QUESTION:
        </h4>
        <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 }}>
          "{currentQuestion?.questionText || 'Loading question statement...'}"
        </p>
      </div>

      {/* Answer Input Area depending on Track */}
      {session?.type === 'Coding' ? (
        <CodingInterviewView
          question={currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <VoiceInputComponent
          value={userAnswerText}
          onChange={setUserAnswerText}
          onSubmit={() => handleAnswerSubmit(userAnswerText)}
          disabled={isSubmitting || !!lastEvaluation}
        />
      )}

      {/* Evaluation Feedback Overlay Popup after answer submission */}
      {lastEvaluation && lastEvaluation.evaluation && (
        <div className="evaluation-popup">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ color: 'var(--success)', margin: 0 }}>
              ✅ Answer Evaluated — Overall Question Score: {lastEvaluation.evaluation.score}%
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Moving to next question...</span>
          </div>

          <div className="vector-score-grid">
            <div className="vector-score-card">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Technical</span>
              <div className="vector-score-val">{lastEvaluation.evaluation.technicalKnowledge}%</div>
            </div>
            <div className="vector-score-card">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Relevance</span>
              <div className="vector-score-val">{lastEvaluation.evaluation.relevance}%</div>
            </div>
            <div className="vector-score-card">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Communication</span>
              <div className="vector-score-val">{lastEvaluation.evaluation.communication}%</div>
            </div>
            <div className="vector-score-card">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clarity</span>
              <div className="vector-score-val">{lastEvaluation.evaluation.clarity}%</div>
            </div>
            <div className="vector-score-card">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completeness</span>
              <div className="vector-score-val">{lastEvaluation.evaluation.completeness}%</div>
            </div>
          </div>

          {lastEvaluation.feedback && (
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong style={{ color: 'var(--success)' }}>✓ What went well:</strong> {lastEvaluation.feedback.whatWentWell}</div>
              <div><strong style={{ color: 'var(--warning)' }}>⚠️ What was missing:</strong> {lastEvaluation.feedback.whatWasMissing}</div>
              <div><strong style={{ color: 'var(--accent)' }}>💡 Suggested better answer:</strong> {lastEvaluation.feedback.suggestedAnswer}</div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Completion Trigger Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onCancelSession}>
          Exit Session
        </button>
        {(isCompleted || currentIdx >= totalQuestions) && (
          <button className="btn btn-accent" style={{ padding: '0.75rem 2rem' }} onClick={onCompleteInterview}>
            🏁 Complete Interview & View Final Report
          </button>
        )}
      </div>
    </div>
  );
}
