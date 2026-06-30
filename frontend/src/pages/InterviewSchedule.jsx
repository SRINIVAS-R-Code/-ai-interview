import { useState, useEffect } from 'react';
import { getMySchedules, createSchedule, updateSchedule, deleteSchedule } from '../api/scheduleAPI';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdAdd, MdEdit, MdDelete, MdCalendarToday, MdBusiness, MdAccessTime } from 'react-icons/md';

const empty = { title: '', company: '', interviewDate: '', interviewTime: '', notes: '' };

const InterviewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySchedules().then(r => setSchedules(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await updateSchedule(editing, form);
        setSchedules(p => p.map(s => s.id === editing ? res.data : s));
        toast.success('Updated!');
      } else {
        const res = await createSchedule(form);
        setSchedules(p => [...p, res.data]);
        toast.success('Interview scheduled!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(p => p.filter(s => s.id !== id));
      toast.success('Removed');
    } catch { toast.error('Delete failed'); }
  };

  const startEdit = (s) => { setForm({ title: s.title, company: s.company || '', interviewDate: s.interviewDate, interviewTime: s.interviewTime, notes: s.notes || '' }); setEditing(s.id); setShowForm(true); };

  const upcoming = schedules.filter(s => s.interviewDate >= new Date().toISOString().split('T')[0]);
  const past = schedules.filter(s => s.interviewDate < new Date().toISOString().split('T')[0]);

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(139,92,246,0.12)', padding: '0.375rem 1.1rem',
              borderRadius: 100, border: '1px solid rgba(139,92,246,0.3)', marginBottom: '1.25rem' }}>
              <MdCalendarToday style={{ color: 'var(--accent-purple)', fontSize: '1rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.07em', color: 'var(--accent-purple)' }}>Interview Planner</span>
            </div>
            <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
              letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Interview <span className="gradient-text glow-text-purple">Schedule</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 520, lineHeight: 1.75 }}>
              Plan, track, and manage all your upcoming interviews in one place.
            </p>
          </div>
          <button id="add-schedule" className="btn btn-primary"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>
            <MdAdd /> Add Interview
          </button>
        </div>
      </div>

      <div className="page-container">
      {/* Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderColor: 'rgba(6,182,212,0.3)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>{editing ? 'Edit Interview' : 'Schedule New Interview'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { key: 'title', label: 'Interview Title', placeholder: 'e.g. Google SDE Intern Round 1', required: true },
                { key: 'company', label: 'Company', placeholder: 'e.g. Google', required: false },
                { key: 'interviewDate', label: 'Date', type: 'date', required: true },
                { key: 'interviewTime', label: 'Time', type: 'time', required: true },
              ].map(f => (
                <div key={f.key} className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{f.label}</label>
                  <input id={`schedule-${f.key}`} className="form-input" type={f.type || 'text'}
                    placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required} />
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Notes (optional)</label>
              <textarea className="form-input" placeholder="Interview notes, topics to prepare..." value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Save Interview</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upcoming Interviews ({upcoming.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {upcoming.map(s => (
              <div key={s.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontWeight: 700 }}>{s.title}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(s)}><MdEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><MdDelete /></button>
                  </div>
                </div>
                {s.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <MdBusiness /> {s.company}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--accent-cyan)' }}>
                    <MdCalendarToday /> {s.interviewDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--accent-purple)' }}>
                    <MdAccessTime /> {s.interviewTime}
                  </span>
                </div>
                {s.notes && <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {schedules.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No interviews scheduled</h3>
          <p>Add your upcoming interview slots to keep track</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default InterviewSchedule;
