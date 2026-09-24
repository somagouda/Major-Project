import React, { useState, useEffect } from 'react';
import Sidebar from './components/Common/Sidebar';
import Topbar from './components/Common/Topbar';
import InteractiveBackground from './components/Common/InteractiveBackground';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import BaselineAssessment from './components/Dashboard/BaselineAssessment';
import DailyPractice from './components/PracticeEngine/DailyPractice';
import ResumeParser from './components/Interviewer/ResumeParser';
import MockInterviewer from './components/Interviewer/MockInterviewer';
import ProgressDashboard from './components/Dashboard/ProgressDashboard';
import Home from './components/Dashboard/Home';
import Profile from './components/Dashboard/Profile';
import Roadmap from './components/Dashboard/Roadmap';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('smartplacement_token') || null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [activeTab, setActiveTab] = useState('home');
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('smartplacement_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('smartplacement_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Sync profile details on start/token update
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [token]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Session expired.');
      setUser(data);
      setActiveTab('home');
    } catch (err) {
      console.warn('API connection failed. Bootstrapping mock user credentials.');
      // Offline fallback profile
      setUser({
        username: 'Sandbox Student',
        email: 'sandbox@university.edu',
        targetRole: 'Software Development',
        isOnboarded: true,
        baselineScore: 6.5
      });
      setActiveTab('home');
      showToast('Offline Mode: Connected to local mock datasets.', 'error');
    }
  };

  const handleLoginSuccess = (newToken, userData) => {
    localStorage.setItem('smartplacement_token', newToken);
    setToken(newToken);
    setUser(userData);
    showToast(`Welcome back, ${userData.username}!`);
  };

  const handleSignupSuccess = (newToken, userData) => {
    localStorage.setItem('smartplacement_token', newToken);
    setToken(newToken);
    setUser(userData);
    showToast(`Account created! Welcome, ${userData.username}`);
  };

  const handleOnboardComplete = (updatedUser) => {
    setUser(updatedUser);
    setActiveTab('home');
    showToast('Career profile aligned! Workspace generated.');
    triggerUpdate();
  };

  const handleLogout = () => {
    localStorage.removeItem('smartplacement_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.');
  };

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const handleGapChecklistUpdated = () => {
    showToast('Checklist updated! Re-evaluating Placement readiness.');
    triggerUpdate();
  };

  // Render components depending on authorization and onboarding states
  const renderContent = () => {
    if (!token || !user) {
      return authMode === 'login' 
        ? <Login onLoginSuccess={handleLoginSuccess} toggleAuthMode={() => setAuthMode('signup')} />
        : <Signup onSignupSuccess={handleSignupSuccess} toggleAuthMode={() => setAuthMode('login')} />;
    }

    if (activeTab === 'assessment') {
      return (
        <BaselineAssessment 
          token={token} 
          onOnboardComplete={handleOnboardComplete} 
          preselectedRole={user.targetRole && user.targetRole !== 'None' ? user.targetRole : ''}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home 
            user={user} 
            token={token} 
            setActiveTab={setActiveTab} 
            updateTrigger={updateTrigger} 
          />
        );
      case 'roadmap':
        return (
          <Roadmap 
            user={user} 
            setActiveTab={setActiveTab}
          />
        );
      case 'practice':
        return (
          <DailyPractice 
            user={user} 
            token={token} 
            onActionTriggered={triggerUpdate} 
          />
        );
      case 'resume':
        return (
          <div className="glass-container">
            <ResumeParser 
              user={user} 
              token={token} 
              onGapsUpdated={handleGapChecklistUpdated} 
            />
          </div>
        );
      case 'interviewer':
        return (
          <MockInterviewer 
            user={user} 
            token={token} 
            onActionTriggered={triggerUpdate} 
          />
        );
      case 'analytics':
        return (
          <div className="grid-2 glass-container">
            <ProgressDashboard token={token} updateTrigger={updateTrigger} />
          </div>
        );
      case 'profile':
        return (
          <Profile 
            user={user} 
            token={token} 
            onProfileUpdate={(updatedUser) => {
              setUser(updatedUser);
              showToast('Profile credentials synced.');
            }}
            triggerAssessment={(selectedRole) => {
              setUser(prev => ({ 
                ...prev, 
                targetRole: selectedRole, 
                isOnboarded: false 
              }));
              setActiveTab('assessment');
              showToast(`Preparing assessment for ${selectedRole}...`);
            }}
          />
        );
      default:
        return <div style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}>Tab Not Found</div>;
    }
  };

  if (!token || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-dark)' }}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Interactive canvas particle connections */}
      <InteractiveBackground />

      {/* Background drifting glow orbs */}
      <div className="bg-glow-orb-1"></div>
      <div className="bg-glow-orb-2"></div>
      <div className="bg-glow-orb-3"></div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="main-content">
        <Topbar 
          activeTab={activeTab} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main className="page-content">
          {renderContent()}
        </main>
      </div>

      {/* Floating Status Notification Alerts */}
      {toast && (
        <div className={`toast-msg ${toast.type}`}>
          <span>{toast.type === 'success' ? '⚡' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
