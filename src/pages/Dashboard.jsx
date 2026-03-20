import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardKpis, getDashboardPacientes, loginInstitucion } from '../services/api';
import { MOCK_DATA } from '../utils/mockdata';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip as ChartTooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const roleLabels = {
  admin_sistema: 'Administrador General',
  clinico: 'Usuario Clínico',
  administrativo: 'Usuario Administrativo',
};

const menuConfig = {
  admin_sistema: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'pacientes', icon: 'group', label: 'Pacientes' },
    { id: 'instituciones', icon: 'business', label: 'Instituciones' },
    { id: 'sedes', icon: 'location_on', label: 'Sedes' },
    { id: 'reportes', icon: 'analytics', label: 'Reportes' },
    { id: 'usuarios', icon: 'person', label: 'Usuarios' },
    { id: 'sacmed', icon: 'database', label: 'Acceso API SACMED' },
    { id: 'logs', icon: 'security', label: 'Logs de Acceso' },
    { id: 'configuracion', icon: 'settings', label: 'Configuración' },
  ],
  administrativo: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'pacientes', icon: 'group', label: 'Pacientes' },
    { id: 'sedes', icon: 'location_on', label: 'Sedes' },
    { id: 'reportes', icon: 'analytics', label: 'Reportes' },
    { id: 'usuarios', icon: 'person', label: 'Usuarios' },
    { id: 'logs', icon: 'security', label: 'Logs de Acceso' },
  ],
  clinico: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'pacientes', icon: 'group', label: 'Pacientes' },
    { id: 'reportes', icon: 'analytics', label: 'Reportes' },
  ]
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentSede, setCurrentSede] = useState('todas');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const [sedesList, setSedesList] = useState([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Real Data states
  const [kpis, setKpis] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddPacModal, setShowAddPacModal] = useState(false);
  const [newPacRut, setNewPacRut] = useState('');
  const [newPacNombre, setNewPacNombre] = useState('');
  const [newPacApellido, setNewPacApellido] = useState('');
  const [newPacEmail, setNewPacEmail] = useState('');
  const [newPacSede, setNewPacSede] = useState('');

  // Reporting states
  const [repStartDate, setRepStartDate] = useState('');
  const [repEndDate, setRepEndDate] = useState('');
  const [repExportType, setRepExportType] = useState('atenciones');
  const [repLoading, setRepLoading] = useState(false);

  // SACMED states
  const [sacmedTab, setSacmedTab] = useState('config');
  const [sacSearchType, setSacSearchType] = useState('paciente');
  const [sacSearchRut, setSacSearchRut] = useState('');
  const [sacSearchFrom, setSacSearchFrom] = useState('');
  const [sacSearchTo, setSacSearchTo] = useState('');
  const [sacSearchLoading, setSacSearchLoading] = useState(false);
  const [sacSearchResults, setSacSearchResults] = useState([]);
  const [sacSearchError, setSacSearchError] = useState('');

  // Access Modal states
  const [editRol, setEditRol] = useState('administrativo');
  const [editAcceso, setEditAcceso] = useState('general');
  const [editSedes, setEditSedes] = useState([]);

  // Sede options (hardcoded for now to avoid breaking UI if not in API)
  useEffect(() => {
    setSedesList([
      { id: 'Providencia', nombre: 'Providencia' },
      { id: 'Santiago Centro', nombre: 'Santiago Centro' },
      { id: 'Las Condes', nombre: 'Las Condes' }
    ]);
  }, []);

  // Fetch Summary Data (KPIs & Charts)
  useEffect(() => {
    if (activeTab === 'dashboard') {
      const load = async () => {
        setLoading(true);
        try {
          const data = await getDashboardKpis(currentSede);
          setKpis(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [activeTab, currentSede]);

  // Fetch Patient List
  useEffect(() => {
    if (activeTab === 'pacientes') {
      const load = async () => {
        setLoading(true);
        try {
          const data = await getDashboardPacientes(currentSede);
          setPacientes(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [activeTab, currentSede]);

  const menu = menuConfig[user?.rol] || [];
  const getInitials = (n, a) => (n && a) ? (n[0] + a[0]).toUpperCase() : 'U';
  const handleLogout = () => { logout(); navigate('/login'); };

  // Reporting chart data (MOCK for now)
  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Atenciones',
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  const doughnutData = {
    labels: ['Atendida', 'Cancelada', 'Ausente'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
    }]
  };

  const handleSacmedSearch = (e) => {
    e.preventDefault();
    setSacSearchLoading(true);
    setSacSearchError('');
    setSacSearchResults([]);
    setTimeout(() => {
      setSacSearchResults([
        { id: 1001, fecha: '2026-03-05', hora: '10:00', estado_cita: 'Confirmada', rut_paciente: sacSearchRut || '12345678-K', nombre_paciente: 'Nicolás Jofré', profesional: 'Dra. Fones', estado_pago: 'Pagado' },
      ]);
      setSacSearchLoading(false);
    }, 800);
  };

  const submitAddPaciente = (e) => {
    e.preventDefault();
    setShowAddPacModal(false);
    setNewPacRut(''); setNewPacNombre(''); setNewPacApellido(''); setNewPacEmail(''); setNewPacSede('');
  };

  const handleOpenAccess = (u) => {
    setSelectedUser(u);
    setShowAccessModal(true);
  };

  const handleToggleSede = (id) => {
    // Logic for toggling sedes in access modal if needed
  };

  const handleSaveAccess = () => {
    setShowAccessModal(false);
  };

  // ========================
  // RENDER
  // ========================
  return (
    <div className="dashboard-wrapper">
      {/* ===== MOBILE HEADER ===== */}
      <header className="mobile-header">
        <div className="mobile-logo" onClick={() => navigate('/')}>
          <img src="/src/assets/logo.png" alt="SANAD" />
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      <div className={`dashboard-layout ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {/* ===== SIDEBAR ===== */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'is-open' : ''}`} id="sidebar">
          <div className="sidebar-header" style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }} onClick={() => navigate('/')}>
            <img src="/src/assets/logo.png" alt="SANAD" style={{ width: '120px', height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1) brightness(10)' }} />
            <p id="sidebarInst" style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>
              {user?.rol === 'admin_sistema' ? 'Plataforma Global' : (inst?.nombre || 'Clínica')}
            </p>
          </div>
          <nav className="sidebar-nav" id="sidebarNav">
            {menu.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar" id="sidebarAvatar">{getInitials(user?.nombre, user?.apellido)}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name" id="sidebarName">{user?.nombre} {user?.apellido}</div>
                <div className="sidebar-user-role" id="sidebarRole">{roleLabels[user?.rol] || user?.rol}</div>
              </div>
              <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h2 id="pageTitle">{menu.find(m => m.id === activeTab)?.label || 'Dashboard'}</h2>
            </div>
            <div className="topbar-right">
              {sedesList.length > 0 && (
                <select className="sede-selector" id="sedeSelector" value={currentSede} onChange={(e) => setCurrentSede(e.target.value)}>
                  <option value="todas">📍 Todas las sedes</option>
                  {sedesList.map(s => <option key={s.id} value={s.id}>📍 {s.nombre}</option>)}
                </select>
              )}
            </div>
          </header>

          {/* ========== DASHBOARD TAB ========== */}
          {activeTab === 'dashboard' && (
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>hourglass_empty</span>
                <p style={{ marginTop: '1rem', color: '#64748b' }}>Cargando datos del dashboard...</p>
              </div>
            ) : (
            <>
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card kpi-card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="kpi-icon" style={{ background: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff' }}>event</span>
                  </div>
                  <div className="kpi-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span className="kpi-value" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{kpis?.kpis?.sesiones_totales_mes || 0}</span>
                     <span className="kpi-label" style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500', marginTop: '0.5rem' }}>Citas Agendadas</span>
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>futuras</span>
                  </div>
                </div>
                <div className="card kpi-card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="kpi-icon" style={{ background: '#22c55e', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff' }}>check_circle</span>
                  </div>
                  <div className="kpi-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span className="kpi-value" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{kpis?.kpis?.total_atenciones_pasadas || 0}</span>
                     <span className="kpi-label" style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500', marginTop: '0.5rem' }}>Atenciones</span>
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>completadas</span>
                  </div>
                </div>
                <div className="card kpi-card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="kpi-icon" style={{ background: '#ef4444', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff' }}>group</span>
                  </div>
                  <div className="kpi-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span className="kpi-value" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{kpis?.kpis?.pacientes_activos || 0}</span>
                     <span className="kpi-label" style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500', marginTop: '0.5rem' }}>Pacientes Activos</span>
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>en sistema</span>
                  </div>
                </div>
                <div className="card kpi-card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="kpi-icon" style={{ background: '#f59e0b', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff' }}>monitoring</span>
                  </div>
                  <div className="kpi-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span className="kpi-value" style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>
                       {kpis?.kpis?.porcentaje_asistencia || 0}%
                     </span>
                     <span className="kpi-label" style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500', marginTop: '0.5rem' }}>Asistencia</span>
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>efectividad</span>
                  </div>
                </div>
              </div>

              <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#1e293b', fontSize: '1.125rem' }}>Citas Mensuales</h4>
                  <div style={{ height: '320px' }}>
                     <Bar data={{
                        labels: kpis?.charts?.bar?.labels || ['Ene', 'Feb', 'Mar'],
                        datasets: [{ 
                          label: 'Citas', 
                          data: kpis?.charts?.bar?.data || [0, 0, 0], 
                          backgroundColor: '#1e3a8a', 
                          borderRadius: 4, 
                          barPercentage: 0.6, 
                          categoryPercentage: 0.8 
                        }]
                     }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                        scales: { 
                           y: { beginAtZero: true, border: { dash: [4, 4] }, grid: { color: '#e2e8f0', drawTicks: false }, ticks: { color: '#64748b', font: { size: 11 }, padding: 10 } }, 
                           x: { grid: { display: false, drawBorder: false }, ticks: { color: '#64748b', font: { size: 11 }, padding: 10 } } 
                        }
                     }} />
                  </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#1e293b', fontSize: '1.125rem' }}>Asistencia</h4>
                  <div style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Doughnut data={{
                           labels: ['Atendida', 'Pendiente'],
                           datasets: [{ data: [
                               kpis?.kpis?.total_atenciones_pasadas || 0,
                               kpis?.kpis?.sesiones_totales_mes || 0
                           ], backgroundColor: ['#22c55e', '#3b82f6'], borderWidth: 2, borderColor: '#ffffff', hoverOffset: 4 }]
                        }} options={{ 
                           responsive: true, maintainAspectRatio: false, cutout: '65%', 
                           layout: { padding: 10 },
                           plugins: { 
                              legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rect', padding: 20, font: { size: 11, family: "'Manrope', sans-serif" }, color: '#475569' } },
                              tooltip: { backgroundColor: '#1e293b', padding: 12, titleFont: { size: 13 }, bodyFont: { size: 13 }, cornerRadius: 8 }
                           } 
                        }} />
                     </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header"><h4>Citas Recientes</h4></div>
                <div className="card-body" style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>Paciente</th><th>Profesional</th><th>Fecha</th><th>Motivo</th><th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpis?.citas_recientes?.map((c, i) => (
                        <tr key={i}>
                          <td><strong>{c.paciente_nombre}</strong></td>
                          <td>{c.nombre_especialista}</td>
                          <td>{c.fecha_registro ? new Date(c.fecha_registro).toLocaleDateString('es-CL') : 'N/A'}</td>
                          <td>{c.motivo_consulta}</td>
                          <td><span className={`badge badge-success`}>Aceptada</span></td>
                        </tr>
                      ))}
                      {(!kpis?.citas_recientes || kpis.citas_recientes.length === 0) && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>No hay citas recientes</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
            )
          )}

          {/* ========== PACIENTES TAB ========== */}
          {activeTab === 'pacientes' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Pacientes</h3>
                <button className="btn btn-primary" onClick={() => setShowAddPacModal(true)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>add</span> Añadir Paciente
                </button>
              </div>
              <div className="card-body" style={{ overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pacientes...</div>
                ) : (
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>RUT</th><th>Email</th><th>Sede</th><th>Sesiones</th><th>Estado</th></tr></thead>
                  <tbody>
                    {pacientes.map((p, idx) => {
                      return (
                        <tr key={idx}>
                          <td><strong>{p.nombre_completo}</strong></td>
                          <td>{p.rut}</td><td>{p.email}</td>
                          <td>{p.sede || '-'}</td>
                          <td>{p.reservas_realizadas}</td>
                          <td><span className={`badge badge-success`}>Activo</span></td>
                        </tr>
                      );
                    })}
                    {pacientes.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron pacientes.</td></tr>}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {/* ========== INSTITUCIONES TAB ========== */}
          {activeTab === 'instituciones' && (
            <div className="card">
              <div className="card-header"><h3>Instituciones</h3></div>
              <div className="card-body" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>RUT</th><th>Tipo</th><th>Convenio</th><th>Estado</th></tr></thead>
                  <tbody>
                    {MOCK_DATA.instituciones.map((i, idx) => (
                      <tr key={idx}>
                        <td><strong>{i.nombre}</strong></td><td>{i.rut}</td>
                        <td><span className="badge badge-primary">{i.tipo}</span></td>
                        <td style={{ fontSize: '.75rem', color: 'var(--text-400)' }}>{i.fecha_inicio_convenio} → {i.fecha_fin_convenio || 'Indefinido'}</td>
                        <td><span className={`badge ${i.activo ? 'badge-success' : 'badge-danger'}`}>{i.activo ? 'Activa' : 'Inactiva'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== SEDES TAB ========== */}
          {activeTab === 'sedes' && (
            <div className="card">
              <div className="card-header"><h3>Sedes</h3></div>
              <div className="card-body" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>Ciudad</th><th>Dirección</th><th>Institución</th><th>Estado</th></tr></thead>
                  <tbody>
                    {MOCK_DATA.sedes.map((s, idx) => {
                      const instName = MOCK_DATA.instituciones.find(i => i.id === s.institucion_id)?.nombre || '-';
                      return (
                        <tr key={idx}>
                          <td><strong>{s.nombre}</strong></td><td>{s.ciudad}</td><td>{s.direccion}</td>
                          <td>{instName}</td>
                          <td><span className={`badge ${s.activa ? 'badge-success' : 'badge-danger'}`}>{s.activa ? 'Activa' : 'Inactiva'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== REPORTES TAB ========== */}
          {activeTab === 'reportes' && (
            <>
              <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: '700' }}>Centro de Reportes</h3>
                  <p style={{ color: 'var(--text-500)', marginTop: '0.25rem' }}>Filtra y genera reportes de atenciones, pacientes y especialistas.</p>
                </div>
              </div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body" style={{ padding: '1.5rem' }}>
                  <div className="report-filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Fecha Desde</label>
                      <input type="date" className="form-control" value={repStartDate} onChange={e => setRepStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Fecha Hasta</label>
                      <input type="date" className="form-control" value={repEndDate} onChange={e => setRepEndDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Tipo de Reporte</label>
                      <select className="form-control" value={repExportType} onChange={e => setRepExportType(e.target.value)}>
                        <option value="atenciones">Atenciones</option>
                        <option value="pacientes">Padrón de Pacientes</option>
                        <option value="especialistas">Rendimiento Médico</option>
                        <option value="motivos">Motivos de Consulta</option>
                      </select>
                    </div>
                    <div>
                      <button className="btn btn-primary" style={{ width: '100%' }} disabled={repLoading}>
                        {repLoading ? 'Generando...' : 'Generar Reporte'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reportes-charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>Citas por Mes</h4>
                  <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>Distribución de Asistencia</h4>
                  <Doughnut data={doughnutData} options={{ responsive: true }} />
                </div>
              </div>
            </>
          )}

          {/* ========== USUARIOS TAB ========== */}
          {activeTab === 'usuarios' && (
            <div className="card">
              <div className="card-header"><h3>Usuarios Institucionales</h3></div>
              <div className="card-body" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acceso</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {MOCK_DATA.usuarios_institucionales.map((u, idx) => (
                      <tr key={idx}>
                        <td><strong>{u.nombre} {u.apellido}</strong></td><td>{u.email}</td>
                        <td><span className="badge badge-primary">{roleLabels[u.rol] || u.rol}</span></td>
                        <td>{u.acceso}</td>
                        <td><span className={`badge ${u.activo ? 'badge-success' : 'badge-danger'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => handleOpenAccess(u)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== SACMED TAB ========== */}
          {activeTab === 'sacmed' && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button className={`btn ${sacmedTab === 'config' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSacmedTab('config')}>Configuración API</button>
                <button className={`btn ${sacmedTab === 'search' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSacmedTab('search')}>Buscar Eventos</button>
              </div>

              {sacmedTab === 'config' && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Configuración de Conexión SACMED</h4>
                  <p style={{ color: 'var(--text-500)' }}>La integración con la API de SACMED permite sincronizar citas, pacientes y agendas de especialistas.</p>
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: '600' }}>
                      <span className="material-symbols-outlined">check_circle</span> Conexión activa
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#166534' }}>Última sincronización exitosa: hace 5 minutos</p>
                  </div>
                </div>
              )}

              {sacmedTab === 'search' && (
                <>
                  <div className="card" style={{ marginBottom: '1.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div className="card-header" style={{ padding: '1.5rem 1.5rem 0 1.5rem', borderBottom: 'none' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-800)' }}>Buscar Eventos en SACMED</h4>
                      <p style={{ color: 'var(--text-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Filtra y visualiza pacientes o agendas de especialistas conectados a la API.</p>
                    </div>
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                      <form onSubmit={handleSacmedSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-700)', marginBottom: '0.5rem' }}>Tipo de Búsqueda</label>
                          <select className="form-control" value={sacSearchType} onChange={(e) => setSacSearchType(e.target.value)} style={{ height: '42px', borderRadius: '8px' }}>
                            <option value="paciente">Por Paciente (RUT)</option>
                            <option value="profesional">Por Profesional</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-700)', marginBottom: '0.5rem' }}>RUT {sacSearchType === 'paciente' ? 'Paciente' : 'Profesional'} <span style={{ color: 'var(--danger-500)' }}>*</span></label>
                          <input type="text" className="form-control" placeholder="12345678-9" value={sacSearchRut} onChange={(e) => setSacSearchRut(e.target.value)} style={{ height: '42px', borderRadius: '8px' }} required />
                        </div>
                        {sacSearchType === 'profesional' && (
                          <div style={{ display: 'contents' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-700)', marginBottom: '0.5rem' }}>Fecha Desde <span style={{ color: 'var(--danger-500)' }}>*</span></label>
                              <input type="date" className="form-control" value={sacSearchFrom} onChange={(e) => setSacSearchFrom(e.target.value)} style={{ height: '42px', borderRadius: '8px' }} />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-700)', marginBottom: '0.5rem' }}>Fecha Hasta <span style={{ color: 'var(--danger-500)' }}>*</span></label>
                              <input type="date" className="form-control" value={sacSearchTo} onChange={(e) => setSacSearchTo(e.target.value)} style={{ height: '42px', borderRadius: '8px' }} />
                            </div>
                          </div>
                        )}
                        <div className="form-group" style={{ margin: 0 }}>
                          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={sacSearchLoading}>
                            {sacSearchLoading ? 'Buscando...' : <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span> Buscar</>}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="card" style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-800)' }}>Resultados API SACMED</h4>
                      {sacSearchResults.length > 0 && <span style={{ color: 'var(--color-primary)', fontSize: '.875rem', fontWeight: '600' }}>{sacSearchResults.length} eventos encontrados</span>}
                    </div>
                    <div className="card-body" style={{ overflowX: 'auto', padding: '0 1.5rem 1.5rem 1.5rem' }}>
                      {sacSearchError && <p style={{ color: 'var(--danger-500)', textAlign: 'center', padding: '1.5rem 0' }}>{sacSearchError}</p>}
                      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th>ID Evento</th><th>Fecha</th><th>Horario</th><th>Estado Cita</th><th>RUT Paciente</th><th>Paciente</th><th>Profesional</th><th>Estado Pago</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sacSearchResults.length === 0 && !sacSearchError && (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-400)' }}>Realiza una búsqueda para ver resultados.</td></tr>
                          )}
                          {sacSearchResults.map((r, i) => (
                            <tr key={i}>
                              <td>{r.id}</td><td>{r.fecha}</td><td>{r.hora}</td>
                              <td><span className={`badge ${r.estado_cita === 'Confirmada' ? 'badge-success' : 'badge-primary'}`}>{r.estado_cita}</span></td>
                              <td>{r.rut_paciente}</td><td>{r.nombre_paciente}</td><td>{r.profesional}</td>
                              <td style={{ fontSize: '0.875rem', color: 'var(--text-700)' }}>{r.estado_pago}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ========== LOGS TAB ========== */}
          {activeTab === 'logs' && (
            <div className="card">
              <div className="card-header"><h3>Logs de Acceso</h3></div>
              <div className="card-body" style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Usuario</th><th>Tipo</th><th>Acción</th><th>Fecha</th><th>IP</th></tr></thead>
                  <tbody>
                    {MOCK_DATA.logs_acceso.map((l, idx) => (
                      <tr key={idx}>
                        <td><strong>{l.usuario}</strong></td><td>{l.tipo}</td>
                        <td><span className={`badge ${l.accion === 'LOGIN' ? 'badge-success' : l.accion === 'LOGOUT' ? 'badge-primary' : 'badge-danger'}`}>{l.accion}</span></td>
                        <td>{l.fecha}</td><td style={{ fontFamily: 'monospace' }}>{l.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== CONFIGURACION TAB ========== */}
          {activeTab === 'configuracion' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3>Configuración del Sistema</h3>
              <p style={{ color: 'var(--text-500)', marginTop: '0.5rem' }}>Gestione las configuraciones globales de la plataforma SANAD.</p>
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong>Zona Horaria:</strong> America/Santiago (UTC-3)
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong>Idioma:</strong> Español (Chile)
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong>Versión:</strong> SANAD v1.0.0 — Prototipo
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== ACCESS MODAL ========== */}
      {showAccessModal && selectedUser && (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content card" style={{ width: '100%', maxWidth: '550px', margin: '20px', borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0 }}>Gestionar Acceso — {selectedUser.nombre} {selectedUser.apellido}</h3>
              <button onClick={() => setShowAccessModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-400)' }}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              {selectedUser.rol === 'admin_sistema' ? (
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', color: '#1e40af' }}>
                  <strong>Administrador de Sistema</strong> — Acceso total. No se puede modificar.
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Rol</label>
                    <select className="form-control" value={editRol} onChange={e => setEditRol(e.target.value)}>
                      <option value="administrativo">Administrativo</option>
                      <option value="clinico">Clínico</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Tipo de Acceso</label>
                    <select className="form-control" value={editAcceso} onChange={e => setEditAcceso(e.target.value)}>
                      <option value="general">General (todas las sedes)</option>
                      <option value="limitado">Limitado (sedes específicas)</option>
                    </select>
                  </div>
                  {editAcceso === 'limitado' && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Sedes Autorizadas</label>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {MOCK_DATA.sedes.filter(s => s.institucion_id === selectedUser.institucion_id).map(sede => (
                          <label key={sede.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: editSedes.includes(sede.id) ? '#eff6ff' : '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={editSedes.includes(sede.id)} onChange={() => handleToggleSede(sede.id)} />
                            <div>
                              <div style={{ fontWeight: '500' }}>{sede.nombre}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-500)' }}>{sede.ciudad}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="card-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowAccessModal(false)}>Cancelar</button>
              {selectedUser.rol !== 'admin_sistema' && (
                <button className="btn btn-primary" onClick={handleSaveAccess}>Guardar Cambios</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== ADD PATIENT MODAL ========== */}
      {showAddPacModal && (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content card" style={{ width: '100%', maxWidth: '500px', margin: '20px', borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0 }}>Añadir Nuevo Paciente</h3>
              <button onClick={() => setShowAddPacModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-400)' }}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <form onSubmit={submitAddPaciente} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>RUT</label>
                  <input type="text" className="form-control" placeholder="12345678-9" required value={newPacRut} onChange={e => setNewPacRut(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Nombre</label>
                  <input type="text" className="form-control" required value={newPacNombre} onChange={e => setNewPacNombre(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Apellido</label>
                  <input type="text" className="form-control" required value={newPacApellido} onChange={e => setNewPacApellido(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" className="form-control" value={newPacEmail} onChange={e => setNewPacEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Sede</label>
                  <select className="form-control" value={newPacSede} onChange={e => setNewPacSede(e.target.value)}>
                    <option value="">Seleccionar sede</option>
                    {sedesList.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Registrar Paciente</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
