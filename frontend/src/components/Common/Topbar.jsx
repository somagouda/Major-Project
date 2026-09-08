import React from 'react';

const tabTitles = {
  home: 'Home Dashboard',
  assessment: 'Baseline Assessment',
  roadmap: 'Career Roadmap',
  practice: 'Daily Practice Engine',
  resume: 'Resume Analyzer',
  interviewer: 'AI Boardroom Interviewer',
  analytics: 'Preparedness Analytics',
  profile: 'User Profile Settings'
};

export default function Topbar({ activeTab, user, onLogout }) {
  const pageTitle = tabTitles[activeTab] || 'Workspace';
  const firstLetter = user && user.username ? user.username.charAt(0).toUpperCase() : 'S';

  return (
    <header className="topbar">
      {/* Page Title & Breadcrumb */}
      <div className="topbar-title-section">
        <div className="topbar-breadcrumb">SmartPlacement &gt; {pageTitle}</div>
        <h2>{pageTitle}</h2>
      </div>

      {/* User Actions & Profile */}
      <div className="topbar-user-section">
        {user && (
          <div className="topbar-badge-container">
            <span className="topbar-user-profile">
              <span className="topbar-user-avatar">{firstLetter}</span>
              <span className="topbar-user-name">{user.username}</span>
            </span>
            <span className="nav-role" style={{ border: '1px solid rgba(6,182,212,0.3)', padding: '0.25rem 0.75rem', borderRadius: '30px', background: 'rgba(6,182,212,0.05)', color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
              {user.targetRole || 'No Track Selected'}
            </span>
          </div>
        )}

        <button className="topbar-logout" onClick={onLogout} title="Log out of application">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
