import { useState, useEffect, useRef } from 'react';
import { getTopics, getQuestions, submitAptitude } from '../api/aptitudeAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdTimer, MdArrowBack } from 'react-icons/md';

const TOPIC_ICONS = {
  QUANTITATIVE: '🔢',
  LOGICAL: '🧠',
  VERBAL: '📖',
  VERBAL_REASONING: '✍️',
  NON_VERBAL_REASONING: '🧩',
  DATA_INTERPRETATION: '📊',
  DATA_SUFFICIENCY: '💡'
};
const TOPIC_DESC = {
  QUANTITATIVE: 'Numbers, ratios, percentages, time & work',
  LOGICAL: 'Reasoning, patterns, sequences, puzzles',
  VERBAL: 'Grammar, vocabulary, reading comprehension',
  VERBAL_REASONING: 'Critical reasoning, arguments, assumptions, inferences',
  NON_VERBAL_REASONING: 'Pattern completion, rotation, matrix problems',
  DATA_INTERPRETATION: 'Bar graphs, pie charts, tables, line graphs',
  DATA_SUFFICIENCY: 'Two statement and multi-statement evaluation'
};


const AptitudeTest = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    getTopics().then(r => setTopics(r.data)).catch(() => toast.error('Failed to load topics')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTopic && !result) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; } return t - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTopic, result]);

  const startTopic = async (topic, difficulty) => {
    setLoading(true);
    try {
      const res = await getQuestions(topic, difficulty);
      const initialAnswers = {};
      if (res.data) {
        res.data.forEach(q => {
          initialAnswers[String(q.id)] = '';
        });
      }
      setActiveTopic(topic); setQuestions(res.data); setAnswers(initialAnswers); setCurrentQ(0);
      setTimeLeft(3000); setResult(null);
    } catch { toast.error('Failed to load questions'); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await submitAptitude(activeTopic, answers);
      setResult(res.data);
      toast.success(`Done! You scored ${res.data.score}/${res.data.total}`);
    } catch { toast.error('Submission failed'); }
    setSubmitting(false);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (loading && !activeTopic) return <div className="page-container"><LoadingSpinner /></div>;

  if (result) return (
    <div className="page-container animate-fade-in">
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{result.percentage >= 70 ? '🏆' : result.percentage >= 40 ? '📈' : '💪'}</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{result.percentage?.toFixed(1)}%</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Scored {result.score} out of {result.total} in {TOPIC_ICONS[result.topic]} {result.topic.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setActiveTopic(null); setResult(null); }}>Practice Again</button>
          <button className="btn btn-secondary" onClick={() => startTopic(activeTopic)}>Retry Same Topic</button>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          📝 Question Review & Explanations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((question, index) => {
            const userAns = answers[String(question.id)];
            const isCorrect = userAns === question.correctOption;
            const correctOptText = question[`option${question.correctOption}`];
            const userOptText = userAns ? question[`option${userAns}`] : 'Skipped';

            return (
              <div key={question.id} className="glass-card" style={{
                padding: '2rem',
                borderLeft: `4px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                background: 'rgba(15, 23, 42, 0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Question {index + 1} of {questions.length}</span>
                  <span className={`badge ${isCorrect ? 'badge-easy' : 'badge-hard'}`} style={{ textTransform: 'uppercase' }}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                
                <p style={{ fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{question.questionText}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Your Answer:</span>
                    <span style={{ color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      <strong>{userAns || 'None'}</strong> - {userOptText}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Correct Answer:</span>
                      <span style={{ color: 'var(--accent-green)' }}>
                        <strong>{question.correctOption}</strong> - {correctOptText}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Explanation</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {question.explanation || `The correct option is ${question.correctOption} (${correctOptText}).`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (!activeTopic) return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(16,185,129,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: '#34d399' }}>🧠 Timed Test · 50 min</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Aptitude <span className="gradient-text glow-text-green">Tests</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          50 randomized questions per topic with custom difficulty levels. Score above 70% to unlock achievements.
        </p>
      </div>
      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {topics.map(t => (
            <div key={t} className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{TOPIC_ICONS[t]}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {t.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{TOPIC_DESC[t]}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Select Difficulty to Start</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button id={`start-aptitude-${t.toLowerCase()}-easy`} className="btn btn-secondary" style={{ padding: '0.5rem 0.25rem', fontSize: '0.8rem', justifyContent: 'center', minWidth: 0 }}
                    onClick={() => startTopic(t, 'EASY')}>Easy</button>
                  <button id={`start-aptitude-${t.toLowerCase()}-medium`} className="btn btn-primary" style={{ padding: '0.5rem 0.25rem', fontSize: '0.8rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)', minWidth: 0 }}
                    onClick={() => startTopic(t, 'MEDIUM')}>Medium</button>
                  <button id={`start-aptitude-${t.toLowerCase()}-hard`} className="btn btn-secondary" style={{ padding: '0.5rem 0.25rem', fontSize: '0.8rem', justifyContent: 'center', minWidth: 0 }}
                    onClick={() => startTopic(t, 'HARD')}>Hard</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const q = questions[currentQ];
  const options = ['A', 'B', 'C', 'D'];
  const optKeys = ['optionA', 'optionB', 'optionC', 'optionD'];

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 800 }}>
            {TOPIC_ICONS[activeTopic]} {activeTopic.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Question {currentQ + 1} of {questions.length}</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : 'rgba(6,182,212,0.1)',
          border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.625rem 1rem'
        }}>
          <MdTimer style={{ color: timeLeft < 60 ? 'var(--accent-red)' : 'var(--accent-cyan)' }} />
          <span style={{ fontWeight: 700, color: timeLeft < 60 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="progress-fill" style={{ width: `${((currentQ+1)/questions.length)*100}%` }} />
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            color: 'white', borderRadius: '10px', padding: '0.25rem 0.75rem',
            fontSize: '0.8rem', fontWeight: 700,
          }}>Q{currentQ + 1}</span>
          {answers[String(q?.id)] && (
            <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Answered</span>
          )}
        </div>
        <p style={{ fontSize: '1.0625rem', fontWeight: 500, lineHeight: 1.8, marginBottom: '1.75rem' }}>{q?.questionText}</p>
        <div className="quiz-options">
          {options.map((opt, i) => {
            const sel = answers[String(q?.id)] === opt;
            const optText = q?.[optKeys[i]];
            if (!optText) return null;
            return (
              <button key={opt}
                className={`quiz-option-btn${sel ? ' selected' : ''}`}
                onClick={() => setAnswers(p => ({ ...p, [String(q.id)]: opt }))}>
                <span className="option-label">{opt}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{optText}</span>
              </button>
            );
          })}
        </div>
      </div>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>Previous</button>
          <button className="btn btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.2)' }}
            onClick={() => { if(confirm("Are you sure you want to exit? Your progress for this test will be lost.")) setActiveTopic(null); }}>
            Exit Test
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {currentQ < questions.length - 1 && (
            <button className="btn btn-secondary" onClick={handleSubmit} disabled={submitting} style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(6,182,212,0.2)' }}>
              {submitting ? 'Submitting...' : 'Submit Early'}
            </button>
          )}
          {currentQ < questions.length - 1
            ? <button className="btn btn-primary" onClick={() => setCurrentQ(p => p + 1)}>Next</button>
            : <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : '✓ Submit'}
              </button>
          }
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
