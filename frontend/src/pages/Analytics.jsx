import { useState, useEffect } from 'react';
import { getSummary, getProgress, getSubjectBreakdown } from '../api/analyticsAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreLineChart from '../components/charts/ScoreLineChart';
import SubjectRadarChart from '../components/charts/SubjectRadarChart';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getSummary(), getProgress(), getSubjectBreakdown()]).then(([sum, prog, sub]) => {
      if (sum.status === 'fulfilled') setSummary(sum.value.data);
      if (prog.status === 'fulfilled') setProgress(prog.value.data);
      if (sub.status === 'fulfilled') setSubjects(sub.value.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  const stats = [
    { label: 'Tests Taken', value: summary?.totalTests ?? 0, icon: '📝' },
    { label: 'Avg Score', value: summary ? `${summary.avgScore?.toFixed(1)}%` : '0%', icon: '📊' },
    { label: 'Problems Solved', value: summary?.challengesSolved ?? 0, icon: '⚡' },
    { label: 'Global Rank', value: summary?.rank ? `#${summary.rank}` : 'N/A', icon: '🏆' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(6,182,212,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(6,182,212,0.3)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--accent-cyan)' }}>📊 Live Metrics</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Your <span className="gradient-text glow-text-cyan">Analytics</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          Track your progress, score trends, and subject performance — all in one place.
        </p>
      </div>

      <div className="page-container">
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="glass-card stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📈 Score Trend Over Time</h3>
          <ScoreLineChart data={progress} />
          {progress.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.875rem' }}>
              Complete tests to see your score trend here
            </p>
          )}
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🎯 Subject Performance</h3>
          <SubjectRadarChart data={subjects} />
        </div>
      </div>

      {/* Subject Breakdown Table */}
      {Object.keys(subjects).length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Subject Breakdown</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Average Score</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(subjects).sort((a, b) => b[1] - a[1]).map(([subject, score]) => (
                <tr key={subject}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{subject}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: score >= 70 ? 'var(--accent-green)' : score >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                      {score.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ width: '200px' }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${score}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default Analytics;
