import React, { useState } from 'react';

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default function StaffProfile({ staffMember, updateStaff, removeStaff, goBack, isAdmin }) {
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editForm, setEditForm] = useState(staffMember || {});
  const [statsForm, setStatsForm] = useState(staffMember ? {
    voice: staffMember.voice,
    messages: staffMember.messages,
    events: staffMember.events,
    mini: staffMember.mini
  } : {});
  const [timeframe, setTimeframe] = useState('WEEKLY');
  const [confirmAction, setConfirmAction] = useState(null);

  if (!staffMember) return null;

  const handleSaveMetadata = () => {
    updateStaff(staffMember.id, { ...staffMember, ...editForm });
    setIsEditingMetadata(false);
  };

  const handleSaveStats = () => {
    updateStaff(staffMember.id, { ...staffMember, ...statsForm });
    setIsEditingStats(false);
  };

  const updateWarning = (type, increment) => {
    const current = staffMember.warnings[type];
    let next = current + increment;
    if (next < 0) next = 0;
    if (next > 3) next = 3;
    
    updateStaff(staffMember.id, {
      ...staffMember,
      warnings: { ...staffMember.warnings, [type]: next }
    });
  };

  const renderProgressBar = (count, type) => (
    <div className="progress-segments">
      {[1, 2, 3].map(i => (
        <div key={i} className={`progress-segment ${i <= count ? 'filled ' + type : ''}`}></div>
      ))}
    </div>
  );

  return (
    <div className="dashboard-scroll" style={{ padding: '32px' }}>
      
      {/* Header */}
      <div className="profile-header-area">
        <div className="profile-back" onClick={goBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </div>
        
        <div style={{ flex: 1 }}>
          {isEditingMetadata ? (
            <div className="metadata-edit-form">
              <input type="text" className="form-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Name" />
              <input type="text" className="form-input" value={editForm.rank} onChange={e => setEditForm({...editForm, rank: e.target.value})} placeholder="Rank" />
              <select className="form-select" value={editForm.division} onChange={e => setEditForm({...editForm, division: e.target.value})}>
                <option value="Department Head">Department Head</option>
                <option value="Appeal Division">Appeal Division</option>
                <option value="Ingame & Discord Moderation Division">Ingame & Discord Moderation Division</option>
                <option value="Training Division">Training Division</option>
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="primary-btn" onClick={handleSaveMetadata}>Save</button>
                <button className="reset-btn" onClick={() => setIsEditingMetadata(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>{staffMember.name}</h1>
                <span className={`badge badge-${staffMember.status.toLowerCase()}`}>
                  {staffMember.status}
                </span>
                {isAdmin && (
                  <button className="icon-btn" onClick={() => setIsEditingMetadata(true)}>
                    <EditIcon />
                  </button>
                )}
              </div>
              <p className="page-subtitle" style={{ fontFamily: 'var(--font-mono)' }}>
                {staffMember.rank} • {Array.isArray(staffMember.division) ? staffMember.division.join(', ') : staffMember.division} • {staffMember.access || 'Staff'}
              </p>
            </>
          )}
        </div>

        {isAdmin && (
          <button className="danger-btn" onClick={() => setConfirmAction({
            title: "Confirm Action",
            message: `Are you sure you want to permanently remove ${staffMember.name}?`,
            onConfirm: () => { removeStaff(staffMember.id); setConfirmAction(null); }
          })}>
            <TrashIcon /> REMOVE
          </button>
        )}
      </div>

      <div className="profile-grid">
        
        {/* Left Column - Stats */}
        <div className="profile-main">
          <div className="stats-card">
            <div className="stats-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 600 }}>
                <ActivityIcon stroke="var(--primary)" /> Activity Stats
              </div>
              <div className="roster-toggles">
                <button className={`toggle-btn ${timeframe === 'WEEKLY' ? 'active' : ''}`} onClick={() => setTimeframe('WEEKLY')}>WEEKLY</button>
                <button className={`toggle-btn ${timeframe === 'MONTHLY' ? 'active' : ''}`} onClick={() => setTimeframe('MONTHLY')}>MONTHLY</button>
              </div>
            </div>
            
            <div className="stats-inputs-grid">
              <div className="stat-input-group">
                <label>VOICE HOURS</label>
                {isEditingStats ? (
                  <input type="text" className="form-input" value={statsForm.voice} onChange={e => setStatsForm({...statsForm, voice: e.target.value})} />
                ) : (
                  <div className="stat-display">{staffMember.voice}</div>
                )}
              </div>
              <div className="stat-input-group">
                <label>MESSAGES</label>
                {isEditingStats ? (
                  <input type="text" className="form-input" value={statsForm.messages} onChange={e => setStatsForm({...statsForm, messages: e.target.value})} />
                ) : (
                  <div className="stat-display">{staffMember.messages}</div>
                )}
              </div>
              <div className="stat-input-group">
                <label>EVENTS</label>
                {isEditingStats ? (
                  <input type="text" className="form-input" value={statsForm.events} onChange={e => setStatsForm({...statsForm, events: e.target.value})} />
                ) : (
                  <div className="stat-display">{staffMember.events}</div>
                )}
              </div>
              <div className="stat-input-group">
                <label>INGAME MODERATION HOURS</label>
                {isEditingStats ? (
                  <input type="text" className="form-input" value={statsForm.mini} onChange={e => setStatsForm({...statsForm, mini: e.target.value})} />
                ) : (
                  <div className="stat-display">{staffMember.mini}</div>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="stats-actions">
                {isEditingStats ? (
                  <>
                    <button className="reset-btn" onClick={() => setIsEditingStats(false)}>CANCEL</button>
                    <button className="primary-btn" onClick={handleSaveStats}>SAVE STATS</button>
                  </>
                ) : (
                  <button className="reset-btn" onClick={() => setIsEditingStats(true)}>EDIT STATS</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Disciplinary & Admin Controls */}
        <div className="profile-sidebar">
          
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> 
              Warnings & Strikes
            </div>
            
            <div className="disciplinary-row">
              <div className="disc-header">
                <span className="disc-label warn-yellow">WARNINGS</span>
                <div className="disc-controls">
                  <span className="disc-count">{staffMember.warnings.written} / 3</span>
                  {isAdmin && (
                    <>
                      <button className="disc-btn" onClick={() => setConfirmAction({
                        title: 'Confirm Action',
                        message: `Remove a Warning from ${staffMember.name}?`,
                        onConfirm: () => { updateWarning('written', -1); setConfirmAction(null); }
                      })}>-</button>
                      <button className="disc-btn" onClick={() => setConfirmAction({
                        title: 'Confirm Action',
                        message: `Issue a Warning to ${staffMember.name}? This is permanently recorded.`,
                        onConfirm: () => { updateWarning('written', 1); setConfirmAction(null); }
                      })}>+</button>
                    </>
                  )}
                </div>
              </div>
              {renderProgressBar(staffMember.warnings.written, 'warn-yellow-bg')}
            </div>

            <div className="disciplinary-row">
              <div className="disc-header">
                <span className="disc-label warn-orange">STRIKES</span>
                <div className="disc-controls">
                  <span className="disc-count">{staffMember.warnings.activity} / 3</span>
                  {isAdmin && (
                    <>
                      <button className="disc-btn" onClick={() => setConfirmAction({
                        title: 'Confirm Action',
                        message: `Remove a Strike from ${staffMember.name}?`,
                        onConfirm: () => { updateWarning('activity', -1); setConfirmAction(null); }
                      })}>-</button>
                      <button className="disc-btn" onClick={() => setConfirmAction({
                        title: 'Confirm Action',
                        message: `Issue a Strike to ${staffMember.name}? This is permanently recorded.`,
                        onConfirm: () => { updateWarning('activity', 1); setConfirmAction(null); }
                      })}>+</button>
                    </>
                  )}
                </div>
              </div>
              {renderProgressBar(staffMember.warnings.activity, 'warn-orange-bg')}
            </div>
          </div>

          {isAdmin && (
            <div className="sidebar-card">
              <div className="sidebar-card-title" style={{ color: 'var(--text-muted)' }}>ADMIN CONTROLS</div>
              
              <div className="control-group">
                <label className="control-label">CHANGE STATUS</label>
                <select 
                  className="form-select" 
                  value={staffMember.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setConfirmAction({
                      title: 'Confirm Action',
                      message: `Change ${staffMember.name}'s status to ${newStatus}?`,
                      onConfirm: () => {
                        updateStaff(staffMember.id, { ...staffMember, status: newStatus });
                        setConfirmAction(null);
                      }
                    });
                  }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="LOA">LOA</option>
                  <option value="ROA">ROA</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>

              <div className="control-group">
                <label className="control-label" style={{ marginTop: '16px' }}>ISSUE WARNING / STRIKE</label>
                <button className="issue-btn issue-yellow" onClick={() => setConfirmAction({
                  title: 'Confirm Action',
                  message: `Issue a Warning to ${staffMember.name}? This is permanently recorded.`,
                  onConfirm: () => { updateWarning('written', 1); setConfirmAction(null); }
                })}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  ISSUE WARNING
                </button>
                <button className="issue-btn issue-orange" onClick={() => setConfirmAction({
                  title: 'Confirm Action',
                  message: `Issue a Strike to ${staffMember.name}? This is permanently recorded.`,
                  onConfirm: () => { updateWarning('activity', 1); setConfirmAction(null); }
                })}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  ISSUE STRIKE
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                {confirmAction.title}
              </div>
              <button className="modal-close" onClick={() => setConfirmAction(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              {confirmAction.message}
            </div>
            <div className="modal-footer">
              <button className="reset-btn" onClick={() => setConfirmAction(null)}>CANCEL</button>
              <button className="primary-btn" style={{ backgroundColor: 'var(--danger)', color: 'white' }} onClick={confirmAction.onConfirm}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
