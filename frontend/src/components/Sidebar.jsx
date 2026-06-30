import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdQuiz, MdCode, MdPsychology,
  MdDescription, MdCalendarToday, MdSmartToy,
  MdBarChart, MdLeaderboard, MdLogout, MdForum
} from 'react-icons/md';

const navItems = [
  { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/tests', icon: <MdQuiz />, label: 'Mock Tests' },
  { to: '/coding', icon: <MdCode />, label: 'Coding' },
  { to: '/aptitude', icon: <MdPsychology />, label: 'Aptitude' },
  { to: '/resume', icon: <MdDescription />, label: 'Resume' },
  { to: '/schedule', icon: <MdCalendarToday />, label: 'Schedule' },
  { to: '/ai-interview', icon: <MdForum />, label: 'AI Simulator' },
  { to: '/feedback', icon: <MdSmartToy />, label: 'AI Feedback' },
  { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
  { to: '/leaderboard', icon: <MdLeaderboard />, label: 'Leaderboard' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: 'var(--sidebar-width)', height: '100vh',
      background: 'rgba(15,23,42,0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100, padding: '1.5rem 1rem',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: 'white'
          }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Interview<span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)',
            background: isActive ? 'rgba(6,182,212,0.15)' : 'transparent',
            color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
          })}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{
        borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem'
      }}>
        <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.college || 'Student'}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
          <MdLogout /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
