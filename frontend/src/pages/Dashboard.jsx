import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSummary, getProgress } from '../api/analyticsAPI';
import { getCoachTips } from '../api/dashboardAPI';
import { getMyResults } from '../api/testAPI';
import { getMySchedules } from '../api/scheduleAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MdQuiz, MdCode, MdPsychology, MdDescription,
  MdCalendarToday, MdSmartToy, MdBarChart, MdLeaderboard,
  MdArrowForward, MdTrendingUp, MdEmojiEvents, MdRocketLaunch,
  MdAutoAwesome
} from 'react-icons/md';
import { FaFire } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coachTips, setCoachTips] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, results, schedules, tips] = await Promise.allSettled([
          getSummary(), getMyResults(), getMySchedules(), getCoachTips()
        ]);
        if (sum.status === 'fulfilled') setSummary(sum.value.data);
        if (results.status === 'fulfilled') setRecentResults(results.value.data.slice(0, 4));
        if (schedules.status === 'fulfilled') {
          const today = new Date().toISOString().split('T')[0];
          const fut = schedules.value.data.filter(s => s.interviewDate >= today);
          setUpcoming(fut[0] || null);
        }
        if (tips.status === 'fulfilled' && tips.value.data.tips) {
          try {
            setCoachTips(JSON.parse(tips.value.data.tips));
          } catch {
            setCoachTips(null);
          }
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  const features = [
    {
      title: 'Mock Tests',
      desc: 'Subject-wise AI-powered tests with real-time Co-Pilot hints guiding every answer.',
      icon: <MdQuiz />, color: 'var(--accent-cyan)', to: '/tests',
      badge: summary?.totalTests ? `${summary.totalTests} taken` : 'Start now',
    },
    {
      title: 'Coding Challenges',
      desc: 'Solve DSA problems across difficulty levels with an AI logic hint engine.',
      icon: <MdCode />, color: 'var(--accent-purple)', to: '/coding',
      badge: `${summary?.challengesSolved ?? 0} solved`,
    },
    {
      title: 'Aptitude Practice',
      desc: 'Quantitative, Verbal and Logical reasoning tests to ace campus drives.',
      icon: <MdPsychology />, color: 'var(--accent-orange)', to: '/aptitude',
      badge: 'Practice now',
    },
    {
      title: 'Resume Upload',
      desc: 'Upload your resume and get instant AI-powered improvements & scoring.',
      icon: <MdDescription />, color: 'var(--accent-green)', to: '/resume',
      badge: 'Get feedback',
    },
    {
      title: 'Interview Schedule',
      desc: 'Plan and track your upcoming company interviews and mock sessions.',
      icon: <MdCalendarToday />, color: 'var(--accent-cyan)', to: '/schedule',
      badge: upcoming ? '1 upcoming' : 'Schedule now',
    },
    {
      title: 'AI Feedback',
      desc: 'Get detailed Gemini-powered feedback on your performance and areas to grow.',
      icon: <MdSmartToy />, color: 'var(--accent-purple)', to: '/feedback',
      badge: 'Generate now',
    },
    {
      title: 'Analytics',
      desc: 'Deep-dive into your score trend charts and performance breakdown.',
      icon: <MdBarChart />, color: 'var(--accent-orange)', to: '/analytics',
      badge: 'View insights',
    },
    {
      title: 'Leaderboard',
      desc: 'Compete with peers globally and see where you rank in the platform.',
      icon: <MdLeaderboard />, color: 'var(--accent-green)', to: '/leaderboard',
      badge: summary?.rank ? `Rank #${summary.rank}` : 'See rankings',
    },
  ];

  const stats = [
    { icon: '📝', label: 'Tests Taken', value: summary?.totalTests ?? 0, color: 'var(--accent-cyan)' },
    { icon: '📊', label: 'Avg Score', value: summary ? `${(summary.avgScore ?? 0).toFixed(1)}%` : '0%', color: 'var(--accent-purple)' },
    { icon: '⚡', label: 'Challenges Solved', value: summary?.challengesSolved ?? 0, color: 'var(--accent-orange)' },
    { icon: '🏆', label: 'Global Rank', value: summary?.rank ? `#${summary.rank}` : 'N/A', color: 'var(--accent-green)' },
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ─── HERO WELCOME SECTION ─── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem 3rem',
        textAlign: 'center', position: 'relative',
      }}>
        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(6,182,212,0.12)', padding: '0.375rem 1.25rem',
          borderRadius: 100, border: '1px solid rgba(6,182,212,0.3)', marginBottom: '1.5rem',
        }}>
          <MdRocketLaunch style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-cyan-light)' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </span>
        </div>

        <h1 style={{
          fontSize: 'calc(2rem + 1.5vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.03em', marginBottom: '1.25rem',
        }}>
          Ready to Ace Your{' '}
          <span className="gradient-text glow-text-cyan">Placement Interview?</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 620,
          margin: '0 auto 2.5rem', lineHeight: 1.8,
        }}>
          Your AI-powered preparation hub — mock tests, coding challenges, aptitude practice and smart analytics, all in one place.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/tests')} className="btn btn-primary btn-lg">
            <MdAutoAwesome /> Start Mock Test
          </button>
          <button onClick={() => navigate('/coding')} className="btn btn-secondary btn-lg">
            <MdCode /> Solve Coding
          </button>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card card-3d" style={{ padding: '1.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AI COACH SECTION ─── */}
      {coachTips && (
        <section style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 2rem' }}>
          <div className="glass-card glow-card-purple" style={{ padding: '2rem', background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', boxShadow: '0 0 15px rgba(139,92,246,0.4)'
              }}>🤖</div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>AI CAREER COACH</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Personalized Preparation Blueprint</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{coachTips.verdict}"
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-purple)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', display: 'block', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Focus Goals for Today:</span>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {coachTips.dailyGoals?.map((g, idx) => <li key={idx}>{g}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Recommended Actions:</span>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {coachTips.nextSteps?.map((ns, idx) => <li key={idx}>{ns}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {coachTips.quote && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                💡 Quote of the Day: "{coachTips.quote}"
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── FEATURES SECTION ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'calc(1.5rem + 0.5vw)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Everything You Need to <span className="gradient-text">Crack Placements</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            Eight powerful modules — all AI-powered, all in one platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card card-3d"
              onClick={() => navigate(f.to)}
              style={{
                padding: '2rem', cursor: 'pointer', position: 'relative',
                overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
              {/* Ambient corner glow */}
              <div style={{
                position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                background: `radial-gradient(circle, ${f.color}22 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: `${f.color}18`,
                border: `1px solid ${f.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', color: f.color,
              }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{f.title}</h3>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                    borderRadius: 100, background: `${f.color}15`, color: f.color,
                    border: `1px solid ${f.color}30`, whiteSpace: 'nowrap',
                  }}>{f.badge}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: f.color, fontSize: '0.8rem', fontWeight: 600 }}>
                Open <MdArrowForward />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RECENT ACTIVITY + UPCOMING INTERVIEW ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: recentResults.length ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>

          {/* Recent Test Results */}
          {recentResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdTrendingUp style={{ color: 'var(--accent-cyan)' }} /> Recent Results
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentResults.map(r => (
                  <div key={r.id} className="glass-card" style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{r.test?.subject || 'Test'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.5rem', fontWeight: 900,
                        color: r.percentage >= 70 ? 'var(--accent-green)' : r.percentage >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)',
                      }}>
                        {(r.percentage ?? 0).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {r.score} / {r.totalMarks} marks
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/analytics" style={{
                  textAlign: 'center', padding: '0.75rem',
                  color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 600,
                  border: '1px dashed rgba(6,182,212,0.3)', borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                }}>
                  View all analytics →
                </Link>
              </div>
            </div>
          )}

          {/* Upcoming Interview + AI Streak */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {upcoming ? (
              <div className="glass-card" style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))',
                border: '1px solid rgba(139,92,246,0.25)',
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <MdCalendarToday style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Interview</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>{upcoming.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{upcoming.company}</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">{upcoming.interviewDate}</span>
                  <span className="badge badge-cyan">{upcoming.interviewTime}</span>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Upcoming Interviews</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Schedule your next mock or company interview.</p>
                <button onClick={() => navigate('/schedule')} className="btn btn-primary btn-sm" style={{ margin: '0 auto' }}>
                  + Schedule Interview
                </button>
              </div>
            )}

            {/* Motivation / AI Tip Card */}
            <div className="glass-card" style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(6,182,212,0.05))',
              border: '1px solid rgba(245,158,11,0.2)',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <FaFire style={{ color: 'var(--accent-orange)', fontSize: '1.3rem' }} />
                <span style={{ fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Daily Tip</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Consistency beats intensity. Even 30 minutes of focused practice daily can dramatically improve your placement readiness in 3 weeks.
              </p>
              <button onClick={() => navigate('/tests')} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Start today's session <MdArrowForward />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM STATS BANNER ─── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div className="glass-card" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          padding: '3rem', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(139,92,246,0.05))',
        }}>
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-cyan)' }} className="glow-text-cyan">5+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Subject Mock Tests</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-purple)' }} className="glow-text-purple">10+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Coding Challenges</div>
          </div>
          <div>
            <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-green)' }}>30+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Aptitude Problems</div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid var(--border-color)', padding: '2rem',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem',
      }}>
        <p>© 2026 InterviewAI · Powered by Gemini 1.5 · Built for placement success</p>
      </footer>
    </div>
  );
};

export default Dashboard;
