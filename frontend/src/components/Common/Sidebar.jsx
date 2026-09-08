import React from 'react';

// Custom SVG Icons for each sidebar item
const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  assessment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  roadmap: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="8 11 12 15 16 11" />
    </svg>
  ),
  practice: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  resume: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  interviewer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.5 1z" />
    </svg>
  )
};

const menuItems = [
  { id: 'home', label: 'Home Dashboard', icon: Icons.home, color: '#38bdf8', rgb: '56, 189, 248' },
  { id: 'assessment', label: 'Baseline Assessment', icon: Icons.assessment, color: '#f59e0b', rgb: '245, 158, 11' },
  { id: 'roadmap', label: 'Career Roadmap', icon: Icons.roadmap, color: '#eab308', rgb: '234, 179, 8' },
  { id: 'practice', label: 'Daily Practice', icon: Icons.practice, color: '#ec4899', rgb: '236, 72, 153' },
  { id: 'resume', label: 'Resume Analyzer', icon: Icons.resume, color: '#10b981', rgb: '16, 185, 129' },
  { id: 'interviewer', label: 'AI Interviewer', icon: Icons.interviewer, color: '#8b5cf6', rgb: '139, 92, 246' },
  { id: 'analytics', label: 'Telemetry Analytics', icon: Icons.analytics, color: '#6366f1', rgb: '99, 102, 241' },
  { id: 'profile', label: 'Profile Settings', icon: Icons.profile, color: '#a1a1aa', rgb: '161, 161, 170' }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header Brand */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#sidebar-logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6L17 8.5V13.5L12 16L7 13.5V8.5L12 6Z" fill="url(#sidebar-logo-grad-fill)" opacity="0.8"/>
            <path d="M12 9V14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11L12 9L14 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="sidebar-logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent)"/>
                <stop offset="1" stopColor="var(--secondary)"/>
              </linearGradient>
              <linearGradient id="sidebar-logo-grad-fill" x1="7" y1="6" x2="17" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent)"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="sidebar-logo-text">SmartPlacement</span>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className="sidebar-item-wrapper">
              <button
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={isActive ? {
                  position: 'relative',
                  color: item.color,
                  fontWeight: '800',
                  background: `rgba(${item.rgb}, 0.15)`,
                  border: `1px solid rgba(${item.rgb}, 0.35)`,
                  boxShadow: `0 0 15px rgba(${item.rgb}, 0.15)`
                } : {
                  position: 'relative',
                  color: '#a1a1aa'
                }}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    height: '70%',
                    width: '4px',
                    backgroundColor: item.color,
                    borderRadius: '0 4px 4px 0',
                    boxShadow: `0 0 10px ${item.color}`
                  }} />
                )}
                <span className="sidebar-item-icon" style={{ color: item.color }}>{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
              
              {/* Tooltip visible only when collapsed */}
              {collapsed && (
                <div className="sidebar-tooltip">
                  {item.label}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Sidebar Collapse Toggle Footer */}
      <div className="sidebar-footer">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
