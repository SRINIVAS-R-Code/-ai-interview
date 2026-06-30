import { useNavigate, Link } from 'react-router-dom';
import { MdRocketLaunch, MdAutoAwesome, MdQueryStats, MdPsychology, MdCode } from 'react-icons/md';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'AI Placement Mock Tests', desc: 'Custom subject-based tests with real-time AI hint suggestions as you solve them.', icon: <MdAutoAwesome />, color: 'var(--accent-cyan)' },
    { title: 'Interactive Coding Judge', desc: 'Evaluate your code correctness instantly with our AI-powered proxy judge.', icon: <MdCode />, color: 'var(--accent-purple)' },
    { title: 'Cognitive Aptitude Tests', desc: 'Practice Quantitative, Logical, and Verbal reasoning tests with direct explanation cards.', icon: <MdPsychology />, color: 'var(--accent-orange)' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden'
    }}>
      {/* 3D background grids */}
      <div className="bg-grid-particles"></div>
      
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)', pointerEvents: 'none'
      }} />

      {/* Header / Nav */}
      <header style={{
        padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: 'white', boxShadow: 'var(--shadow-glow)'
          }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Interview<span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
            Sign In
          </Link>
          <button onClick={() => navigate('/register')} className="btn btn-primary">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '6rem 2rem',
        textAlign: 'center', position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                      background: 'rgba(6,182,212,0.15)', padding: '0.375rem 1rem', 
                      borderRadius: 100, border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <MdRocketLaunch style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-light)' }}>
            Empowered by Gemini 1.5 Flash
          </span>
        </div>

        <h1 style={{
          fontSize: 'calc(2.25rem + 1.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.03em', marginBottom: '1.5rem'
        }}>
          Ace Your Placements with <br />
          <span className="gradient-text glow-text-cyan">3D AI Interview Co-Pilot</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: 680,
          margin: '0 auto 2.5rem', lineHeight: 1.75
        }}>
          Practice mock tests with real-time AI assistance, solve code problems evaluated by an AI judge, and track your global rank in a modern, immersive dashboard.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
            Create Free Account
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-secondary btn-lg">
            Launch Application
          </button>
        </div>

        {/* 3D Dashboard Mockup Preview Card */}
        <div className="perspective-container" style={{ marginTop: '5rem' }}>
          <div className="glass-card card-3d" style={{
            maxWidth: 900, margin: '0 auto', padding: '1.5rem',
            background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 50px rgba(6, 182, 212, 0.15)',
            transform: 'rotateX(15deg) translateY(-20px)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
            </div>
            
            {/* Inner Dashboard Layout Mockup */}
            <div style={{ background: '#0F172A', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Workspace</h3>
                  <div style={{ height: 4, width: 60, background: 'var(--accent-cyan)', marginTop: 4, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-cyan">Java Basics</span>
                  <span className="badge badge-purple">92% Score</span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(6,182,212,0.05)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong>Question:</strong> Which keyword is used to inherit a class in Java?
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>A) implements</div>
                    <div style={{ padding: '0.5rem', border: '1px solid var(--accent-cyan)', background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>B) extends</div>
                  </div>
                </div>
                <div className="ai-copilot-container" style={{ padding: '1rem', borderRadius: '8px' }}>
                  <div className="ai-copilot-header" style={{ marginBottom: '0.5rem' }}>
                    <span className="floating-bot" style={{ fontSize: '1.5rem' }}>🤖</span>
                    <strong style={{ fontSize: '0.85rem' }}>AI Co-Pilot</strong>
                  </div>
                  <div className="ai-hint-box" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                    Inheritance uses the word meaning "to expand" or "prolong". Think about extending class abilities!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>
          Unmatched Preparation Experience
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {features.map((f, idx) => (
            <div key={idx} className="glass-card card-3d" style={{
              padding: '2.5rem', position: 'relative', overflow: 'hidden', 
              background: 'rgba(30, 41, 59, 0.5)', cursor: 'pointer'
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: f.color, marginBottom: '1.5rem',
                border: '1px solid var(--border-color)'
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ maxWidth: 1000, margin: '4rem auto', padding: '0 2rem' }}>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '3rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }} className="glow-text-cyan">5+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Subject Mock Tests</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-purple)' }} className="glow-text-purple">10+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Coding Challenges</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-green)' }}>30+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Aptitude Problems</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem', borderTop: '1px solid var(--border-color)',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'
      }}>
        <p>© 2026 InterviewAI. Ace your placements with 3D design excellence.</p>
      </footer>
    </div>
  );
};

export default Landing;
