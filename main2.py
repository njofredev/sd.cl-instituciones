import streamlit as st
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# --- 1. CONFIGURACIÓN Y ESTILOS (Sanad.cl Design) ---
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
    }

    /* ELIMINAR NARANJA TOTAL */
    button, input, select, textarea, div[role="button"] {
        outline: none !important;
        box-shadow: none !important;
    }

    /* BOTÓN CONSULTAR Y RESERVAR: Azul Sanad, 100% ancho */
    div.stButton > button {
        background-color: var(--brand-blue) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        width: 100% !important;
        height: 3.2rem !important;
        font-weight: 600 !important;
        margin-top: 10px !important;
        transition: background-color 0.3s ease !important;
    }

    div.stButton > button:hover {
        background-color: #0466C8 !important;
    }

    /* TARJETA ESPECIALISTA: Diseño único con detalles azules */
    .specialist-card {
        background: white;
        border: 1px solid var(--brand-blue-sec);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 5px; /* Reducido para que el botón de abajo se pegue */
        height: 520px; 
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .section-title {
        font-size: 0.7rem; 
        font-weight: 800; 
        color: var(--brand-blue); 
        margin-top: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .description-scroll { 
        font-size: 0.82rem; 
        height: 100px; 
        overflow-y: auto; 
        margin: 12px 0; 
        color: #444; 
        line-height: 1.5;
    }

    .pill { background: #f0f2f6; padding: 2px 10px; border-radius: 12px; font-size: 0.65rem; display: inline-block; margin: 2px; border: 1px solid #e0e0e0; }
    
    .header-container { text-align: center; padding: 0.5rem; margin-bottom: 1rem; }
    .brand-text { margin: 0; font-size: 2.2rem; font-weight: 800; color: #033E8C; }
    .footer-links { text-align: center; margin-top: 50px; font-size: 0.85rem; }
    .footer-links a { color: var(--brand-blue); text-decoration: none; margin: 0 15px; font-weight: 500; }
    </style>
    """, unsafe_allow_html=True)

# --- 2. FUNCIONES DE BACKEND ---
def get_connection():
    try:
        return psycopg2.connect(**st.secrets["postgres"])
    except Exception as e:
        st.error(f"Error conexión: {e}")
        return None

def obtener_datos_paciente(rut):
    conn = get_connection()
    if conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT rut, nombre_completo, email, sede, reservas_realizadas FROM registros_usuarios WHERE rut = %s", (rut,))
            res = cur.fetchone()
            conn.close()
            return res
    return None

def incrementar_reserva(rut):
    conn = get_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("UPDATE registros_usuarios SET reservas_realizadas = reservas_realizadas + 1 WHERE rut = %s", (rut,))
                conn.commit()
            conn.close()
            return True
        except Exception as e:
            st.error(f"Error DB: {e}")
            return False
    return False

def filtrar_especialistas(etario, motivo, nombre):
    conn = get_connection()
    if not conn: return []
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = "SELECT * FROM especialistas WHERE activo = TRUE"
        params = []
        if etario != "Todos": query += " AND %s = ANY(grupo_etario)"; params.append(etario)
        if motivo != "Todos": query += " AND %s = ANY(motivos_consulta)"; params.append(motivo)
        if nombre: query += " AND nombre ILIKE %s"; params.append(f"%{nombre}%")
        cur.execute(query, tuple(params))
        return cur.fetchall()
    finally: conn.close()

# --- 3. LÓGICA DE ESTADOS Y NAVEGACIÓN ---
if 'paso' not in st.session_state: st.session_state.paso = "login"
if 'rut_validado' not in st.session_state: st.session_state.rut_validado = None
if 'url_redirect' not in st.session_state: st.session_state.url_redirect = None

if st.session_state.url_redirect:
    st.components.v1.html(f'<script>window.open("{st.session_state.url_redirect}", "_blank");</script>', height=0)
    st.session_state.url_redirect = None

# --- 4. UI: HEADER ---
st.markdown('<div class="header-container">', unsafe_allow_html=True)
c1, c2, c3 = st.columns([2, 1, 2])
with c2:
    if os.path.exists("logo.png"): st.image("logo.png", use_container_width=True)
st.markdown("""<h1 class="brand-text">sanad<span style="color:#0466C8">.cl</span></h1>
<p style="margin:0; font-size:0.85rem; color:#64748B; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Atención médica para tu familia, sin salir de casa</p></div>""", unsafe_allow_html=True)
st.divider()

if st.session_state.paso == "login":
    st.markdown("### 🔎 Validación de Paciente")
    with st.form("login_form", border=False):
        rut_input = st.text_input("Ingrese RUT:", placeholder="12345678-K")
        submit = st.form_submit_button("Consultar Sistema")
        if submit:
            if rut_input:
                rut_clean = rut_input.replace(".", "").strip().upper()
                paciente = obtener_datos_paciente(rut_clean)
                if paciente:
                    if (paciente.get('reservas_realizadas') or 0) > 3:
                        st.error("⚠️ Límite de 4 atenciones alcanzado.")
                    else:
                        st.session_state.rut_validado = rut_clean
                        st.session_state.paso = "resultados"
                        st.rerun()
                else: st.error("RUT no encontrado.")
else:
    info = obtener_datos_paciente(st.session_state.rut_validado)
    if info:
        # LÓGICA DE ALERTA AMARILLA
        reservas = info.get('reservas_realizadas') or 0
        bg = "#fff3cd" if reservas == 3 else "#d4edda"
        tx = "#856404" if reservas == 3 else "#155724"
        br = "#ffeeba" if reservas == 3 else "#c3e6cb"
        aviso = "⚠️ ¡Atención! Te queda solo 1 cupo disponible." if reservas == 3 else "✅ Registro validado correctamente"

        st.markdown(f"""
            <div style="background-color: {bg}; color: {tx}; padding: 20px; border-radius: 12px; border: 1px solid {br}; margin-bottom: 25px;">
                <h4 style="margin:0 0 10px 0;">{aviso}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size:0.9rem;">
                    <div><b>RUT:</b> {info['rut']}</div>
                    <div><b>Nombre:</b> {info['nombre_completo']}</div>
                    <div><b>Email:</b> {info['email']}</div>
                    <div><b>Sede:</b> {info['sede'] if info['sede'] else 'Sede Central'}</div>
                </div>
                <hr style="border: 0.5px solid {br}; margin: 10px 0;">
                <p style="margin:0;"><b>Uso de cupo:</b> {reservas} de 4 atenciones</p>
            </div>
        """, unsafe_allow_html=True)

    f_nombre = st.text_input("🔍 Buscar por nombre:")
    c1, c2 = st.columns(2)
    with c1: f_etario = st.selectbox("¿Para quién?", ["Todos", "Niños", "Adolescentes", "Adultos", "Adultos mayores"])
    with c2: f_motivo = st.selectbox("Motivo de consulta", ["Todos", "Ansiedad Generalizada", "Depresión Mayor", "Adicciones", "Duelo"])

    specs = filtrar_especialistas(f_etario, f_motivo, f_nombre)
    if specs:
        for i in range(0, len(specs), 2):
            cols = st.columns(2)
            for j in range(2):
                if i + j < len(specs):
                    s = specs[i+j]
                    with cols[j]:
                        st.markdown(f"""
                        <div class="specialist-card">
                            <div style="text-align: center; margin-bottom: 10px;">
                                <img src="{s['foto_url']}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; border: 2px solid #C9E1EE;">
                            </div>
                            <div style="text-align:center;">
                                <b style="color:#033E8C; font-size:1.1rem;">{s['nombre']}</b><br>
                                <span style="font-size:0.8rem; color:#555;">{s['profesion']}</span>
                            </div>
                            <div class="description-scroll">{s['descripcion']}</div>
                            <div style="margin-top:auto;">
                                <div class="section-title">Público:</div>
                                {" ".join([f'<span class="pill">{e}</span>' for e in (s.get('grupo_etario') or [])])}
                                <div class="section-title">Especialidades:</div>
                                {" ".join([f'<span class="pill">{m}</span>' for m in (s.get('motivos_consulta') or [])[:3]])}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        if st.button(f"📅 Reservar con {s['nombre'].split()[0]}", key=f"res_{s['id']}"):
                            if incrementar_reserva(st.session_state.rut_validado):
                                st.session_state.url_redirect = s['link_sacmed']
                                st.rerun()

    st.markdown('<div style="margin-top:20px"></div>', unsafe_allow_html=True)
    if st.button("🚪 Salir"):
        st.session_state.paso = "login"; st.session_state.rut_validado = None; st.rerun()

st.markdown("""
    <div class="footer-links">
        <a href="https://www.sanad.cl">Sitio Web</a>
        <a href="https://www.sanad.cl/faq">Preguntas</a>
        <a href="https://terminos.sanad.cl">Términos</a>
    </div>
    """, unsafe_allow_html=True)
st.caption("© 2026 sanad.cl | Sistema de Agendamiento Inteligente")