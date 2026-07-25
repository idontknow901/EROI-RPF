import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './index.css';
import rpfLogo from './assets/rpf-logo.png';
import AddStaff from './AddStaff';
import Settings from './Settings';
import StaffList from './StaffList';
import StaffProfile from './StaffProfile';

// SVG Icons
const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
);
const ExitIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
const StaffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const AddStaffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const defaultStaffData = [];

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rpf_theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('rpf_admin') === 'true';
  });
  const [activeStaffId, setActiveStaffId] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    return localStorage.getItem('rpf_sidebar') === 'true';
  });
  const [loading, setLoading] = useState(true);

  const [staff, setStaff] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rpf_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rpf_admin', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('rpf_sidebar', sidebarExpanded);
  }, [sidebarExpanded]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'staff'), (snapshot) => {
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setStaff(staffData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching staff data: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // One-time migration from localStorage to Firebase
  useEffect(() => {
    const migrateData = async () => {
      const legacyData = localStorage.getItem('rpf_staff_data');
      if (legacyData) {
        try {
          const parsedData = JSON.parse(legacyData);
          if (parsedData && parsedData.length > 0) {
            console.log("Migrating legacy data to Firebase...");
            for (const item of parsedData) {
              // Remove the old numeric ID so Firebase can generate a new one
              const { id, ...dataWithoutId } = item;
              await addDoc(collection(db, 'staff'), dataWithoutId);
            }
            console.log("Migration complete!");
          }
        } catch (error) {
          console.error("Error migrating data:", error);
        } finally {
          // Remove the local storage item so we don't migrate again
          localStorage.removeItem('rpf_staff_data');
        }
      }
    };
    
    migrateData();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const updateStaff = async (id, updatedData) => {
    try {
      const docRef = doc(db, 'staff', String(id));
      const { id: docId, ...dataToUpdate } = updatedData;
      await updateDoc(docRef, dataToUpdate);
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to update: " + error.message);
    }
  };

  const removeStaff = async (id) => {
    try {
      await deleteDoc(doc(db, 'staff', String(id)));
      setActiveTab('staff-list');
      setActiveStaffId(null);
    } catch (error) {
      console.error("Error removing staff:", error);
      alert("Failed to remove: " + error.message);
    }
  };

  const addStaffMember = async (newStaff) => {
    try {
      const staffWithMeta = {
        ...newStaff,
        createdAt: Date.now()
      };
      await addDoc(collection(db, 'staff'), staffWithMeta);
      setActiveTab('staff-list');
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff! " + error.message + " (Check your Firebase Security Rules!)");
    }
  };

  const handleWipeData = async () => {
    if (!isAdmin) return;
    try {
      const snapshot = await getDocs(collection(db, 'staff'));
      const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'staff', document.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error wiping data:", error);
    }
  };

  const handleRowClick = (id) => {
    setActiveStaffId(id);
    setActiveTab('staff-profile');
  };

  // Dashboard Metrics
  const totalStaff = staff.length;
  const activeCount = staff.filter(s => s.status.toUpperCase() === 'ACTIVE').length;
  const loaCount = staff.filter(s => s.status.toUpperCase() === 'LOA').length;
  const roaCount = staff.filter(s => s.status.toUpperCase() === 'ROA').length;
  const suspendedCount = staff.filter(s => s.status.toUpperCase() === 'SUSPENDED').length;
  const terminatedCount = staff.filter(s => s.status.toUpperCase() === 'TERMINATED').length;

  const divDeptHead = staff.filter(s => {
    const d = Array.isArray(s.division) ? s.division[0] : s.division;
    return d === 'Department Head';
  }).length;
  const divAppeal = staff.filter(s => {
    const d = Array.isArray(s.division) ? s.division[0] : s.division;
    return d === 'Appeal Division';
  }).length;
  const divIngame = staff.filter(s => {
    const d = Array.isArray(s.division) ? s.division[0] : s.division;
    return d === 'Ingame & Discord Moderation Division';
  }).length;
  const divTraining = staff.filter(s => {
    const d = Array.isArray(s.division) ? s.division[0] : s.division;
    return d === 'Training Division';
  }).length;

  let warnCount = 0, strikeCount = 0;
  staff.forEach(s => {
    warnCount += s.warnings?.written || 0;
    strikeCount += s.warnings?.activity || 0;
  });

  // Top performers
  const sortedByVoice = [...staff].sort((a, b) => parseInt(b.voice || 0) - parseInt(a.voice || 0)).slice(0, 3);
  const sortedByEvents = [...staff].sort((a, b) => parseInt(b.events || 0) - parseInt(a.events || 0)).slice(0, 3);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo-box" onClick={() => setSidebarExpanded(!sidebarExpanded)} style={{ cursor: 'pointer' }} title="Toggle Sidebar">
            <img src={rpfLogo} alt="RPF Logo" className="logo-image" />
          </div>
          <div className="brand-info">
            <span className="brand-title">RPF Tracker</span>
            <span className="brand-subtitle">Staff Management</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
            <DashboardIcon /> <span className="nav-link-text">Dashboard</span>
          </a>
          <a href="#" className={`nav-link ${activeTab === 'staff-list' || activeTab === 'staff-profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('staff-list'); }}>
            <StaffIcon /> <span className="nav-link-text">Staff List</span>
          </a>
          <a href="#" className={`nav-link ${activeTab === 'add-staff' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('add-staff'); }}>
            <AddStaffIcon /> <span className="nav-link-text">Add Staff</span>
          </a>
          <a href="#" className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
            <SettingsIcon /> <span className="nav-link-text">Settings</span>
          </a>
        </nav>

        <div className="theme-toggle-container">
          {isAdmin && (
            <div className="admin-mode-box">
              <span className="admin-mode-text">
                <ShieldCheckIcon /> ADMIN MODE ON
              </span>
              <button className="exit-btn" onClick={() => setIsAdmin(false)}>
                <ExitIcon /> <span className="exit-text">Exit</span>
              </button>
            </div>
          )}
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span className="theme-btn-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-wrapper">
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarExpanded(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="mobile-brand">RPF Tracker</span>
        </div>

        {activeTab === 'dashboard' ? (
          loading ? (
            <div className="dashboard-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading dashboard data...</div>
            </div>
          ) : (
          <div className="dashboard-scroll">
            <div className="page-header">
              <h1 className="page-title">Railway Police Force</h1>
              <p className="page-subtitle">Staff overview & operations summary</p>
            </div>

            <div className="kpi-grid">
            <div className="kpi-card border-primary">
              <div className="kpi-card-header">
                <span className="kpi-title">Total Staff</span>
                <StaffIcon stroke="var(--primary)" />
              </div>
              <div className="kpi-value">{totalStaff}</div>
            </div>
            <div className="kpi-card border-success">
              <div className="kpi-card-header">
                <span className="kpi-title">Active</span>
                <ActivityIcon stroke="var(--success)" />
              </div>
              <div className="kpi-value">{activeCount}</div>
            </div>
            <div className="kpi-card border-warning">
              <div className="kpi-card-header">
                <span className="kpi-title">LOA</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><rect x="10" y="8" width="4" height="8"></rect></svg>
              </div>
              <div className="kpi-value">{loaCount}</div>
            </div>
            <div className="kpi-card border-purple">
              <div className="kpi-card-header">
                <span className="kpi-title">ROA</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple, #8b5cf6)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div className="kpi-value">{roaCount}</div>
            </div>
            <div className="kpi-card border-alert">
              <div className="kpi-card-header">
                <span className="kpi-title">Suspended</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--alert)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div className="kpi-value">{suspendedCount}</div>
            </div>
            <div className="kpi-card border-danger">
              <div className="kpi-card-header">
                <span className="kpi-title">Terminated</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
              </div>
              <div className="kpi-value">{terminatedCount}</div>
            </div>
          </div>

          <div className="middle-grid">
            <div className="info-card">
              <div className="info-card-title">Divisions</div>
              <div className="info-row">
                <span className="info-label">Department Head</span>
                <span className="info-value primary">{divDeptHead}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Appeal Division</span>
                <span className="info-value primary">{divAppeal}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ingame & Discord Mod</span>
                <span className="info-value primary">{divIngame}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Training Division</span>
                <span className="info-value primary">{divTraining}</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-card-title">Warnings Issued</div>
              <div className="info-row">
                <span className="info-label warning">Warnings</span>
                <span className="info-value">{warnCount}</span>
              </div>
              <div className="info-row">
                <span className="info-label alert">Strikes</span>
                <span className="info-value">{strikeCount}</span>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="performer-card">
              <div className="performer-header">
                <ActivityIcon stroke="var(--primary)" /> Top Performers: Voice Hours
              </div>
              {sortedByVoice.map((s, idx) => (
                <div key={s.id} className="performer-row">
                  <div className="performer-left">
                    <div className="rank-badge">#{idx + 1}</div>
                    <div>
                      <div className="performer-name">{s.name}</div>
                      <div className="performer-role">{s.rank} • {s.division}</div>
                    </div>
                  </div>
                  <div className="performer-right">
                    <div className="performer-score">{s.voice}h</div>
                    <div className="performer-period">Weekly</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="performer-card">
              <div className="performer-header">
                <ActivityIcon stroke="var(--primary)" /> Top Performers: Events
              </div>
              {sortedByEvents.map((s, idx) => (
                <div key={s.id} className="performer-row">
                  <div className="performer-left">
                    <div className="rank-badge">#{idx + 1}</div>
                    <div>
                      <div className="performer-name">{s.name}</div>
                      <div className="performer-role">{s.rank} • {s.division}</div>
                    </div>
                  </div>
                  <div className="performer-right">
                    <div className="performer-score">{s.events}</div>
                    <div className="performer-period">Events + Mini</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          )
        ) : activeTab === 'staff-list' ? (
          <StaffList isAdmin={isAdmin} staff={staff} onRowClick={handleRowClick} />
        ) : activeTab === 'staff-profile' ? (
          <StaffProfile 
            staffMember={staff.find(s => s.id === activeStaffId)} 
            updateStaff={updateStaff} 
            removeStaff={removeStaff} 
            goBack={() => setActiveTab('staff-list')} 
            isAdmin={isAdmin} 
          />
        ) : activeTab === 'add-staff' ? (
          <AddStaff isAdmin={isAdmin} addStaff={addStaffMember} />
        ) : activeTab === 'settings' ? (
          <Settings isAdmin={isAdmin} setIsAdmin={setIsAdmin} wipeData={handleWipeData} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
