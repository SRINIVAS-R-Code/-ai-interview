import { useState, useEffect } from 'react';
import { getChallenges, getChallenge, submitCode, runCode } from '../api/codingAPI';
import { getAIHint, getIdealSolution } from '../api/feedbackAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdCode, MdSend, MdArrowBack, MdCheckCircle, MdCancel } from 'react-icons/md';

const LANGUAGES = ['java', 'python', 'javascript', 'cpp', 'c'];

const CodingChallenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [active, setActive] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [filter, setFilter] = useState({ difficulty: '', topic: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [aiSolution, setAiSolution] = useState('');
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [runOutput, setRunOutput] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const params = {};
    if (filter.difficulty) params.difficulty = filter.difficulty;
    if (filter.topic) params.topic = filter.topic;

    getChallenges(params)
      .then(r => setChallenges(r.data))
      .catch(() => toast.error('Failed to load challenges'))
      .finally(() => setLoading(false));
  }, [filter]);

  const openChallenge = async (id) => {
    setLoading(true);
    try {
      const res = await getChallenge(id);
      setActive(res.data);
      setResult(null);
      setHint('');
      setAiSolution('');
      setRunOutput('');
      setCustomInput('');
      setCode(getBoilerplate(language));
    } catch { toast.error('Failed to load challenge'); }
    setLoading(false);
  };

  const handleRun = async () => {
    setRunning(true);
    setRunOutput('');
    try {
      const res = await runCode(active.id, { code, language, customInput });
      setRunOutput(res.data.output);
      toast.success('Code executed successfully!');
    } catch {
      toast.error('Execution failed');
    }
    setRunning(false);
  };

  const fetchSolution = async () => {
    setLoadingSolution(true);
    try {
      const res = await getIdealSolution({
        title: active.title,
        description: active.description,
        language: language
      });
      setAiSolution(res.data.solution);
      toast.success('Ideal solution loaded!');
    } catch {
      toast.error('Failed to load ideal solution');
    }
    setLoadingSolution(false);
  };

  const getBoilerplate = (lang) => {
    if (lang === 'java') return 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}';
    if (lang === 'python') return 'def solution():\n    # Write your solution here\n    pass';
    return '// Write your solution here';
  };

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Write some code first!');
    setSubmitting(true);
    try {
      const res = await submitCode(active.id, { code, language });
      setResult(res.data);
      if (res.data.status === 'ACCEPTED') toast.success('✅ Accepted! Great job!');
      else toast.error('❌ Wrong Answer — check your logic');
    } catch { toast.error('Submission failed'); }
    setSubmitting(false);
  };

  const askForHint = async () => {
    if (hint) return;
    setLoadingHint(true);
    try {
      const res = await getAIHint({
        context: 'CODING',
        questionText: active.description,
        details: code
      });
      setHint(res.data.hint);
      toast.success('AI logic hint loaded!');
    } catch {
      toast.error('Failed to load AI logic hint');
    }
    setLoadingHint(false);
  };

  if (loading && !active) return <div className="page-container"><LoadingSpinner /></div>;

  if (!active) return (
    <div className="animate-fade-in">
      {/* Page Hero */}
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(139,92,246,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(139,92,246,0.3)', marginBottom: '1.25rem' }}>
          <MdCode style={{ color: 'var(--accent-purple)', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--accent-purple)' }}>AI-Judged</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Coding <span className="gradient-text glow-text-purple">Challenges</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          Practice real interview coding problems with AI-powered hints. Filter by difficulty and topic.
        </p>
      </div>

      <div className="page-container">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', 'EASY', 'MEDIUM', 'HARD'].map(d => (
          <button key={d} className={`btn ${filter.difficulty === d ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter(p => ({ ...p, difficulty: d }))}>
            {d || 'All Difficulty'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {challenges.map(c => (
          <div key={c.id} className="glass-card card-3d" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className={`badge badge-${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>
              <span className="badge badge-cyan">{c.topic}</span>
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{c.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', 
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.description}
            </p>
            <button id={`open-challenge-${c.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => openChallenge(c.id)}>
              <MdCode /> Solve Challenge
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <button onClick={() => setActive(null)} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        <MdArrowBack /> Back to Challenges
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Problem Description & AI suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className={`badge badge-${active.difficulty.toLowerCase()}`}>{active.difficulty}</span>
              <span className="badge badge-cyan">{active.topic}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{active.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>{active.description}</p>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>SAMPLE INPUT</p>
              <code style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>{active.sampleInput}</code>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>SAMPLE OUTPUT</p>
              <code style={{ color: 'var(--accent-green)', fontSize: '0.875rem' }}>{active.sampleOutput}</code>
            </div>
          </div>

          {/* AI Co-Pilot Suggestion Card */}
          <div className="ai-copilot-container floating-bot">
            <div className="ai-copilot-header">
              <span style={{ fontSize: '1.75rem' }}>🤖</span>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Co-Pilot</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Real-time code hint</div>
              </div>
            </div>

            {hint ? (
              <div className="ai-hint-box">
                <strong>Algorithmic Strategy Hint:</strong><br />
                <p style={{ marginTop: '0.5rem' }}>{hint}</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Need a design strategy or optimization hint for your logic?
                </p>
                <button className="btn btn-secondary btn-sm" onClick={askForHint} disabled={loadingHint} style={{ width: '100%', justifyContent: 'center' }}>
                  {loadingHint ? 'Generating Hint...' : '✨ Ask Co-Pilot for Hint'}
                </button>
              </div>
            )}
          </div>

          {/* Ideal Solution Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              💡 Ideal Solution & Complexity
            </h3>
            {aiSolution ? (
              <div style={{ background: '#0D1117', color: '#E6EDF3', borderRadius: 'var(--radius-sm)', padding: '1.25rem', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.6, fontFamily: "'Courier New', monospace" }}>{aiSolution}</pre>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Reveal the optimal LeetCode solution code and complexity analysis in {language.toUpperCase()}.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={fetchSolution} disabled={loadingSolution} style={{ width: '100%', justifyContent: 'center' }}>
                  {loadingSolution ? 'Generating Solution...' : '✨ Reveal Ideal Answer'}
                </button>
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className="glass-card" style={{
              padding: '1.5rem',
              background: result.status === 'ACCEPTED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {result.status === 'ACCEPTED'
                  ? <MdCheckCircle style={{ color: 'var(--accent-green)', fontSize: '1.5rem' }} />
                  : <MdCancel style={{ color: 'var(--accent-red)', fontSize: '1.5rem' }} />
                }
                <span style={{ fontWeight: 700, color: result.status === 'ACCEPTED' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {result.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{result.explanation}</p>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <select value={language} onChange={e => { setLanguage(e.target.value); setCode(getBoilerplate(e.target.value)); }}
              className="form-input" style={{ width: 'auto', padding: '0.375rem 0.75rem' }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button id="run-code" className="btn btn-secondary" onClick={handleRun} disabled={running}>
                {running ? 'Running...' : 'Run Code'}
              </button>
              <button id="submit-code" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                <MdSend /> {submitting ? 'Judging...' : 'Submit'}
              </button>
            </div>
          </div>
          <textarea
            id="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, minHeight: 320, background: '#0D1117', color: '#E6EDF3',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
              padding: '1.25rem', fontFamily: "'Courier New', monospace", fontSize: '0.875rem',
              resize: 'vertical', lineHeight: 1.6, outline: 'none'
            }}
          />
          <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'block' }}>CUSTOM TEST CASE INPUT</label>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="Type your custom input parameters here..."
                style={{
                  width: '100%', height: 100, background: '#0D1117', color: '#E6EDF3',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem', fontFamily: "'Courier New', monospace", fontSize: '0.8125rem',
                  resize: 'none', outline: 'none'
                }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'block' }}>CONSOLE EXECUTION OUTPUT</label>
              <div
                style={{
                  width: '100%', height: 100, background: '#090D12', color: runOutput.includes('error') || runOutput.includes('Exception') || runOutput.includes('failed') ? '#FF5555' : '#55FF55',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem', fontFamily: "'Courier New', monospace", fontSize: '0.8125rem',
                  overflowY: 'auto', whiteSpace: 'pre-wrap'
                }}
              >
                {runOutput || (running ? 'Executing custom run in AI sandbox...' : 'Run your code to view the compiler console output here.')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;
