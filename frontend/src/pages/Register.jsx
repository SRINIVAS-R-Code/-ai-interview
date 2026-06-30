import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerAPI } from '../api/authAPI';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdPerson, MdSchool, MdArrowForward } from 'react-icons/md';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data.token, res.data);
      toast.success(`Welcome to InterviewAI, ${res.data.name}! 🚀`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: <MdPerson />, type: 'text', placeholder: 'John Doe', id: 'reg-name' },
    { key: 'email', label: 'Email Address', icon: <MdEmail />, type: 'email', placeholder: 'you@example.com', id: 'reg-email' },
    { key: 'password', label: 'Password', icon: <MdLock />, type: 'password', placeholder: 'Min. 6 characters', id: 'reg-password' },
    { key: 'college', label: 'College / University', icon: <MdSchool />, type: 'text', placeholder: 'Your institution (optional)', id: 'reg-college' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '10%', right: '15%', width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: '16px', marginBottom: '1rem',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            fontSize: '1.5rem', fontWeight: 800, color: 'white', boxShadow: 'var(--shadow-glow)'
          }}>AI</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.375rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Start your interview prep journey today
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex'
                  }}>{f.icon}</span>
                  <input
                    id={f.id}
                    className="form-input"
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ paddingLeft: '2.75rem' }}
                    required={f.key !== 'college'}
                  />
                </div>
              </div>
            ))}
            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : <><span>Create Account</span><MdArrowForward /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
