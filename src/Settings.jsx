import React, { useState } from 'react';

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const UnlockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
);

const Settings = ({ isAdmin, setIsAdmin, wipeData }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'modihalalhogya') {
      setIsAdmin(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="dashboard-scroll">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage application configuration and access</p>
      </div>

      <div className="form-card" style={{ maxWidth: '500px' }}>
        <div className="form-header">
          {isAdmin ? <UnlockIcon /> : <LockIcon />}
          Admin Access
        </div>

        {isAdmin ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ color: 'var(--success)', marginBottom: '16px', fontWeight: 'bold' }}>
              ✓ You are logged in as an Administrator.
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              You have full access to add and edit staff members. Players with staff access can't add or edit anything.
            </p>
            <button className="primary-btn" onClick={handleLogout} style={{ backgroundColor: 'var(--danger)' }}>
              LOG OUT
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
              Enter the administrator password to unlock Admin Mode. Players with staff access can't add or edit anything.
            </p>
            
            <div className="form-group">
              <label className="filter-label" style={{ marginBottom: '8px', display: 'block' }}>ADMIN PASSWORD</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: '500' }}>
                {error}
              </div>
            )}
            
            <button type="submit" className="primary-btn">
              LOG IN
            </button>
          </form>
        )}
      </div>

      {isAdmin && (
        <div className="form-card" style={{ maxWidth: '500px', marginTop: '24px' }}>
          <div className="form-header" style={{ color: 'var(--danger)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Danger Zone
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
            Wipe all staff data from the system. This action is permanent and cannot be undone.
          </p>
          <button className="primary-btn" style={{ backgroundColor: 'var(--danger)' }} onClick={() => {
            if (confirm('Are you absolutely sure you want to WIPE ALL DATA?')) wipeData();
          }}>
            WIPE WHOLE DATA
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
