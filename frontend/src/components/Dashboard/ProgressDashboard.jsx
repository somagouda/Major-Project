import React, { useState, useEffect } from 'react';

export default function ProgressDashboard({ token, updateTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simulation input states
  const [duration, setDuration] = useState(30);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [updateTrigger]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error fetching stats.');
      
      setStats(data);
    } catch (err) {
      console.error(err);
      // Fallback Mock Stats
      setStats({
        readinessScore: 65,
        conceptMastery: {
          'Data Structures': 75,
          'Algorithms': 68,
          'System Design': 55,
          'AI & Machine Learning': 50,
          'DevOps & Cloud': 45
        },
        behaviorMetrics: {
          consistencyRating: 72,
          procrastinationRisk: 25,
          burnoutIndicator: 18
        },
        practiceHistory: [],
        studySessions: []
      });
    } finally {
      setLoading(false);
    }
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
          burnoutAdjustment: 3 // Study increases consistency and reduces procrastination, but slightly increases burnout
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      // Update local state with returned values
      setStats(prev => ({
        ...prev,
        readinessScore: data.readinessScore,
        behaviorMetrics: data.behaviorMetrics
      }));
    } catch (err) {
      // Mock local update fallback
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
          burnoutAdjustment: -5 // Slacking off increases procrastination but lowers burnout
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setStats(prev => ({
        ...prev,
        readinessScore: data.readinessScore,
        behaviorMetrics: data.behaviorMetrics
      }));
    } catch (err) {
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
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <p>Loading behavioral telemetry records...</p>
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.readinessScore / 100) * circumference;

  return (
    <div className="glass-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Placement Preparedness & Behavioral Insights
        </h1>
        <p>Real-time analytics evaluating concept competency maps alongside mental metrics.</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Readiness Probability & Concept Competency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Probability Card */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', alignItems: 'center' }}>
            <div className="progress-ring-container">
              <svg width="150" height="150">
                {/* Background Track */}
                <circle 
                  cx="75" cy="75" r={radius} 
                  stroke="rgba(255, 255, 255, 0.04)" strokeWidth="10" fill="transparent" 
                />
                {/* Active Indicator */}
                <circle 
                  cx="75" cy="75" r={radius} 
                  stroke="url(#gradientGlow)" strokeWidth="12" fill="transparent" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
                
                <defs>
                  <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--secondary)" />
                    <stop offset="50%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-text">
                <div className="progress-percent">{stats.readinessScore}%</div>
                <div className="progress-label">Readiness</div>
              </div>
            </div>

            <div>
              <h3>Placement Readiness Probability</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                This index represents your probability of clearing technical recruitment filters, calculated using concept mastery and behavioral parameters.
              </p>
              <div className="readiness-bar-outer">
                <div className="readiness-bar-inner" style={{ width: `${stats.readinessScore}%` }} />
              </div>
            </div>
          </div>

          {/* Concept Mastery List */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Topic Competency Ratings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(stats.conceptMastery).map(([concept, rating]) => (
                <div key={concept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>{concept}</span>
                    <strong style={{ color: '#fff' }}>{rating}%</strong>
                  </div>
                  <div className="readiness-bar-outer" style={{ height: '8px' }}>
                    <div 
                      className="readiness-bar-inner" 
                      style={{ 
                        width: `${rating}%`, 
                        background: 'linear-gradient(90deg, var(--secondary), var(--primary))' 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Behavioral Metrics & Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dial Gauges */}
          <div className="glass-card">
            <h3>Behavioral Indicators</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>Study habit metrics monitored by practice consistency and idle intervals.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Consistency */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Study Consistency Score</span>
                  <strong style={{ color: 'var(--success)' }}>{stats.behaviorMetrics.consistencyRating}/100</strong>
                </div>
                <div className="readiness-bar-outer" style={{ height: '8px' }}>
                  <div 
                    className="readiness-bar-inner" 
                    style={{ 
                      width: `${stats.behaviorMetrics.consistencyRating}%`, 
                      background: 'var(--success)' 
                    }} 
                  />
                </div>
              </div>

              {/* Procrastination */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Procrastination Risk Index</span>
                  <strong style={{ color: 'var(--warning)' }}>{stats.behaviorMetrics.procrastinationRisk}/100</strong>
                </div>
                <div className="readiness-bar-outer" style={{ height: '8px' }}>
                  <div 
                    className="readiness-bar-inner" 
                    style={{ 
                      width: `${stats.behaviorMetrics.procrastinationRisk}%`, 
                      background: 'var(--warning)' 
                    }} 
                  />
                </div>
              </div>

              {/* Burnout */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Burnout Indicator Flag</span>
                  <strong style={{ color: 'var(--danger)' }}>{stats.behaviorMetrics.burnoutIndicator}/100</strong>
                </div>
                <div className="readiness-bar-outer" style={{ height: '8px' }}>
                  <div 
                    className="readiness-bar-inner" 
                    style={{ 
                      width: `${stats.behaviorMetrics.burnoutIndicator}%`, 
                      background: 'var(--danger)' 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Panel */}
          <div className="glass-card" style={{ background: 'rgba(236,72,153,0.03)', borderColor: 'rgba(236,72,153,0.15)' }}>
            <h3 style={{ color: 'var(--accent)' }}>Behavioral Simulator</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              Simulate actions to see how habits dynamically alter your calculated recruitment success index in real time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="number" 
                  className="glass-input" 
                  style={{ width: '80px', height: '40px' }}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="5" max="180"
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, height: '40px', background: 'rgba(16,185,129,0.15)', borderColor: 'var(--success)' }}
                  onClick={() => handleSimulateStudy(duration)}
                  disabled={simulating}
                >
                  Log Study Session (Mins)
                </button>
              </div>

              <button 
                className="btn btn-secondary" 
                style={{ height: '40px', background: 'rgba(245,158,11,0.15)', borderColor: 'var(--warning)' }}
                onClick={handleSimulateProcrastination}
                disabled={simulating}
              >
                Simulate Procrastination Gap (1 Day Idle)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
