import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResultById, getTestWithQuestions } from '../api/testAPI';
import { generateFeedback } from '../api/feedbackAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdCancel, MdSmartToy, MdArrowBack } from 'react-icons/md';

const MockTestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getResultById(id)
      .then(r => {
        setResult(r.data);
        if (r.data.test?.id) {
          getTestWithQuestions(r.data.test.id)
            .then(tRes => {
              setQuestions(tRes.data.questions || []);
            })
            .catch(() => {});
        }
      })
      .catch(() => toast.error('Result not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const getAIFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const summary = `Subject: ${result.test?.subject}, Score: ${result.percentage?.toFixed(1)}%, Correct: ${result.score}/${result.totalMarks}`;
      const res = await generateFeedback({ contextType: 'MOCK_TEST', contextId: result.id, performanceSummary: summary });
      setFeedback(res.data.feedbackText);
      toast.success('AI feedback generated!');
    } catch { toast.error('Failed to get AI feedback'); }
    setLoadingFeedback(false);
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;
  if (!result) return <div className="page-container"><p>Result not found</p></div>;

  const pct = result.percentage?.toFixed(1);
  const isGood = result.percentage >= 70;
  const isMedium = result.percentage >= 40;

  return (
    <div className="page-container animate-fade-in">
      <button onClick={() => navigate('/tests')} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <MdArrowBack /> Back to Tests
      </button>

      {/* Score Card */}
      <div className="glass-card" style={{
        padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem',
        background: `linear-gradient(135deg, ${isGood ? 'rgba(16,185,129,0.1)' : isMedium ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}, rgba(15,23,42,0.8))`
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>
          {isGood ? '🏆' : isMedium ? '📈' : '💪'}
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: isGood ? 'var(--accent-green)' : isMedium ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
          {pct}%
        </div>
        <div style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          You scored <strong style={{ color: 'var(--text-primary)' }}>{result.score}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{result.totalMarks}</strong>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan">{result.test?.subject}</span>
          <span className={`badge badge-${result.test?.difficulty?.toLowerCase()}`}>{result.test?.difficulty}</span>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdSmartToy style={{ color: 'var(--accent-cyan)' }} /> AI Feedback
          </h3>
          {!feedback && (
            <button id="get-ai-feedback" className="btn btn-primary" onClick={getAIFeedback} disabled={loadingFeedback}>
              {loadingFeedback ? 'Generating...' : '✨ Get AI Feedback'}
            </button>
          )}
        </div>
        {feedback
          ? <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>{feedback}</div>
          : <p style={{ color: 'var(--text-muted)' }}>Click the button to get personalized AI feedback on your performance.</p>
        }
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/tests')}>Take Another Test</button>
        <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>View Analytics</button>
        <button className="btn btn-secondary" onClick={() => navigate('/feedback')}>All Feedback</button>
      </div>

      {/* Detailed Review */}
      {questions.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            📝 Question Review & Explanations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(() => {
              let userAnswers = {};
              try { userAnswers = result.answersJson ? JSON.parse(result.answersJson) : {}; } catch(e) {}
              return questions.map((question, index) => {
                const userAns = userAnswers[String(question.id)];
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
                        {`The correct option is ${question.correctOption} (${correctOptText}).`}
                      </p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTestResult;
