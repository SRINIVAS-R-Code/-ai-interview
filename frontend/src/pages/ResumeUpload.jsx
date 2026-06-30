import { useState, useEffect } from 'react';
import { uploadResume, getMyResume, getAllResumes, analyzeResume } from '../api/resumeAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MdCloudUpload, MdDescription, MdSmartToy, MdOpenInNew } from 'react-icons/md';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getMyResume(), getAllResumes()]).then(([latest, all]) => {
      if (latest.status === 'fulfilled' && latest.value.status !== 204) setResume(latest.value.data);
      if (all.status === 'fulfilled') setAllResumes(all.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleFile = async (file) => {
    if (!file?.type.includes('pdf')) return toast.error('Only PDF files are accepted');
    if (file.size > 5 * 1024 * 1024) return toast.error('File size must be under 5MB');
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await uploadResume(fd);
      setResume(res.data);
      setAllResumes(p => [res.data, ...p]);
      toast.success('Resume uploaded successfully!');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleAnalyze = async (id) => {
    setAnalyzing(true);
    try {
      const res = await analyzeResume(id);
      setResume(res.data);
      setAllResumes(p => p.map(r => r.id === id ? res.data : r));
      toast.success('AI analysis complete!');
    } catch { toast.error('Analysis failed'); }
    setAnalyzing(false);
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(6,182,212,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(6,182,212,0.3)', marginBottom: '1.25rem' }}>
          <MdCloudUpload style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--accent-cyan)' }}>AI Resume Analysis</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Resume <span className="gradient-text glow-text-cyan">Upload</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          Upload your PDF resume and get instant AI-powered feedback, ATS scoring, and career tips.
        </p>
      </div>

      <div className="page-container">
      {/* Upload Zone */}
      <div
        id="resume-drop-zone"
        className="glass-card"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer',
          borderColor: dragging ? 'var(--accent-cyan)' : 'var(--border-color)',
          background: dragging ? 'rgba(6,182,212,0.08)' : 'var(--bg-card)',
          transition: 'var(--transition)'
        }}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        <input id="file-input" type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />
        <MdCloudUpload style={{ fontSize: '3.5rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
          {uploading ? 'Uploading...' : 'Drop your PDF here or click to browse'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>PDF only · Max 5MB</p>
      </div>

      {/* Current Resume + AI Analysis */}
      {resume && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 'var(--radius-sm)',
                background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MdDescription style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Latest Resume</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={resume.fileUrl?.startsWith('http') ? resume.fileUrl : `http://localhost:8085${resume.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                <MdOpenInNew /> View PDF
              </a>
              {!resume.aiFeedback && (
                <button id="analyze-resume" className="btn btn-primary btn-sm" onClick={() => handleAnalyze(resume.id)} disabled={analyzing}>
                  <MdSmartToy /> {analyzing ? 'Analyzing...' : 'Get AI Analysis'}
                </button>
              )}
            </div>
          </div>

          {resume.aiFeedback && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdSmartToy style={{ color: 'var(--accent-cyan)' }} /> AI Analysis
              </h4>
              <div style={{
                whiteSpace: 'pre-wrap',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '0.9375rem',
                background: resume.aiFeedback.includes('⚠️') || resume.aiFeedback.includes('unavailable') ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.2)',
                border: resume.aiFeedback.includes('⚠️') || resume.aiFeedback.includes('unavailable') ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem'
              }}>
                {resume.aiFeedback}
              </div>
              {(resume.aiFeedback.includes('⚠️') || resume.aiFeedback.includes('unavailable')) ? (
                <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', backgroundColor: '#EF4444', borderColor: '#EF4444' }} onClick={() => handleAnalyze(resume.id)} disabled={analyzing}>
                  🔄 Retry AI Analysis
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => handleAnalyze(resume.id)} disabled={analyzing}>
                  🔄 Re-analyze
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload History */}
      {allResumes.length > 1 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upload History</h3>
          {allResumes.slice(1).map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem 0', borderBottom: '1px solid rgba(6,182,212,0.05)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                📄 {new Date(r.uploadedAt).toLocaleDateString()}
              </div>
              <a href={r.fileUrl?.startsWith('http') ? r.fileUrl : `http://localhost:8085${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">View</a>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ResumeUpload;
