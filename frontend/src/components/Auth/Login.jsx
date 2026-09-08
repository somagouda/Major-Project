import React, { useState } from 'react';

export default function Login({ onLoginSuccess, toggleAuthMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide all credentials.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }
      
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '1rem' }}>
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Login to SmartPlacement
        </h2>
        
        {error && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '0.6rem 1rem', marginBottom: '1rem', textAlign: 'center', textTransform: 'none', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          New to the platform?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={toggleAuthMode}>
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
}
