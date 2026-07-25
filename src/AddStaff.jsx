import React, { useState } from 'react';

const AddStaffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);

const AddStaff = ({ isAdmin, addStaff }) => {
  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    division: 'Department Head',
    access: 'Staff',
    notes: ''
  });

  if (!isAdmin) {
    return (
      <div className="dashboard-scroll">
        <div className="page-header">
          <h1 className="page-title">Add Staff Member</h1>
          <p className="page-subtitle">Register a new staff member to the system</p>
        </div>
        <div className="form-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 'bold' }}>
            Access Denied
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Players with staff access can't add or edit anything. You must be an administrator. Please log in through the Settings tab.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rank) {
      alert("Name and Rank are required!");
      return;
    }

    addStaff({
      name: formData.name,
      rank: formData.rank,
      division: formData.division,
      status: 'ACTIVE',
      access: formData.access,
      notes: formData.notes,
      voice: '0',
      messages: '0',
      events: '0',
      mini: '0',
      warnings: { written: 0, activity: 0, final: 0 }
    });
  };

  return (
    <div className="dashboard-scroll">
      <div className="page-header">
        <h1 className="page-title">Add Staff Member</h1>
        <p className="page-subtitle">Register a new staff member to the system</p>
      </div>

      <div className="form-card">
        <div className="form-header">
          <AddStaffIcon /> New Staff Record
        </div>
        
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-input" placeholder="Full name..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Rank</label>
            <input type="text" className="form-input" placeholder="e.g. Senior Mod" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Division</label>
            <select className="form-select" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})}>
              <option value="Department Head">Department Head</option>
              <option value="Appeal Division">Appeal Division</option>
              <option value="Ingame & Discord Moderation Division">Ingame & Discord Moderation Division</option>
              <option value="Training Division">Training Division</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Access Level</label>
            <select className="form-select" value={formData.access} onChange={e => setFormData({...formData, access: e.target.value})}>
              <option value="Staff">Staff</option>
              <option value="Assistant Commissioner">Assistant Security Commissioner</option>
              <option value="Divisional Commissioner">Divisional Security Commissioner</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Notes (Optional)</label>
            <textarea className="form-textarea" placeholder="Any notes about this staff member..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="primary-btn">ADD STAFF MEMBER</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
