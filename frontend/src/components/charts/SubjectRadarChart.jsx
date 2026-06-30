import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SubjectRadarChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No data yet</div>;
  }

  const chartData = Object.entries(data).map(([subject, score]) => ({
    subject: subject.length > 10 ? subject.substring(0, 10) + '…' : subject,
    score: Math.round(score)
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(6,182,212,0.15)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
        <Radar name="Score" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}%`, 'Score']}
          contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SubjectRadarChart;
