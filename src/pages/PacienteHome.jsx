import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOTIVOS_CATALOGO } from '../utils/mockdata';
import { getProfessionals, getPacienteHistorial } from '../services/api';

export default function PacienteHome() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('citas'); // 'citas' or 'agendar'
  const [citasTab, setCitasTab] = useState('proximas'); // 'proximas' or 'historial'
  
  // States for Booking (Agendar)
  const [professionals, setProfessionals] = useState([]);
  const [loadingProfs, setLoadingProfs] = useState(false);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('todos');
  const [ageGroup, setAgeGroup] = useState('');
  const [therapyType, setTherapyType] = useState('');
  const [motivoCategory, setMotivoCategory] = useState('');
  const [activeMotivos, setActiveMotivos] = useState([]);

  // States for Citas (Historial)
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // States for Profile Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const maxSesiones = 4;
  const reservas = user?.reservas_realizadas || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (nombre, apellido) => {
    return `${(nombre || '').charAt(0)}${(apellido || '').charAt(0)}`.toUpperCase();
  };

  // ---- Fetch Professionals Logic ----
  useEffect(() => {
    if (activeTab === 'agendar') fetchProfessionals();
  }, [activeTab, search, gender, ageGroup, therapyType, activeMotivos]);

  const fetchProfessionals = async () => {
    setLoadingProfs(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (gender !== 'todos') params.genero = gender;
      if (therapyType) params.tipo_terapia = therapyType;
      if (ageGroup) params.grupo_etario = ageGroup;
      if (activeMotivos.length > 0) params.motivo = activeMotivos[0];

      const data = await getProfessionals(params);
      setProfessionals(data);
    } catch (err) {
      console.error(err);
      setProfessionals([]);
    } finally {
      setLoadingProfs(false);
    }
  };

  const handleMotivoToggle = (motivo) => {
    if (activeMotivos.includes(motivo)) {
      setActiveMotivos(activeMotivos.filter(m => m !== motivo));
    } else {
      setActiveMotivos([motivo]); // only one active at a time for simplicity like original
    }
  };

  const getMotivoChips = () => {
    if (motivoCategory && MOTIVOS_CATALOGO[motivoCategory]) {
      return MOTIVOS_CATALOGO[motivoCategory];
    }
    return Object.values(MOTIVOS_CATALOGO || {}).flat().slice(0, 10);
  };

  // ---- Fetch History Logic ----
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const data = await getPacienteHistorial(user?.rut);
        setHistory(data.historial || []);
      } catch (err) {
        console.error(err);
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    if (user?.rut) fetchHistory();
  }, [user?.rut]);

  const proximasCitas = history.filter(c => {
    const citaDate = new Date(c.fecha_registro);
    const now = new Date();
    // In this prototype, we consider 'proximas' any that are future OR confirmada/agendada
    return citaDate >= now || ['agendada', 'confirmada'].includes(c.estado_cita?.toLowerCase());
  });

  const historialCitas = history.filter(c => {
    const citaDate = new Date(c.fecha_registro);
    const now = new Date();
    return citaDate < now && !['agendada', 'confirmada'].includes(c.estado_cita?.toLowerCase());
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return {
      day: d.getDate(), month: months[d.getMonth()], weekday: days[d.getDay()],
      time: d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const statusBadge = (estado) => {
    const map = {
      agendada: ['Agendada', 'status-pending'],
      confirmada: ['Confirmada', 'status-confirmed'],
      completada: ['Atendida', 'status-completed'],
      cancelada: ['Cancelada', 'status-cancelled'],
      no_asistio: ['Ausente', 'status-no_asistio'],
      atendida: ['Atendida', 'status-completed']
    };
    const [label, cls] = map[estado] || [estado, ''];
    return <span className={`appointment-status ${cls}`}>{label}</span>;
  };

  const handleBooking = async (profId) => {
    if (reservas >= maxSesiones) {
      alert('Límite de sesiones alcanzado.');
      return;
    }
    try {
      const payload = { 
        profesional_id: String(profId), 
        motivo: activeMotivos.length > 0 ? activeMotivos[0] : 'Consulta General' 
      };
      
      const res = await fetch(`${API_URL}/api/pacientes/${user?.rut}/agendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-ApiKey': API_KEY },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (updateUser && data.reservas_realizadas !== undefined) {
          updateUser({ reservas_realizadas: data.reservas_realizadas });
        }
        
        alert('Cita agendada exitosamente.');
        setActiveTab('citas');
        setCitasTab('historial');
      } else {
        const errorData = await res.json();
        alert(`Error al agendar: ${errorData.detail || 'Fallo de servidor'}`);
      }
    } catch (err) {
      alert('Error de conexión.');
    }
  };

  return (
    <div className="home-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <a href="#" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {e.preventDefault(); setActiveTab('citas');}}>
            <img src="/src/assets/logo.png" alt="SANAD" style={{ height: '28px', objectFit: 'contain' }} />
          </a>
          <span className="header-divider"></span>
          <span className="header-institution" id="headerInst">{user?.institucion_nombre || 'Convenio Institucional'}</span>
        </div>
        <div className="header-right">
          <button className="topbar-btn-icon">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="profile-trigger" style={{ position: 'relative' }}>
            <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
              <div className="user-avatar" id="userAvatar">{getInitials(user?.nombre, user?.apellido)}</div>
              <div>
                <span className="user-name" id="userName">{user?.nombre} {user?.apellido}</span>
                <span className="user-role">Paciente</span>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-400)' }}>expand_more</span>
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown open" id="profileDropdown" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000 }}>
                <div className="profile-dropdown-header">
                    <div className="pd-name">{user?.nombre} {user?.apellido}</div>
                    <div className="pd-role">Paciente</div>
                </div>
                <button className="profile-dropdown-item"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span> Mi Perfil</button>
                <button className="profile-dropdown-item"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span> Configuración</button>
                <button className="profile-dropdown-item danger" onClick={handleLogout}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span> Cerrar Sesión</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="home-main">
        <div className="greeting">
          <h1 id="greetingMsg">Hola, {user?.nombre}</h1>
          <p>Gestiona tus sesiones y encuentra profesionales disponibles.</p>
        </div>

        <div className="action-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="action-card" style={{ background: 'var(--color-primary)', border: '1px solid var(--color-primary)', color: '#fff' }}>
            <div className="action-card-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff' }}>verified_user</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', margin: '0.25rem 0', color: '#fff' }} id="bolsaDisplay">
              {(maxSesiones - reservas)} <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'rgba(255,255,255,0.7)' }}>/ {maxSesiones}</span>
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Sesiones Disponibles</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('agendar')} style={{ cursor: 'pointer' }}>
            <div className="action-card-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>calendar_month</span>
            </div>
            <h3>Agendar Hora</h3>
            <p>Reserva una cita con un profesional</p>
          </div>
          <div className="action-card" onClick={() => setActiveTab('citas')} style={{ cursor: 'pointer' }}>
            <div className="action-card-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>schedule</span>
            </div>
            <h3>Mis Atenciones</h3>
            <p>Citas programadas e historial clínico</p>
          </div>
        </div>

        {activeTab === 'citas' && (
          <section className="content-section active" id="homeSecCitas" style={{ display: 'block' }}>
            <div className="card">
              <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <h3>Mis Atenciones</h3>
                <div className="auth-tabs" style={{ alignSelf: 'stretch', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '2rem' }}>
                  <button className={`auth-tab ${citasTab === 'proximas' ? 'active' : ''}`} 
                    onClick={() => setCitasTab('proximas')}
                    style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: citasTab === 'proximas' ? '2px solid var(--color-primary)' : 'none', color: citasTab === 'proximas' ? 'var(--color-primary)' : 'var(--text-400)', fontWeight: '600', cursor: 'pointer' }}>
                    Próximas Citas
                  </button>
                  <button className={`auth-tab ${citasTab === 'historial' ? 'active' : ''}`} 
                    onClick={() => setCitasTab('historial')}
                    style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: citasTab === 'historial' ? '2px solid var(--color-primary)' : 'none', color: citasTab === 'historial' ? 'var(--color-primary)' : 'var(--text-400)', cursor: 'pointer', fontWeight: '600' }}>
                    Historial Pasado
                  </button>
                </div>
              </div>
              <div className="card-body">
                <ul className="appointment-list" id="citasList">
                  {loadingHistory ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--text-300)' }}>hourglass_empty</span><br/>Cargando...</div>
                  ) : (
                    citasTab === 'proximas' ? (
                      proximasCitas.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>No tienes citas próximas programadas.</div>
                      ) : (
                        proximasCitas.map((c, i) => {
                          const dt = formatDate(c.fecha_registro);
                          return (
                            <li className="appointment-item" key={i}>
                               <div className="appointment-date"><span className="day">{dt.day}</span><span className="month">{dt.month}</span></div>
                               <div className="appointment-info">
                                 <h4>{c.nombre_especialista}</h4>
                                 <p>Motivo: {c.motivo_consulta} · {dt.weekday} {dt.time}</p>
                               </div>
                               {statusBadge(c.estado_cita || 'agendada')}
                            </li>
                          );
                        })
                      )
                    ) : (
                      historialCitas.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>Aún no tienes un historial de atenciones.</div>
                      ) : (
                        historialCitas.map((c, i) => {
                          const dt = formatDate(c.fecha_registro);
                          return (
                            <li className="appointment-item" key={i}>
                               <div className="appointment-date"><span className="day">{dt.day}</span><span className="month">{dt.month}</span></div>
                               <div className="appointment-info">
                                 <h4>{c.nombre_especialista}</h4>
                                 <p>Motivo: {c.motivo_consulta} · {dt.weekday} {dt.time}</p>
                               </div>
                               {statusBadge(c.estado_cita || 'atendida')}
                            </li>
                          );
                        })
                      )
                    )
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'agendar' && (
          <section className="content-section active" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 className="section-title">Nuestros Profesionales</h2>
                <p className="section-subtitle">Encuentra al especialista que necesitas</p>
              </div>
            </div>
            <div className="prof-layout">
              <div className="prof-sidebar">
                <div className="card" style={{ padding: '1.25rem' }}>
                   
                   <div className="filter-group">
                       <div className="filter-label">Buscar</div>
                       <input type="text" className="filter-search" placeholder="🔍 Nombre del profesional..." value={search} onChange={(e) => setSearch(e.target.value)} />
                   </div>

                   <div className="filter-group">
                       <div className="filter-label">Género</div>
                       <div className="filter-chips">
                          <button className={`filter-chip ${gender === 'todos' ? 'active' : ''}`} onClick={() => setGender('todos')}>Todos</button>
                          <button className={`filter-chip ${gender === 'Mujer' ? 'active' : ''}`} onClick={() => setGender('Mujer')}>Femenino</button>
                          <button className={`filter-chip ${gender === 'Hombre' ? 'active' : ''}`} onClick={() => setGender('Hombre')}>Masculino</button>
                       </div>
                   </div>

                   <div className="filter-group">
                       <div className="filter-label">Grupo Etario</div>
                       <select className="filter-select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Adultos">Adultos</option>
                            <option value="Infantojuvenil">Infantojuvenil</option>
                            <option value="Adolescentes">Adolescentes</option>
                            <option value="Parejas">Parejas</option>
                       </select>
                   </div>

                   <div className="filter-group">
                       <div className="filter-label">Tipo de Terapia</div>
                       <select className="filter-select" value={therapyType} onChange={(e) => setTherapyType(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Individual">Individual</option>
                            <option value="Parejas">De Pareja</option>
                            <option value="Familias">Familiar</option>
                       </select>
                   </div>

                   <div className="filter-group">
                       <div className="filter-label">Categoría de Motivo</div>
                       <select className="filter-select" style={{ marginBottom: '1rem' }} value={motivoCategory} onChange={(e) => { setMotivoCategory(e.target.value); setActiveMotivos([]); }}>
                           <option value="">Todas las categorías</option>
                           {Object.keys(MOTIVOS_CATALOGO || {}).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                       <div className="filter-label">Motivo Específico</div>
                       <div className="filter-chips">
                           {getMotivoChips().map((m, i) => (
                               <button key={i} className={`filter-chip ${activeMotivos.includes(m) ? 'active' : ''}`} onClick={() => handleMotivoToggle(m)}>{m}</button>
                           ))}
                       </div>
                   </div>

                </div>
              </div>
              <div className="prof-results">
                 <div className="prof-count">{professionals.length} profesionales disponibles</div>
                 <div id="professionalsGrid">
                    {loadingProfs ? (
                       <div style={{ textAlign: 'center', padding: '2rem' }}><span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--text-300)' }}>hourglass_empty</span><br/>Buscando...</div>
                    ) : (
                       professionals.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>No se encontraron resultados.</div>
                       ) : (
                          professionals.map((p, i) => {
                             const initials = getInitials(p.nombre, p.apellido);
                             const tags = (p.tipo_terapia || []).slice(0, 2).concat((p.grupo_etario || []).slice(0, 1));
                             return (
                               <div className="prof-card-h" key={i}>
                                  {p.foto ? (
                                     <div className="prof-photo"><img src={p.foto} alt={p.nombre} onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML = initials; }} /></div>
                                  ) : (
                                     <div className="prof-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--color-primary)' }}>{initials}</div>
                                  )}
                                  <div className="prof-body">
                                     <div className="prof-name">{p.titulo || ''} {p.nombre} {p.apellido}</div>
                                     <div className="prof-uni">{p.universidad || p.especialidad}</div>
                                     <div className="prof-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion || ''}</div>
                                     <div>{tags.map((t, idx) => <span key={idx} className="professional-tag">{t}</span>)}</div>
                                     <div className="prof-actions">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleBooking(p.id)} disabled={reservas >= maxSesiones}>
                                          {reservas >= maxSesiones ? 'Límite Alcanzado' : 'Agendar hora'}
                                        </button>
                                     </div>
                                  </div>
                               </div>
                             );
                          })
                       )
                    )}
                 </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        © 2026 SANAD. Todos los derechos reservados.
      </footer>
    </div>
  );
}
