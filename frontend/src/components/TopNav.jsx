import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdQuiz, MdCode, MdPsychology, MdDescription,
  MdCalendarToday, MdSmartToy, MdBarChart,
  MdLeaderboard, MdMenu, MdClose, MdLogout, MdPerson
} from 'react-icons/md';

const navItems = [
  { to: '/tests', icon: <MdQuiz />, label: 'Mock Tests' },
  { to: '/coding', icon: <MdCode />, label: 'Coding' },
  { to: '/aptitude', icon: <MdPsychology />, label: 'Aptitude' },
  { to: '/resume', icon: <MdDescription />, label: 'Resume' },
  { to: '/schedule', icon: <MdCalendarToday />, label: 'Schedule' },
  { to: '/feedback', icon: <MdSmartToy />, label: 'AI Feedback' },
  { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
  { to: '/leaderboard', icon: <MdLeaderboard />, label: 'Leaderboard' },
];

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    background: isActive ? 'rgba(6,182,212,0.15)' : 'transparent',
    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
    borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15,23,42,0.96)' : 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(6,182,212,0.25)' : '1px solid rgba(6,182,212,0.1)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, color: 'white',
              boxShadow: '0 0 20px rgba(6,182,212,0.4)',
            }}>AI</div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Interview<span style={{ color: 'var(--accent-cyan)' }}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}
            className="desktop-nav">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} style={navLinkStyle}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(6,182,212,0.1)', border: '1px solid var(--border-color)',
              borderRadius: '10px', padding: '0.375rem 0.875rem',
            }}>
              <MdPerson size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-danger btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MdLogout size={15} /> Logout
            </button>
            {/* Hamburger for mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none', background: 'transparent', border: 'none',
                color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer',
              }}
              className="hamburger-btn">
              {menuOpen ? <MdClose /> : <MdMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={{
            background: 'rgba(15,23,42,0.98)',
            borderTop: '1px solid var(--border-color)',
            padding: '1rem 2rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to}
                onClick={() => setMenuOpen(false)}
                style={navLinkStyle}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="btn btn-danger btn-sm"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              <MdLogout /> Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopNav;
