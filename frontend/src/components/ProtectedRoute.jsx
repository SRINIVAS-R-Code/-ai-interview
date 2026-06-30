import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopNav from './TopNav';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', top: '-15%', left: '-10%', width: '55vw', height: '55vw',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="bg-grid-particles" style={{ position: 'fixed', zIndex: 0 }} />

      <TopNav />
      <ScrollToTop />

      {/* Main content — pushed below fixed nav using CSS variable */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
