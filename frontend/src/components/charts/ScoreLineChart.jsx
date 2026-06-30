import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ScoreLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No data yet</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.875rem'
        }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{payload[0].value?.toFixed(1)}%</p>
          {payload[0].payload.subject && <p style={{ color: 'var(--text-secondary)' }}>{payload[0].payload.subject}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
        <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth={2}
          fill="url(#scoreGradient)" dot={{ fill: '#06B6D4', strokeWidth: 0, r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ScoreLineChart;
