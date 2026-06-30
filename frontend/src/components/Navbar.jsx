import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdNotifications, MdPerson } from 'react-icons/md';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tests': 'Mock Tests',
  '/coding': 'Coding Challenges',
  '/aptitude': 'Aptitude Tests',
  '/resume': 'Resume Upload',
  '/schedule': 'Interview Schedule',
  '/feedback': 'AI Feedback',
  '/analytics': 'Analytics',
  '/leaderboard': 'Leaderboard',
};

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'InterviewAI';

  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--sidebar-width)',
      right: 0, height: 'var(--topbar-height)',
      background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', zIndex: 99
    }}>
      <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'rgba(6,182,212,0.1)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)', padding: '0.5rem',
          color: 'var(--text-secondary)', display: 'flex', cursor: 'pointer',
          transition: 'var(--transition)'
        }}>
          <MdNotifications size={20} />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(6,182,212,0.1)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)', padding: '0.375rem 0.875rem'
        }}>
          <MdPerson size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
