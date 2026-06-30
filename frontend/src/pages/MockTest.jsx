import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTests, getTestWithQuestions, submitTest } from '../api/testAPI';
import { getAIHint } from '../api/feedbackAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdTimer, MdArrowBack, MdArrowForward, MdCheckCircle, MdSmartToy, MdQuiz } from 'react-icons/md';

const MockTest = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hints, setHints] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    getAllTests().then(r => setTests(r.data)).catch(() => toast.error('Failed to load tests')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTest && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTest]);

  const startTest = async (test) => {
    setLoading(true);
    try {
      const res = await getTestWithQuestions(test.id);
      setActiveTest(test);
      setQuestions(res.data.questions);
      setAnswers({});
      setHints({});
      setCurrentQ(0);
      setTimeLeft(test.durationMinutes * 60);
    } catch { toast.error('Failed to load test'); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await submitTest(activeTest.id, { answers });
      toast.success('Test submitted!');
      navigate(`/tests/result/${res.data.id}`);
    } catch { toast.error('Submission failed'); setSubmitting(false); }
  };

  const askForHint = async (q) => {
    if (hints[q.id]) return;
    setLoadingHint(true);
    try {
      const opts = `A) ${q.optionA}  B) ${q.optionB}  C) ${q.optionC}  D) ${q.optionD}`;
      const res = await getAIHint({ context: 'MOCK_TEST', questionText: q.questionText, details: opts });
      setHints(p => ({ ...p, [q.id]: res.data.hint }));
      toast.success('AI hint loaded!');
    } catch { toast.error('Failed to load hint'); }
    setLoadingHint(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  /* ─── TEST SELECTION ─────────────────────────────────────── */
  if (!activeTest) return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(6,182,212,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(6,182,212,0.3)', marginBottom: '1.25rem'
        }}>
          <MdQuiz style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-cyan-light)' }}>
            AI-Powered Tests
          </span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Mock Interview <span className="gradient-text glow-text-cyan">Tests</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          Subject-wise tests with real-time AI Co-Pilot hints. 50 questions each. Choose a test and challenge yourself.
        </p>
      </div>

      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {tests.map(t => (
            <div key={t.id} className="glass-card card-3d" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge badge-${t.difficulty.toLowerCase()}`}>{t.difficulty}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱ {t.durationMinutes} min</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.4rem' }}>{t.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                📚 {t.subject}
              </p>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                {t.totalQuestions} questions
              </p>
              <button id={`start-test-${t.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => startTest(t)}>
                Start Test →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── QUIZ VIEW ──────────────────────────────────────────── */
  const q = questions[currentQ];
  const OPTIONS = ['A', 'B', 'C', 'D'];
  const OPTION_KEYS = ['optionA', 'optionB', 'optionC', 'optionD'];
  const answered = Object.keys(answers).length;

  return (
    <div className="page-container animate-fade-in">
      {/* Test Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.2rem' }}>{activeTest.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Question <strong style={{ color: 'var(--accent-cyan)' }}>{currentQ + 1}</strong> of {questions.length}
            &nbsp;·&nbsp;
            <span style={{ color: 'var(--accent-green)' }}>{answered} answered</span>
            &nbsp;·&nbsp;
            <span style={{ color: 'var(--text-muted)' }}>{questions.length - answered} remaining</span>
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : 'rgba(6,182,212,0.1)',
          border: `1px solid ${timeLeft < 60 ? 'rgba(239,68,68,0.4)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)', padding: '0.5rem 1rem',
        }}>
          <MdTimer style={{ color: timeLeft < 60 ? 'var(--accent-red)' : 'var(--accent-cyan)', fontSize: '1.25rem' }} />
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '1.1rem', color: timeLeft < 60 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="progress-bar" style={{ marginBottom: '1.75rem', height: '8px' }}>
        <div className="progress-fill" style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.5fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT: Question card + Navigation */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
            {/* Q badge + answered status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                color: 'white', borderRadius: '10px', padding: '0.25rem 0.75rem',
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em',
              }}>Q{currentQ + 1}</span>
              {answers[String(q?.id)] && (
                <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MdCheckCircle size={14} /> Answered
                </span>
              )}
            </div>

            {/* Question text */}
            <p style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.8, marginBottom: '1.75rem', color: 'var(--text-primary)' }}>
              {q?.questionText}
            </p>

            {/* Options — VERTICAL LIST A → B → C → D */}
            <div className="quiz-options">
              {OPTIONS.map((opt, i) => {
                const optText = q?.[OPTION_KEYS[i]];
                if (!optText) return null;
                const selected = answers[String(q?.id)] === opt;
                return (
                  <button
                    key={opt}
                    id={`option-${opt}`}
                    className={`quiz-option-btn${selected ? ' selected' : ''}`}
                    onClick={() => setAnswers(p => ({ ...p, [String(q.id)]: opt }))}
                  >
                    <span className="option-label">{opt}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{optText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" disabled={currentQ === 0}
                onClick={() => setCurrentQ(p => p - 1)}>
                <MdArrowBack /> Previous
              </button>
              <button className="btn btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.2)' }}
                onClick={() => { if(confirm("Are you sure you want to exit? Your progress for this test will be lost.")) setActiveTest(null); }}>
                Exit Test
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {currentQ < questions.length - 1 && (
                <button className="btn btn-secondary" onClick={handleSubmit} disabled={submitting} style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(6,182,212,0.2)' }}>
                  Submit Early
                </button>
              )}
              {currentQ < questions.length - 1
                ? <button className="btn btn-primary" onClick={() => setCurrentQ(p => p + 1)}>
                    Next <MdArrowForward />
                  </button>
                : <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}
                    style={{ background: 'linear-gradient(135deg, var(--accent-green), #06b6d4)' }}>
                    <MdCheckCircle /> {submitting ? 'Submitting...' : 'Submit Test'}
                  </button>
              }
            </div>
          </div>
        </div>

        {/* RIGHT: AI Co-Pilot + Question navigator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 'calc(var(--topnav-height) + 1rem)' }}>

          {/* AI Hint Panel */}
          <div className="ai-copilot-container">
            <div className="ai-copilot-header">
              <MdSmartToy style={{ fontSize: '1.6rem', color: 'var(--accent-cyan)' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Co-Pilot</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>Powered by Gemini</div>
              </div>
            </div>

            {hints[q?.id] ? (
              <div className="ai-hint-box">
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>💡 Hint:</strong>
                <p style={{ marginTop: '0.5rem' }}>{hints[q.id]}</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.25rem 0' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', lineHeight: 1.6 }}>
                  Stuck on this question? Get an AI hint without the direct answer.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => askForHint(q)}
                  disabled={loadingHint} style={{ width: '100%', justifyContent: 'center' }}>
                  {loadingHint ? '⏳ Thinking...' : '✨ Get AI Hint'}
                </button>
              </div>
            )}
          </div>

          {/* Question navigator grid */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Question Map
            </p>
            <div className="quiz-nav-grid">
              {questions.map((qq, i) => (
                <button key={i}
                  className={`quiz-nav-pill${i === currentQ ? ' active' : answers[String(qq?.id)] ? ' answered' : ''}`}
                  onClick={() => setCurrentQ(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '0.875rem', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>● Current</span>
              <span style={{ color: 'var(--accent-cyan)', opacity: 0.6 }}>◑ Answered</span>
              <span>○ Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
