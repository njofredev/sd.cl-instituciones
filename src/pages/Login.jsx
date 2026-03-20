import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginInstitucion, loginPaciente } from '../services/api';

const BRANDING_CONTENT = {
  institucion: {
    tagline: 'Plataforma Institucional',
    subtitle: 'Gestión de convenios y atención psicológica para instituciones.',
    features: [
      { icon: 'calendar_month', text: 'Agendamiento de sesiones online' },
      { icon: 'monitoring', text: 'Reportes y métricas institucionales' },
      { icon: 'shield', text: 'Privacidad y confidencialidad clínica' }
    ]
  },
  paciente: {
    tagline: 'Portal del Paciente',
    subtitle: 'Agenda tus sesiones, revisa tu historial y conecta con tu profesional.',
    features: [
      { icon: 'event_available', text: 'Agenda y gestiona tus citas fácilmente' },
      { icon: 'psychology', text: 'Accede a tu profesional de confianza' },
      { icon: 'lock', text: 'Tu información siempre protegida' }
    ]
  }
};

const TEST_ACCOUNTS = [
  { nombre: 'Admin', apellido: 'Sistema', rol: 'admin_sistema', rol_display: 'Admin Sistema', usuario: 'admin@sanad.cl', password: 'admin123', rut_institucion: '9999999-9' },
  { nombre: 'Nicolás', apellido: 'Jofré', rol: 'paciente', rol_display: 'Paciente de Prueba', usuario: '19258679-8' }
];

export default function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState('institucion');
  const [rutInst, setRutInst] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const bd = BRANDING_CONTENT[mode];
  const testUsers = TEST_ACCOUNTS.filter(u => mode === 'paciente' ? u.rol === 'paciente' : u.rol !== 'paciente');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let sessionData;
      if (mode === 'institucion') {
        const data = await loginInstitucion(usuario, password, rutInst);
        sessionData = { 
          ...data.usuario, 
          access_token: data.access_token,
          id: data.usuario.email, 
          login_at: new Date().toISOString() 
        };
      } else {
        const data = await loginPaciente(usuario);
        const p = data.paciente;
        sessionData = {
          ...p,
          access_token: data.access_token,
          id: p.rut,
          nombre: p.nombre_completo.split(' ')[0],
          apellido: p.nombre_completo.split(' ').slice(1).join(' '),
          email: p.email,
          rut: p.rut,
          rol: 'paciente',
          usuario: p.rut,
          paciente_id: p.rut,
          rol_display: 'Paciente',
          institucion_nombre: p.sede || '',
          reservas_realizadas: p.reservas_realizadas || 0,
          login_at: new Date().toISOString()
        };
      }
      login(sessionData);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Error de conexión con el servidor. Por favor, reintenta en unos segundos.');
      } else {
        setError(err.message);
      }
    }
  };

  const autofill = (user) => {
    if (mode === 'institucion') setRutInst(user.rut_institucion || '');
    setUsuario(user.usuario);
    setPassword(user.password);
  };

  return (
    <div className="login-page">
      <div className="login-branding" id="brandingPanel">
        <div className="login-branding-content" id="brandingContent">
          <img src="/src/assets/logo.png" alt="SANAD" className="login-branding-logo-img" />
          <p className="login-branding-tagline" id="brandingTagline">{bd.tagline}</p>
          <p id="brandingSubtitle" style={{ fontSize: '.875rem', marginTop: '.5rem', color: 'rgba(255,255,255,.55)' }}>
            {bd.subtitle}
          </p>
          <ul className="login-branding-features" id="brandingFeatures">
            {bd.features.map((f, i) => (
              <li key={i}>
                <div className="feature-icon"><span className="material-symbols-outlined">{f.icon}</span></div> 
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-container">
          <h2>Bienvenido</h2>
          <p>Por favor, ingresa tus credenciales para acceder</p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setMode('institucion')}
              style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', fontWeight: mode === 'institucion' ? '600' : '500', color: mode === 'institucion' ? 'var(--color-primary)' : 'var(--text-400)', borderBottom: mode === 'institucion' ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Institución / Clínicos
            </button>
            <button 
              onClick={() => setMode('paciente')}
              style={{ background: 'none', border: 'none', paddingBottom: '0.5rem', fontWeight: mode === 'paciente' ? '600' : '500', color: mode === 'paciente' ? 'var(--color-primary)' : 'var(--text-400)', borderBottom: mode === 'paciente' ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Pacientes
            </button>
          </div>

          <form id="loginForm" onSubmit={handleLogin}>
            {mode === 'institucion' && (
              <div className="form-group" id="groupRutInst">
                <label>RUT Institución</label>
                <input type="text" value={rutInst} onChange={(e) => setRutInst(e.target.value)} placeholder="76.100.200-3" required />
              </div>
            )}
            
            <div className="form-group">
              <label>{mode === 'institucion' ? 'Usuario (Email)' : 'RUT Paciente'}</label>
              <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder={mode === 'institucion' ? 'nombre@ejemplo.com' : '18.765.432-1'} required />
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Contraseña</label>
                <a href="#" style={{ fontSize: '.75rem', color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            
            {error && (
              <div className="form-error visible" id="loginError">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                <span>{error}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem', cursor: 'pointer' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '.8125rem', color: 'var(--text-500)', cursor: 'pointer' }}>Recordar sesión</label>
            </div>
            <button type="submit" className="btn-login">Iniciar Sesión</button>
          </form>

          {testUsers.length > 0 && (
            <div className="test-users-box">
              <h4>Usuarios de Prueba <span style={{ fontWeight: '400', color: 'var(--text-300)', fontSize: '.6875rem' }}>(haz clic para autocompletar)</span></h4>
              <div id="testUsersList">
                {testUsers.map((u, i) => (
                  <button key={i} className="test-user-item" type="button" onClick={() => autofill(u)}>
                    <strong>{u.nombre} {u.apellido}</strong>
                    <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '.6875rem', background: 'rgba(3,58,140,.06)', padding: '2px 8px', borderRadius: '20px' }}>{u.rol_display}</span>
                    <small style={{ color: 'var(--text-300)', display: 'block', marginTop: '2px' }}>{u.usuario}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
