import React, { useState, useEffect } from 'react';

export default function Home({ user, token, setActiveTab, updateTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyTier, setCompanyTier] = useState('Unicorn'); // FAANG, Unicorn, Fortune500
  const [oddsResult, setOddsResult] = useState({ percent: 0, status: '', color: '' });
  
  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({
    diagnostic: false,
    gapCheck: false,
    calibrator: false,
    mockAudit: false
  });

  // Telemetry activities feed
  const [activities, setActivities] = useState([
    { id: 1, icon: '🎯', text: 'Diagnostic Onboarding initialized for target role.', time: '10 mins ago' },
    { id: 2, icon: '📊', text: 'Telemetry sync: calculated baseline score at 6.5/10.', time: '1 hour ago' },
    { id: 3, icon: '⚡', text: 'Consistency index calculated from session intervals.', time: 'Yesterday' }
  ]);

  // Simulation inputs
  const [duration, setDuration] = useState(30);
  const [simulating, setSimulating] = useState(false);

  // Computed states for checklist-boosted preview displays
  const [displayScore, setDisplayScore] = useState(0);
  const [displayMastery, setDisplayMastery] = useState({});

  // Dynamic Time-Based Greeting
  const greetings = ['Good Morning', 'Good Afternoon', 'Good Evening'];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? greetings[0] : hour < 18 ? greetings[1] : greetings[2];

  const placementTips = [
    "Practice the STAR communication format (Situation, Task, Action, Result) for behavioral interviewer loops.",
    "Review sorting algorithms complexity: QuickSort, MergeSort, and HeapSort are frequent technical interview topics.",
    "Focus on high-level system designs: scaling cache nodes, database indexing, and message queue patterns.",
    "Mock interview feedback: Speak clearly, walk through code structure, and discuss complexity before writing code.",
    "Keep your resume scanner up-to-date: ensure keywords match target job roles (e.g., React, Node, SQL).",
    "Undergo a simulated mock interview in the AI Boardroom to identify speech pacing and delivery gaps."
  ];

  const [tipIndex, setTipIndex] = useState(0);
  const [isTipFading, setIsTipFading] = useState(false);

  // Auto-cycle tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextTip();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => {
    setIsTipFading(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % placementTips.length);
      setIsTipFading(false);
    }, 300);
  };

  const handlePrevTip = () => {
    setIsTipFading(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev - 1 + placementTips.length) % placementTips.length);
      setIsTipFading(false);
    }, 300);
  };

  useEffect(() => {
    fetchSummary();
  }, [updateTrigger]);

  // Sync checklist states based on DB metrics on load
  useEffect(() => {
    if (stats) {
      setCheckedItems({
        diagnostic: user?.isOnboarded || false,
        gapCheck: (stats.practiceHistory && stats.practiceHistory.length > 0) || false,
        calibrator: (stats.practiceHistory && stats.practiceHistory.length > 2) || false,
        mockAudit: checkedItems.mockAudit // keep manual changes
      });
    }
  }, [stats, user]);

  // Compute checklist-boosted visual states dynamically
  useEffect(() => {
    if (!stats) return;
    
    let activeBonus = 0;
    if (checkedItems.diagnostic) activeBonus += 3;
    if (checkedItems.gapCheck) activeBonus += 4;
    if (checkedItems.calibrator) activeBonus += 5;
    if (checkedItems.mockAudit) activeBonus += 8;

    const baseScore = stats.readinessScore;
    const finalScore = Math.min(baseScore + activeBonus, 100);
    setDisplayScore(finalScore);

    const baseMastery = { ...stats.conceptMastery };
    Object.keys(baseMastery).forEach(key => {
      let boost = 0;
      if (checkedItems.diagnostic && key === 'Data Structures') boost += 10;
      if (checkedItems.gapCheck && key === 'Algorithms') boost += 12;
      if (checkedItems.calibrator && key === 'System Design') boost += 15;
      if (checkedItems.mockAudit && (key === 'AI & ML' || key === 'DevOps & Cloud' || key === 'System Design')) boost += 18;
      
      baseMastery[key] = Math.min(baseMastery[key] + boost, 100);
    });
    setDisplayMastery(baseMastery);
  }, [stats, checkedItems]);

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      } else {
        // Fallback mock
        setStats({
          readinessScore: 68,
          conceptMastery: { 
            'Data Structures': 75, 
            'Algorithms': 65,
            'System Design': 55,
            'AI & ML': 45,
            'DevOps & Cloud': 40
          },
          practiceHistory: [1, 2],
          behaviorMetrics: { consistencyRating: 75, procrastinationRisk: 15, burnoutIndicator: 12 }
        });
      }
    } catch (err) {
      setStats({
        readinessScore: 62,
        conceptMastery: { 
          'Data Structures': 70, 
          'Algorithms': 60,
          'System Design': 50,
          'AI & ML': 40,
          'DevOps & Cloud': 35
        },
        practiceHistory: [1],
        behaviorMetrics: { consistencyRating: 68, procrastinationRisk: 20, burnoutIndicator: 10 }
      });
    } finally {
      setLoading(false);
    }
  };

  // Recalculate selection odds whenever company tier or displayScore updates
  useEffect(() => {
    if (!stats) return;
    
    let odds = 0;
    let status = '';
    let color = '';

    if (companyTier === 'FAANG') {
      odds = Math.round(displayScore * 0.9);
      if (odds < 60) {
        status = 'Needs Work: Focus on Advanced DSA & High-Level System Design.';
        color = 'var(--danger)';
      } else if (odds >= 60 && odds < 80) {
        status = 'Borderline: Strong coding, but brush up on System Design edge cases.';
        color = 'var(--warning)';
      } else {
        status = 'Strong Candidate: High likelihood of clearing technical loops!';
        color = 'var(--success)';
      }
    } else if (companyTier === 'Unicorn') {
      odds = Math.min(displayScore + 5, 100);
      if (odds < 65) {
        status = 'Moderate Risk: Focus on Full-Stack frameworks & backend scalability.';
        color = 'var(--danger)';
      } else if (odds >= 65 && odds < 85) {
        status = 'Competitive: Good match. Prepare for product-focused architecture loops.';
        color = 'var(--primary)';
      } else {
        status = 'Excellent Match: Direct fit for fast-paced engineering domains!';
        color = 'var(--success)';
      }
    } else {
      // Fortune 500
      odds = Math.min(displayScore + 15, 100);
      if (odds < 70) {
        status = 'Review Basics: Solidify OOP principles, relational databases, and networks.';
        color = 'var(--warning)';
      } else {
        status = 'Ready to Clear: Great profile. Practice STAR format communication answers.';
        color = 'var(--success)';
      }
    }

    setOddsResult({ percent: odds, status, color });
  }, [companyTier, displayScore, stats]);

  const toggleChecklist = (key) => {
    setCheckedItems(prev => {
      const nextState = !prev[key];
      
      // Add a telemetry log message dynamically to the feed
      const keyLabel = {
        diagnostic: 'Diagnostic Onboarding Check',
        gapCheck: 'Resume Skill Gap Assessment',
        calibrator: 'Daily Calibrator practice target',
        mockAudit: 'Proctored Mock Interview audit'
      }[key];

      const newLog = {
        id: Date.now(),
        icon: nextState ? '✓' : '⚡',
        text: `${keyLabel} ${nextState ? 'marked completed (Preview Score Boosted)' : 'de-selected'}.`,
        time: 'Just now'
      };

      setActivities(prevFeed => [newLog, ...prevFeed.slice(0, 4)]);
      return { ...prev, [key]: nextState };
    });
  };

  const handleSimulateStudy = async (minutes) => {
    setSimulating(true);
    try {
      const response = await fetch('http://localhost:5000/api/analytics/behavior-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studyDuration: minutes,
          procrastinationAdjustment: -5,
          burnoutAdjustment: 3
        })
      });
      const data = await response.json();
      if (response.ok) {
        setStats(prev => ({
          ...prev,
          readinessScore: data.readinessScore,
          behaviorMetrics: data.behaviorMetrics
        }));
        
        // Add log
        const newLog = {
          id: Date.now(),
          icon: '⚡',
          text: `Logged ${minutes} mins study session. Consistency increased!`,
          time: 'Just now'
        };
        setActivities(prev => [newLog, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error(err);
      // Fallback update
      setStats(prev => {
        const nextConsistency = Math.min(prev.behaviorMetrics.consistencyRating + 6, 100);
        const nextProc = Math.max(prev.behaviorMetrics.procrastinationRisk - 4, 0);
        const nextBurn = Math.min(prev.behaviorMetrics.burnoutIndicator + 3, 100);
        return {
          ...prev,
          readinessScore: Math.min(prev.readinessScore + 3, 98),
          behaviorMetrics: {
            consistencyRating: nextConsistency,
            procrastinationRisk: nextProc,
            burnoutIndicator: nextBurn
          }
        };
      });
      const newLog = {
        id: Date.now(),
        icon: '⚡',
        text: `Offline Log: Loged ${minutes}m study. Preview metrics updated!`,
        time: 'Just now'
      };
      setActivities(prev => [newLog, ...prev.slice(0, 4)]);
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateProcrastination = async () => {
    setSimulating(true);
    try {
      const response = await fetch('http://localhost:5000/api/analytics/behavior-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          procrastinationAdjustment: 15,
          burnoutAdjustment: -5
        })
      });
      const data = await response.json();
      if (response.ok) {
        setStats(prev => ({
          ...prev,
          readinessScore: data.readinessScore,
          behaviorMetrics: data.behaviorMetrics
        }));
        
        // Add log
        const newLog = {
          id: Date.now(),
          icon: '⚠️',
          text: `Simulated 1 day idle procrastination. Consistency dropped!`,
          time: 'Just now'
        };
        setActivities(prev => [newLog, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setStats(prev => {
        const nextProc = Math.min(prev.behaviorMetrics.procrastinationRisk + 15, 100);
        const nextConsistency = Math.max(prev.behaviorMetrics.consistencyRating - 8, 0);
        const nextBurn = Math.max(prev.behaviorMetrics.burnoutIndicator - 5, 0);
        return {
          ...prev,
          readinessScore: Math.max(prev.readinessScore - 5, 5),
          behaviorMetrics: {
            consistencyRating: nextConsistency,
            procrastinationRisk: nextProc,
            burnoutIndicator: nextBurn
          }
        };
      });
      const newLog = {
        id: Date.now(),
        icon: '⚠️',
        text: `Offline Log: Idle 1 Day. Consistency dropped!`,
        time: 'Just now'
      };
      setActivities(prev => [newLog, ...prev.slice(0, 4)]);
    } finally {
      setSimulating(false);
    }
  };

  const getThermometerGradient = (p) => {
    if (p < 60) return 'linear-gradient(90deg, #ef4444, #f97316)';
    if (p < 80) return 'linear-gradient(90deg, #f97316, #eab308)';
    return 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)';
  };

  const dailyChallenge = {
    concept: 'Distributed Caching',
    challenge: 'Mitigate cache stampede bottlenecks under high concurrency load.',
    duration: '15 Mins',
    reward: '+5% Readiness Bonus'
  };

  return (
    <div className="glass-container">
      
      {/* 1. Header Banner Card */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(20, 16, 48, 0.95), rgba(10, 8, 25, 0.98))', border: '1.5px solid rgba(139, 92, 246, 0.35)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.15)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.15)' }}>Core Placement Hub</span>
            <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '2.2rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
              {greeting}, {user?.username}!
            </h1>
            <p style={{ marginTop: '0.5rem', fontSize: '1.05rem', color: '#e2e8f0' }}>
              Preparing for <strong style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6, 182, 212, 0.2)' }}>{user?.targetRole || 'Not Selected'}</strong> career track.
            </p>
          </div>
          
          <div style={{ textAlign: 'center', background: 'rgba(4, 3, 10, 0.6)', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', letterSpacing: '0.05em', fontWeight: 600 }}>Current Readiness</span>
            <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#06b6d4', textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
              {loading ? '...' : `${displayScore}%`}
            </span>
          </div>
        </div>

        {/* Tip of the Day dynamic sub-widget */}
        <div className="greeting-tip-box" style={{ background: 'rgba(4, 3, 10, 0.5)', border: '1.5px dashed rgba(139, 92, 246, 0.3)', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'space-between', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <span className="greeting-tip-icon" style={{ fontSize: '1.4rem', flexShrink: 0 }}>💡</span>
            <p className="greeting-tip-text" style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', transition: 'opacity 0.3s ease', opacity: isTipFading ? 0 : 1, lineHeight: '1.5' }}>
              <strong style={{ color: '#38bdf8' }}>Active Prep Hint: </strong>{placementTips[tipIndex]}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button 
              onClick={handlePrevTip} 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justify: 'center', padding: 0 }}
              title="Previous tip"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 'auto' }}>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              onClick={handleNextTip} 
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc', padding: '0 0.8rem', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, transition: 'var(--transition-smooth)' }}
              title="Next placement tip"
            >
              <span>Next Hint</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        
        {/* Left Column: Interactive Success Predictor & Concept Competency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Predictive Success Odds Panel */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🎯 Success Odds Predictor</h3>
              <select 
                className="glass-input" 
                style={{ width: '200px', height: '38px', padding: '0 0.75rem', fontSize: '0.8rem', background: '#090a18', borderRadius: '8px' }}
                value={companyTier}
                onChange={(e) => setCompanyTier(e.target.value)}
              >
                <option value="FAANG">Tier 1 (FAANG / Quant)</option>
                <option value="Unicorn">Unicorn Startups</option>
                <option value="Fortune500">Fortune 500 / Corporates</option>
              </select>
            </div>
            
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Simulate recruitment screening algorithms against your current metrics to project selection probabilities.
            </p>

            {/* Thermometer Gauge Meter */}
            <div style={{ position: 'relative', margin: '1rem 0 2rem 0' }}>
              <div className="odds-thermometer-track">
                <div className="odds-thermometer-fill" style={{ width: `${oddsResult.percent}%`, background: getThermometerGradient(oddsResult.percent) }} />
                <div className="odds-thermometer-marker" style={{ left: `${oddsResult.percent}%` }} />
                <span className="odds-thermometer-value-float" style={{ left: `${oddsResult.percent}%` }}>
                  {oddsResult.percent}%
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>Simulation Feedback:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>{oddsResult.status}</p>
            </div>
          </div>

          {/* Custom SVG Competency Chart Card */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>📈 Topic Competency Ratings</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Your masteries visualized dynamically based on solved practice problems.</p>
            
            {loading ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculating competencies...</p>
            ) : (
              <div className="custom-chart-wrapper">
                {/* Y-Axis labels */}
                <div className="custom-chart-y-axis">
                  <span>100%</span>
                  <span>50%</span>
                  <span>0%</span>
                </div>

                {/* Bars */}
                <div className="custom-chart-bars">
                  {stats && Object.entries(displayMastery).map(([concept, rating]) => (
                    <div className="custom-chart-bar-container" key={concept}>
                      <div 
                        className="custom-chart-bar-pillar" 
                        style={{ height: `${rating}%` }}
                      >
                        <div className="custom-chart-bar-tooltip">{rating}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* X-Axis labels */}
                <div className="custom-chart-x-labels">
                  {stats && Object.keys(displayMastery).map((concept) => (
                    <div className="custom-chart-x-label" key={concept}>
                      {concept.split(' ').map((word, i) => <span key={i} style={{ display: 'block' }}>{word}</span>)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Daily Challenge, Checklist & Telemetry Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Daily Challenge Card */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(139,92,246,0.05))', borderColor: 'rgba(236,72,153,0.2)' }}>
            <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>Daily Target Challenge</span>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.25rem 0' }}>{dailyChallenge.concept}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.5rem 0 1rem 0' }}>
              "{dailyChallenge.challenge}"
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <span>⏱️ Duration: <strong>{dailyChallenge.duration}</strong></span>
              <span>💎 Reward: <strong style={{ color: 'var(--accent)' }}>{dailyChallenge.reward}</strong></span>
            </div>

            <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => setActiveTab('practice')}>
              Accept Challenge & Practice
            </button>
          </div>

          {/* Habits Telemetry & Simulator */}
          <div className="glass-card" style={{ background: 'rgba(139, 92, 246, 0.02)', borderColor: 'rgba(139, 92, 246, 0.15)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#c084fc', marginBottom: '0.75rem' }}>📈 Habits Telemetry & Simulator</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#9ca3af' }}>Log study hours or idle intervals to dynamically alter telemetry ratings in real time.</p>
            
            {stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#e2e8f0' }}>Study Consistency</span>
                    <strong style={{ color: '#34d399' }}>{stats.behaviorMetrics.consistencyRating}/100</strong>
                  </div>
                  <div className="readiness-bar-outer" style={{ height: '6px' }}>
                    <div className="readiness-bar-inner" style={{ width: `${stats.behaviorMetrics.consistencyRating}%`, background: '#34d399' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#e2e8f0' }}>Procrastination Risk</span>
                    <strong style={{ color: '#fbbf24' }}>{stats.behaviorMetrics.procrastinationRisk}/100</strong>
                  </div>
                  <div className="readiness-bar-outer" style={{ height: '6px' }}>
                    <div className="readiness-bar-inner" style={{ width: `${stats.behaviorMetrics.procrastinationRisk}%`, background: '#fbbf24' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#e2e8f0' }}>Burnout Indicators</span>
                    <strong style={{ color: '#f87171' }}>{stats.behaviorMetrics.burnoutIndicator}/100</strong>
                  </div>
                  <div className="readiness-bar-outer" style={{ height: '6px' }}>
                    <div className="readiness-bar-inner" style={{ width: `${stats.behaviorMetrics.burnoutIndicator}%`, background: '#f87171' }} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="number" 
                  className="glass-input" 
                  style={{ width: '80px', height: '36px', padding: '0 0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="5" max="180"
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, height: '36px', background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', fontSize: '0.8rem', padding: '0 0.5rem', fontWeight: 600 }}
                  onClick={() => handleSimulateStudy(duration)}
                  disabled={simulating}
                >
                  Log Study Session
                </button>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ height: '36px', background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600 }}
                onClick={handleSimulateProcrastination}
                disabled={simulating}
              >
                Simulate Procrastination (1 Day Idle)
              </button>
            </div>
          </div>

          {/* Interactive Weekly Checklist */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '0.5rem' }}>🎯 Placement Checklist</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>Complete tasks to unlock immediate Simulated Readiness boosts.</p>
            
            <div className="checklist-container">
              <div 
                className={`interactive-checklist-item ${checkedItems.diagnostic ? 'checked' : ''}`}
                onClick={() => toggleChecklist('diagnostic')}
                style={{
                  background: checkedItems.diagnostic ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.03)',
                  borderColor: checkedItems.diagnostic ? 'rgba(139, 92, 246, 0.45)' : 'rgba(139, 92, 246, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="checklist-left" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="custom-checkbox" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '2px solid #8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    background: checkedItems.diagnostic ? '#8b5cf6' : 'rgba(139, 92, 246, 0.05)',
                    color: checkedItems.diagnostic ? '#ffffff' : 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>✓</span>
                  <span className="checklist-text" style={{ 
                    fontSize: '0.88rem', 
                    fontWeight: 500, 
                    transition: 'var(--transition-smooth)',
                    color: checkedItems.diagnostic ? '#d8b4fe' : '#c084fc',
                    textDecoration: checkedItems.diagnostic ? 'line-through opacity 0.6' : 'none'
                  }}>Diagnostic Onboarding Setup</span>
                </div>
                <span className="checklist-xp" style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(139, 92, 246, 0.15)', 
                  color: '#c084fc', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '30px'
                }}>+15%</span>
              </div>

              <div 
                className={`interactive-checklist-item ${checkedItems.gapCheck ? 'checked' : ''}`}
                onClick={() => toggleChecklist('gapCheck')}
                style={{
                  background: checkedItems.gapCheck ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.03)',
                  borderColor: checkedItems.gapCheck ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="checklist-left" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="custom-checkbox" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '2px solid #06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    background: checkedItems.gapCheck ? '#06b6d4' : 'rgba(6, 182, 212, 0.05)',
                    color: checkedItems.gapCheck ? '#ffffff' : 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>✓</span>
                  <span className="checklist-text" style={{ 
                    fontSize: '0.88rem', 
                    fontWeight: 500, 
                    transition: 'var(--transition-smooth)',
                    color: checkedItems.gapCheck ? '#93c5fd' : '#22d3ee',
                    textDecoration: checkedItems.gapCheck ? 'line-through opacity 0.6' : 'none'
                  }}>Resume Skill Gap Scan</span>
                </div>
                <span className="checklist-xp" style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(6, 182, 212, 0.15)', 
                  color: '#22d3ee', 
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '30px'
                }}>+20%</span>
              </div>

              <div 
                className={`interactive-checklist-item ${checkedItems.calibrator ? 'checked' : ''}`}
                onClick={() => toggleChecklist('calibrator')}
                style={{
                  background: checkedItems.calibrator ? 'rgba(236, 72, 153, 0.12)' : 'rgba(236, 72, 153, 0.03)',
                  borderColor: checkedItems.calibrator ? 'rgba(236, 72, 153, 0.45)' : 'rgba(236, 72, 153, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="checklist-left" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="custom-checkbox" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '2px solid #ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    background: checkedItems.calibrator ? '#ec4899' : 'rgba(236, 72, 153, 0.05)',
                    color: checkedItems.calibrator ? '#ffffff' : 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>✓</span>
                  <span className="checklist-text" style={{ 
                    fontSize: '0.88rem', 
                    fontWeight: 500, 
                    transition: 'var(--transition-smooth)',
                    color: checkedItems.calibrator ? '#fbcfe8' : '#f472b6',
                    textDecoration: checkedItems.calibrator ? 'line-through opacity 0.6' : 'none'
                  }}>Daily Calibrator Practice</span>
                </div>
                <span className="checklist-xp" style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(236, 72, 153, 0.15)', 
                  color: '#f472b6', 
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '30px'
                }}>+25%</span>
              </div>

              <div 
                className={`interactive-checklist-item ${checkedItems.mockAudit ? 'checked' : ''}`}
                onClick={() => toggleChecklist('mockAudit')}
                style={{
                  background: checkedItems.mockAudit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.03)',
                  borderColor: checkedItems.mockAudit ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div className="checklist-left" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="custom-checkbox" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: '2px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    background: checkedItems.mockAudit ? '#10b981' : 'rgba(16, 185, 129, 0.05)',
                    color: checkedItems.mockAudit ? '#ffffff' : 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>✓</span>
                  <span className="checklist-text" style={{ 
                    fontSize: '0.88rem', 
                    fontWeight: 500, 
                    transition: 'var(--transition-smooth)',
                    color: checkedItems.mockAudit ? '#6ee7b7' : '#34d399',
                    textDecoration: checkedItems.mockAudit ? 'line-through opacity 0.6' : 'none'
                  }}>AI Boardroom Mock Session</span>
                </div>
                <span className="checklist-xp" style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(16, 185, 129, 0.15)', 
                  color: '#34d399', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '30px'
                }}>+40%</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry Feed */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>📡 Prep Activity Telemetry</h3>
            <div className="telemetry-feed">
              {activities.map((act) => (
                <div className="telemetry-item" key={act.id}>
                  <div className="telemetry-item-icon">{act.icon}</div>
                  <div className="telemetry-item-content">
                    <div>{act.text}</div>
                    <div className="telemetry-item-time">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Feature quick links */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Platform Features</h2>
      <div className="grid-3">
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('resume')}>
          <h4>📄 Resume Analyzer</h4>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Upload resume, check career alignment gaps, and inspect learning roadmaps.</p>
        </div>
        
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('interviewer')}>
          <h4>🎙️ AI Boardroom</h4>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Experience proctored full-screen mock interviews with speaking Avatars.</p>
        </div>

        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
          <h4>⚙️ Switch Careers</h4>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Realign your target role selection and trigger diagnostic quizzes.</p>
        </div>
      </div>

    </div>
  );
}
