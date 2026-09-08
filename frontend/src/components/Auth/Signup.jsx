import React, { useState } from 'react';

export default function Signup({ onSignupSuccess, toggleAuthMode }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all inputs.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      onSignupSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '1rem' }}>
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create SmartPlacement Account
        </h2>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '0.6rem 1rem', marginBottom: '1rem', textAlign: 'center', textTransform: 'none', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Username</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. johndoe" 
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
              placeholder="name@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--secondary), #0891b2)', border: 'none' }} disabled={loading}>
            {loading ? 'Registering Account...' : 'Get Started'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600 }} onClick={toggleAuthMode}>
            Sign In Here
          </span>
        </p>
      </div>
    </div>
  );
}
