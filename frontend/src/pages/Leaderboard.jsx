import { useState, useEffect } from 'react';
import { getLeaderboard, getMyRank } from '../api/analyticsAPI';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdEmojiEvents } from 'react-icons/md';

const MEDALS = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getLeaderboard(), getMyRank()]).then(([lb, rank]) => {
      if (lb.status === 'fulfilled') setBoard(lb.value.data);
      if (rank.status === 'fulfilled') setMyRank(rank.value.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(245,158,11,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.25rem' }}>
          <MdEmojiEvents style={{ color: '#f59e0b', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: '#f59e0b' }}>Global Rankings</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          Top performers across the platform. Compete, improve, and claim your rank.
        </p>
      </div>

      <div className="page-container">
      {/* My Rank Card */}
      {myRank && (
        <div className="glass-card" style={{
          padding: '1.5rem', marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', fontWeight: 800, color: 'white'
            }}>{user?.name?.[0]}</div>
            <div>
              <div style={{ fontWeight: 700 }}>Your Position</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                #{myRank.rank || 'N/A'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Global Rank</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-purple)' }}>
                {myRank.entry?.totalScore ?? 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-green)' }}>
                {myRank.entry?.challengesSolved ?? 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problems Solved</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {board.length === 0
          ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MdEmojiEvents /></div>
              <h3>No rankings yet</h3>
              <p>Complete tests to appear on the leaderboard</p>
            </div>
          )
          : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Total Score</th>
                  <th>Tests Taken</th>
                  <th>Problems Solved</th>
                </tr>
              </thead>
              <tbody>
                {board.map((entry, i) => {
                  const isMe = entry.user?.email === user?.email;
                  return (
                    <tr key={entry.id} style={{
                      background: isMe ? 'rgba(6,182,212,0.08)' : undefined
                    }}>
                      <td>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                          {MEDALS[i] || `#${i + 1}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 70%, 50%), hsl(${(i * 47 + 120) % 360}, 70%, 40%))`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, color: 'white'
                          }}>{(entry.userName || entry.user?.name || 'U')[0]?.toUpperCase()}</div>
                          <span style={{ fontWeight: isMe ? 700 : 400, color: isMe ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                            {entry.userName || entry.user?.name} {isMe && '(You)'}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{entry.totalScore}</td>
                      <td>{entry.testsTaken}</td>
                      <td>
                        <span style={{ color: 'var(--accent-green)' }}>⚡ {entry.challengesSolved}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        }
      </div>
      </div>
    </div>
  );
};

export default Leaderboard;
