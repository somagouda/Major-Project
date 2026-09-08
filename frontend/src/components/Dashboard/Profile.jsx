import React, { useState } from 'react';

export default function Profile({ user, token, onProfileUpdate, triggerAssessment }) {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Development');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    'Software Development',
    'AI/ML',
    'DevOps',
    'Cloud',
    'Full Stack'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Username and email are required.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Mock submit to onboarding endpoint to update role on server
      const response = await fetch('http://localhost:5000/api/auth/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          targetRole, 
          baselineScore: user?.baselineScore || 5.0 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile.');

      // Sync local App state profile data
      onProfileUpdate({
        ...user,
        username,
        email,
        targetRole: data.targetRole,
        isOnboarded: data.isOnboarded
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      // Local fallback
      onProfileUpdate({
        ...user,
        username,
        email,
        targetRole
      });
      setSuccess('Profile details cached locally.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeAndAssess = (selectedRole) => {
    setTargetRole(selectedRole);
  };

  return (
    <div className="glass-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Edit User Profile
        </h2>

        {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem 1rem', marginBottom: '1rem', borderRadius: '8px' }}>{error}</div>}
        {success && <div className="badge badge-success" style={{ display: 'block', padding: '0.5rem 1rem', marginBottom: '1rem', borderRadius: '8px' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Username</label>
            <input 
              type="text" 
              className="glass-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              className="glass-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Target Career Path</label>
            <select 
              className="glass-input" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ background: '#0a0915' }}
            >
              {roles.map((r) => (
                <option key={r} value={r} style={{ background: '#0a0915', color: '#fff' }}>{r}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? 'Saving details...' : 'Save Profile Details'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Update Target Career Path</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Select a role below to change your career focus, then click 'Save Profile Details' above. To take the diagnostic quiz for this new track, go to the <strong>Baseline Assessment</strong> tab.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {roles.map((roleOption) => (
              <button
                key={roleOption}
                className="btn btn-secondary"
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.8rem',
                  borderColor: user?.targetRole === roleOption ? 'var(--accent)' : 'var(--glass-border)',
                  background: user?.targetRole === roleOption ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.03)'
                }}
                onClick={() => handleRoleChangeAndAssess(roleOption)}
              >
                {roleOption}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
