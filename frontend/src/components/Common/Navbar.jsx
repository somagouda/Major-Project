import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <div className="navbar-floating">
      <div className="navbar-inner">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6L17 8.5V13.5L12 16L7 13.5V8.5L12 6Z" fill="url(#logo-gradient-fill)" opacity="0.8"/>
            <path d="M12 9V14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11L12 9L14 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent)"/>
                <stop offset="1" stopColor="var(--secondary)"/>
              </linearGradient>
              <linearGradient id="logo-gradient-fill" x1="7" y1="6" x2="17" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent)"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>SmartPlacement</div>
        </div>
        
        {user && (
          <ul className="nav-links">
            <li 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </li>
            <li 
              className={`nav-item ${activeTab === 'assessment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessment')}
            >
              Baseline Assessment
            </li>
            <li 
              className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              Career Roadmap
            </li>
            <li 
              className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              Daily Practice
            </li>
            <li 
              className={`nav-item ${activeTab === 'resume' ? 'active' : ''}`}
              onClick={() => setActiveTab('resume')}
            >
              Resume Analyzer
            </li>
            <li 
              className={`nav-item ${activeTab === 'interviewer' ? 'active' : ''}`}
              onClick={() => setActiveTab('interviewer')}
            >
              AI Interviewer
            </li>
            <li 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </li>
            <li 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
          </ul>
        )}

        <div className="nav-user">
          {user ? (
            <>
              <span className="nav-role">{user.targetRole || 'Not Selected'}</span>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{user.username}</span>
              <span className="nav-logout" onClick={onLogout}>Logout</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Login to Prepare</span>
          )}
        </div>
      </div>
    </div>
  );
}
