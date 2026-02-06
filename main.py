import streamlit as st
import psycopg2
from psycopg2.extras import RealDictCursor

# --- 1. CONFIGURACIÓN Y ESTILOS (Sanad Design System) ---
st.set_page_config(
    page_title="Gestión de Pacientes | sanad.cl",
    page_icon="🧠",
    layout="centered"
)

st.markdown("""
    <style>
    :root {
        --brand-blue: #033E8C;
        --brand-blue-sec: #C9E1EE;
        --brand-green-bg: #d4edda; /* Verde para sección éxito */
        --brand-green-text: #155724;
    }

    /* Ajuste Header */
    [data-testid="stHorizontalBlock"] { align-items: center; }
    .header-title { font-size: 45px !important; font-weight: 800; color: white; margin: 0; }
    
    /* Sección Verde de Datos del Paciente */
    .patient-success-box {
        background-color: var(--brand-green-bg);
        color: var(--brand-green-text);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #c3e6cb;
        margin-bottom: 25px;
    }
    
    .specialist-card {
        background: white;
        border: 1px solid var(--brand-blue-sec);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    </style>
    """, unsafe_allow_html=True)

# --- 2. FUNCIONES DE BASE DE DATOS ---
def get_connection():
    try:
        return psycopg2.connect(**st.secrets["postgres"])
    except Exception as e:
        st.error(f"Error de conexión: {e}")
        return None

def obtener_datos_paciente(rut):
    """Trae la info completa del paciente validado."""
    conn = get_connection()
    if conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT rut, nombre_completo, email, sede FROM registros_usuarios WHERE rut = %s", (rut,))
            return cur.fetchone()
    return None

def filtrar_especialistas(etario, motivo):
    """Filtra especialistas por criterios del catálogo."""
    conn = get_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM especialistas WHERE activo = TRUE"
        params = []
        if etario != "Todos":
            query += " AND %s = ANY(grupo_etario)"
            params.append(etario)
        if motivo != "Todos":
            query += " AND %s = ANY(motivos_consulta)"
            params.append(motivo)
        cur.execute(query, tuple(params))
        return cur.fetchall()
    finally:
        conn.close()

# --- 3. HEADER ---
col_l, col_t = st.columns([1, 4])
with col_l: st.image("logo.png", width=100)
with col_t: st.markdown('<h1 class="header-title">sanad.cl</h1>', unsafe_allow_html=True)
st.divider()

# --- 4. LÓGICA DE NAVEGACIÓN ---
if 'paso' not in st.session_state:
    st.session_state.paso = "login"
if 'rut_validado' not in st.session_state:
    st.session_state.rut_validado = None

# VISTA 1: LOGIN / VALIDACIÓN
if st.session_state.paso == "login":
    st.markdown("### 🔎 Validación de Paciente")
    rut_input = st.text_input("Ingrese RUT:", placeholder="12345678-K")
    
    if st.button("Consultar Sistema", use_container_width=True, type="primary"):
        if rut_input:
            rut_clean = rut_input.replace(".", "").strip().upper()
            paciente = obtener_datos_paciente(rut_clean)
            if paciente:
                st.session_state.rut_validado = rut_clean
                st.session_state.paso = "resultados"
                st.rerun()
            else:
                st.error("El RUT ingresado no existe en los registros de sanad.cl")

# VISTA 2: RESULTADOS Y FILTRO
else:
    # Traemos los datos frescos de la BD para la sección verde
    info = obtener_datos_paciente(st.session_state.rut_validado)
    
    if info:
        # SECCIÓN VERDE REQUERIDA
        st.markdown(f"""
            <div class="patient-success-box">
                <h4 style="margin-top:0;">✅ Registro validado correctamente</h4>
                <p style="margin:2px 0;"><b>RUT:</b> {info['rut']}</p>
                <p style="margin:2px 0;"><b>Nombre:</b> {info['nombre_completo']}</p>
                <p style="margin:2px 0;"><b>Email:</b> {info['email']}</p>
                <p style="margin:2px 0;"><b>Sucursal / Sede:</b> {info['sede'] if info['sede'] else 'No asignada'}</p>
            </div>
        """, unsafe_allow_html=True)
    
    st.markdown("### 🧠 Encuentra a tu especialista")
    
    c1, c2 = st.columns(2)
    with c1:
        f_etario = st.selectbox("¿Para quién?", ["Todos", "Niños (0-12 años)", "Adolescentes (13-17 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"])
    with c2:
        f_motivo = st.selectbox("Motivo de consulta", ["Todos", "Ansiedad Generalizada", "Depresión Mayor", "Conflictos de Pareja", "TDAH (Adultos)", "Duelo"])

    # Mostrar especialistas
    specs = filtrar_especialistas(f_etario, f_motivo)
    
    if specs:
        for s in specs:
            with st.container():
                st.markdown(f"""
                <div class="specialist-card">
                    <div style="display: flex; gap: 15px;">
                        <img src="{s['foto_url']}" style="width:80px; height:80px; border-radius:50%; object-fit:cover;">
                        <div>
                            <b style="color:var(--brand-blue); font-size:1.1rem;">{s['nombre']}</b><br>
                            <small>{s['profesion']}</small><br>
                            <p style="font-size:0.85rem; margin-top:5px;">{s['descripcion'][:150]}...</p>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                st.link_button(f"📅 Agendar con {s['nombre']}", s['link_sacmed'], use_container_width=True, type="primary")
                st.write("")
    
    if st.button("🚪 Salir / Nueva Búsqueda"):
        st.session_state.paso = "login"
        st.session_state.rut_validado = None
        st.rerun()

st.caption("© 2026 sanad.cl | Sistema de Agendamiento Inteligente")