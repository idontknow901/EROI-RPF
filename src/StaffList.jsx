import React, { useState } from 'react';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const WarningDots = ({ label, count, colorClass }) => (
  <div className="warning-row">
    <span className={`warning-label ${count > 0 ? colorClass : ''}`}>{label}</span>
    <div className="dots-container">
      {[1, 2, 3].map((dot) => (
        <span key={dot} className={`dot ${dot <= count ? colorClass + '-bg' : ''}`} />
      ))}
    </div>
  </div>
);

const StaffList = ({ isAdmin, staff, onRowClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All Divisions');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [timeframe, setTimeframe] = useState('WEEKLY');

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = divisionFilter === 'All Divisions' || 
                            (Array.isArray(s.division) 
                              ? s.division.some(d => d.toUpperCase() === divisionFilter.toUpperCase())
                              : s.division.toUpperCase() === divisionFilter.toUpperCase());
    const matchesStatus = statusFilter === 'All Statuses' || s.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesDivision && matchesStatus;
  });

  return (
    <div className="dashboard-fixed">
      <div className="roster-header-area">
        <div>
          <h1 className="page-title">Staff Roster</h1>
          <p className="page-subtitle" style={{ fontFamily: 'var(--font-mono)' }}>Click any row to open and edit a staff member</p>
        </div>
        <div className="roster-toggles">
          <button className={`toggle-btn ${timeframe === 'WEEKLY' ? 'active' : ''}`} onClick={() => setTimeframe('WEEKLY')}>WEEKLY</button>
          <button className={`toggle-btn ${timeframe === 'MONTHLY' ? 'active' : ''}`} onClick={() => setTimeframe('MONTHLY')}>MONTHLY</button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 1 }}>
          <label className="filter-label">SEARCH</label>
          <div className="search-input-wrapper">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Name or rank..." 
              className="roster-search" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">DIVISION</label>
            <select 
              className="roster-select"
              value={divisionFilter}
              onChange={e => setDivisionFilter(e.target.value)}
            >
              <option>All Divisions</option>
              <option value="Department Head">Department Head</option>
              <option value="Appeal Division">Appeal Division</option>
              <option value="Ingame & Discord Moderation Division">Ingame & Discord Moderation Division</option>
              <option value="Training Division">Training Division</option>
            </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">STATUS</label>
          <select 
            className="roster-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="LOA">LOA</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>
      </div>

      {isAdmin && (
        <div className="admin-banner-row">
          <EditIcon /> Admin mode - click any row to open the full edit panel for that staff member
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {["Department Head", "Appeal Division", "Ingame & Discord Moderation Division", "Training Division"].map(div => {
          const divStaff = filteredStaff.filter(s => {
            const d = Array.isArray(s.division) ? s.division[0] : s.division;
            return d === div;
          });
          if (divStaff.length === 0) return null;

          return (
            <div key={div} className="table-container division-section">
              <table className="roster-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>NAME</th>
                    <th style={{ width: '15%' }}>DIVISION</th>
                    <th style={{ width: '9%' }}>STATUS</th>
                    <th style={{ width: '8%' }}>VOICE HRS</th>
                    <th style={{ width: '8%' }}>MESSAGES</th>
                    <th style={{ width: '8%' }}>EVENTS</th>
                    <th style={{ width: '10%' }}>INGAME MOD HOURS</th>
                    <th style={{ width: '14%' }}>WARNINGS</th>
                    <th style={{ width: '10%' }}>EDIT</th>
                  </tr>
                </thead>
                <tbody>
                  {divStaff.map((staffItem) => {
                    const mult = timeframe === 'MONTHLY' ? 4 : 1;
                    return (
                      <tr key={staffItem.id} className="roster-row" style={{ cursor: isAdmin ? 'pointer' : 'default' }} onClick={() => isAdmin && onRowClick(staffItem.id)}>
                        <td>
                          <div className="staff-name">{staffItem.name}</div>
                          <div className="staff-rank">{staffItem.rank}</div>
                        </td>
                        <td>
                          <span className="badge badge-division">{Array.isArray(staffItem.division) ? staffItem.division.join(', ') : staffItem.division}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${staffItem.status.toLowerCase()}`}>{staffItem.status}</span>
                        </td>
                        <td className="mono-value">{(Number(staffItem.voice) || 0) * mult}h</td>
                        <td className="mono-value">{(Number(staffItem.messages) || 0) * mult}</td>
                        <td className="mono-value">{(Number(staffItem.events) || 0) * mult}</td>
                        <td className="mono-value">{(Number(staffItem.mini) || 0) * mult}</td>
                        <td>
                        <div className="warnings-block">
                          <WarningDots label="WARNINGS" count={staffItem.warnings.written} colorClass="warn-yellow" />
                          <WarningDots label="STRIKES" count={staffItem.warnings.activity} colorClass="warn-orange" />
                        </div>
                      </td>
                      <td>
                        <button className="row-edit-btn">
                          <EditIcon /> Edit
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffList;
