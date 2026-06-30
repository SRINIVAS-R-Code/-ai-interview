const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="spinner-overlay">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{text}</p>
    </div>
  </div>
);

export default LoadingSpinner;
