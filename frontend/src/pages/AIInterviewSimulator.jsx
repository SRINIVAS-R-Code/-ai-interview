import { useState, useEffect } from 'react';
import { startInterview, respondToInterview, getMyInterviews, getInterviewById } from '../api/aiInterviewAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdSmartToy, MdSend, MdArrowBack, MdCheckCircle, MdCancel, MdGrade, MdAssignmentTurnedIn, MdForum } from 'react-icons/md';

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'Product Manager'
];

const AIInterviewSimulator = () => {
  const [interviews, setInterviews] = useState([]);
  const [active, setActive] = useState(null);
  const [role, setRole] = useState(ROLES[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadMyInterviews();
  }, []);

  const loadMyInterviews = async () => {
    try {
      const res = await getMyInterviews();
      setInterviews(res.data);
    } catch {
      toast.error('Failed to load past interviews');
    }
    setLoading(false);
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await startInterview({ role });
      setActive(res.data);
      setFeedback(null);
      setMessage('');
      toast.success('Mock interview started! Answer the first question.');
    } catch {
      toast.error('Failed to start mock interview');
    }
    setStarting(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await respondToInterview(active.id, { message });
      setActive(res.data);
      setMessage('');
      if (res.data.status === 'COMPLETED') {
        toast.success('Interview completed! Loading scorecard.');
        parseFeedback(res.data);
        loadMyInterviews();
      } else {
        toast.success('Response sent.');
      }
    } catch {
      toast.error('Failed to send response');
    }
    setSending(false);
  };

  const viewReport = async (id) => {
    setLoading(true);
    try {
      const res = await getInterviewById(id);
      setActive(res.data);
      parseFeedback(res.data);
    } catch {
      toast.error('Failed to load report');
    }
    setLoading(false);
  };

  const parseFeedback = (session) => {
    if (session.overallFeedback) {
      try {
        const json = JSON.parse(session.overallFeedback);
        setFeedback(json);
      } catch {
        setFeedback(null);
      }
    } else {
      setFeedback(null);
    }
  };

  const getMessages = () => {
    if (!active?.messagesJson) return [];
    try {
      return JSON.parse(active.messagesJson);
    } catch {
      return [];
    }
  };

  const getQuestionCount = () => {
    const msgs = getMessages();
    return msgs.filter(m => m.sender === 'USER').length;
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  // REPORT VIEW (COMPLETED)
  if (active && active.status === 'COMPLETED') {
    const messages = getMessages();
    return (
      <div className="page-container animate-fade-in">
        <button onClick={() => { setActive(null); setFeedback(null); }} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
          <MdArrowBack /> Back to Simulator
        </button>

        <div className="page-hero" style={{ paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: 'calc(1.6rem + 0.8vw)', fontWeight: 900, marginBottom: '0.5rem' }}>
            Interview <span className="gradient-text glow-text-purple">Scorecard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Role: {active.role} · Completed on {new Date(active.createdAt).toLocaleDateString()}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Score Card sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--accent-purple)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                OVERALL SCORE
              </div>
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                background: 'conic-gradient(var(--accent-purple) 0% ' + active.score + '%, rgba(255,255,255,0.05) ' + active.score + '% 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)'
              }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%', background: 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900
                }}>
                  {active.score}%
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}>
                {active.score >= 80 ? 'EXCELLENT' : active.score >= 60 ? 'PASS' : 'NEEDS PRACTICE'}
              </span>
            </div>

            {feedback && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>💡 Career Coach Verdict</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feedback.verdict}</p>
              </div>
            )}
          </div>

          {/* Feedback details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {feedback && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdCheckCircle /> Candidate Strengths
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {feedback.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdGrade /> Key Focus Areas
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {feedback.improvements?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <h3 style={{ fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdAssignmentTurnedIn style={{ color: 'var(--accent-purple)' }} /> Question-by-Question Review
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {feedback.modelAnswers?.map((ans, idx) => {
                    // Find corresponding user reply in chat
                    const userReply = messages.filter(m => m.sender === 'USER')[idx]?.text || 'N/A';
                    return (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Q{idx + 1}: {ans.question}</div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', textTransform: 'uppercase' }}>Your Response:</span>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>"{userReply}"</p>
                        </div>
                        <div style={{ background: 'rgba(16,185,129,0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-green)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)', display: 'block', textTransform: 'uppercase' }}>Ideal Solution Answer:</span>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6 }}>{ans.idealAnswer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE INTERVIEW IN-PROGRESS
  if (active && active.status === 'IN_PROGRESS') {
    const messages = getMessages();
    const qCount = getQuestionCount();
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => { if (confirm('Exit mock interview? Progress will be saved.')) setActive(null); }} className="btn btn-secondary">
            <MdArrowBack /> Exit Simulator
          </button>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Session #{active.id} · Role: <span style={{ color: 'var(--accent-cyan)' }}>{active.role}</span>
          </div>
        </div>

        {/* Chat window */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 560 }}>
          {/* Progress Indicator */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>PROGRESS</span>
              <span>QUESTION {qCount + 1} OF 5</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ width: `${(qCount + 1) * 20}%`, height: '100%', background: 'var(--accent-purple)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Message log */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: m.sender === 'AI' ? 'flex-start' : 'flex-end',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                {m.sender === 'AI' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MdSmartToy style={{ color: 'var(--accent-purple)', fontSize: '1.1rem' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: m.sender === 'AI' ? 'rgba(255,255,255,0.04)' : 'rgba(6,182,212,0.12)',
                  border: m.sender === 'AI' ? '1px solid var(--border-color)' : '1px solid rgba(6,182,212,0.3)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div className="pulse-loader" style={{ display: 'inline-block' }}>Interviewer is evaluating your response...</div>
              </div>
            )}
          </div>

          {/* User Input form */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your response here..."
              disabled={sending}
              rows={3}
              style={{
                flex: 1, background: '#0D1117', color: '#E6EDF3',
                border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem', fontFamily: 'inherit', fontSize: '0.9rem',
                resize: 'none', outline: 'none', lineHeight: 1.6
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={sending || !message.trim()} style={{ height: 'fit-content', alignSelf: 'flex-end', minWidth: 100, justifyContent: 'center' }}>
              <MdSend /> Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ROLES SELECTION & PAST SESSIONS LIST (DASHBOARD)
  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(139,92,246,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(139,92,246,0.3)', marginBottom: '1.25rem' }}>
          <MdSmartToy style={{ color: 'var(--accent-purple)', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--accent-purple)' }}>Interactive Bot</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          AI Interview <span className="gradient-text glow-text-purple">Simulator</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 540, lineHeight: 1.75 }}>
          Simulate a real, interactive technical mock interview round. The bot asks questions dynamically and provides a full performance scorecard and review at the end.
        </p>
      </div>

      <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Selection sidebar */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdForum style={{ color: 'var(--accent-purple)' }} /> Start Session
          </h3>
          <div className="form-group">
            <label className="form-label">Select Job Target Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="form-input" style={{ width: '100%' }}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleStart} disabled={starting} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            🚀 {starting ? 'Creating Session...' : 'Start Mock Interview'}
          </button>
        </div>

        {/* Past Sessions List */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Your Past Simulator Rounds</h3>
          {interviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>You have not completed any AI interviews yet.</p>
              <p style={{ fontSize: '0.8rem' }}>Choose a role and click Start above to begin!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {interviews.map(i => (
                <div key={i.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{i.role}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Date: {new Date(i.createdAt).toLocaleDateString()} · Status: <span style={{ color: i.status === 'COMPLETED' ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>{i.status}</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {i.status === 'COMPLETED' && (
                      <span style={{ fontWeight: 700, color: 'var(--accent-purple)', fontSize: '1.1rem' }}>{i.score}%</span>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => i.status === 'COMPLETED' ? viewReport(i.id) : setActive(i)}>
                      {i.status === 'COMPLETED' ? 'View Scorecard' : 'Resume'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewSimulator;
