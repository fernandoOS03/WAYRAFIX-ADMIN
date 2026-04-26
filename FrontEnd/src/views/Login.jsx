import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Logo Minimal */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'var(--color-primary)',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Zap size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '0.25rem' }}>
            WayraFix Admin
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Panel de gestión logística y siniestros
          </p>
        </div>

        {/* Form Card (Minimal) */}
        <div className="card" style={{ padding: '2rem', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div className="input-wrapper">
                <Mail size={14} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input"
                  placeholder="admin@wayrafix.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Contraseña
              </label>
              <div className="input-wrapper">
                <Lock size={14} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  required
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.625rem' }}
            >
              {isLoading
                ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                : 'Iniciar Sesión'
              }
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          © 2026 WayraFix · Gestión de Asistencias
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
