import streamlit as st
import psycopg2
from psycopg2.extras import RealDictCursor
import os

st.set_page_config(page_title="Sanad.cl | Reserva Médica", page_icon="🧠", layout="centered")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    
    textarea:focus, input:focus, select:focus, div[data-baseweb="select"] > div:focus-within {
        border-color: #033E8C !important;
        box-shadow: 0 0 0 1px rgba(3, 62, 140, 0.1) !important;
        outline: none !important;
    }

    div.stButton > button, div.stFormSubmitButton > button {
        background-color: #033E8C !important;
        color: #FFFFFF !important;
        border: 1px solid #033E8C !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        height: 3.2rem !important;
        width: 100% !important;
        transition: all 0.3s ease !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    div.stButton > button:hover, div.stFormSubmitButton > button:hover {
        background-color: #022d66 !important;
        border-color: #022d66 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(3, 62, 140, 0.3) !important;
    }

    .user-box-green { background: #F0FDF4; padding: 22px; border-radius: 12px; border: 1px solid #DCFCE7; margin-bottom: 25px; }
    .user-box-yellow { background: #FFFBEB; padding: 22px; border-radius: 12px; border: 1px solid #FEF3C7; margin-bottom: 25px; }
    .user-box-red { background: #FEF2F2; padding: 22px; border-radius: 12px; border: 1px solid #FEE2E2; margin-bottom: 25px; }

    .specialist-card {
        background: white; border: 1px solid #E2E8F0; border-radius: 16px;
        padding: 24px; text-align: center; height: 580px;
        display: flex; flex-direction: column; align-items: center;
        transition: all 0.3s ease;
    }
    
    .specialist-card:hover { border-color: #033E8C; box-shadow: 0 12px 24px rgba(0,0,0,0.05); }

    .profile-img { width: 95px; height: 95px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 2px solid #C9E1EE; }
    .spec-name { color: #033E8C; font-size: 1.15rem; font-weight: 800; margin-bottom: 2px; }
    .spec-prof { color: #64748B; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
    
    .description-scroll { font-size: 0.82rem; height: 110px; overflow-y: auto; margin: 15px 0; color: #444; line-height: 1.5; text-align: center; }
    .section-title { font-size: 0.65rem; font-weight: 800; color: #033E8C; margin-top: 10px; text-transform: uppercase; text-align: left; width: 100%; }
    .pill { background: #F0F7FF; color: #033E8C; padding: 3px 10px; border-radius: 12px; font-size: 0.68rem; margin: 2px; display: inline-block; font-weight: 600; border: 1px solid #C9E1EE; }
    
    .footer-main { text-align: center; padding: 40px 0; margin-top: 60px; border-top: 1px solid #E2E8F0; }
    .footer-links a { color: #033E8C; text-decoration: none; margin: 0 15px; font-weight: 600; font-size: 0.9rem; }
    </style>
    """, unsafe_allow_html=True)

def get_connection():
    try: return psycopg2.connect(**st.secrets["postgres"])
    except: return None

def obtener_datos_paciente(rut):
    conn = get_connection()
    if conn and rut:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT rut, nombre_completo, email, sede, reservas_realizadas FROM registros_usuarios WHERE rut = %s", (rut,))
            res = cur.fetchone()
            conn.close(); return res
    return None

@st.cache_data(ttl=600)
def obtener_categorias_db():
    conn = get_connection()
    if conn:
        with conn.cursor() as cur:
            cur.execute("SELECT DISTINCT categoria FROM mapeo_consultas ORDER BY 1")
            res = [row[0] for row in cur.fetchall()]; conn.close(); return res
    return []

@st.cache_data(ttl=600)
def obtener_motivos_db(categoria):
    conn = get_connection()
    if conn:
        with conn.cursor() as cur:
            cur.execute("SELECT DISTINCT motivo_tecnico FROM mapeo_consultas WHERE categoria = %s ORDER BY 1", (categoria,))
            res = [row[0] for row in cur.fetchall()]; conn.close(); return res
    return []

def registrar_atencion_completa(rut, nombre_especialista, sede, motivo):
    conn = get_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("UPDATE registros_usuarios SET reservas_realizadas = reservas_realizadas + 1 WHERE rut = %s", (rut,))
                cur.execute("INSERT INTO logs_atenciones (rut_paciente, nombre_especialista, sede_paciente, motivo_consulta) VALUES (%s, %s, %s, %s)", (rut, nombre_especialista, sede, motivo))
                conn.commit(); conn.close(); return True
        except: return False
    return False

if 'paso' not in st.session_state: st.session_state.paso = "login"
if 'rut_validado' not in st.session_state: st.session_state.rut_validado = None
if 'confirmado' not in st.session_state: st.session_state.confirmado = False
if 'link_temp' not in st.session_state: st.session_state.link_temp = ""

st.markdown("<div style='text-align: center; margin-bottom: 20px;'>", unsafe_allow_html=True)
if os.path.exists("logo.png"): st.image("logo.png", width=120)
st.markdown("""
    <h1 style='color:#033E8C; margin:0;'>sanad<span style='color:#0466C8'>.cl</span></h1>
    <p style='margin:0; font-size:0.85rem; color:#64748B; font-weight:600; text-transform:uppercase; letter-spacing:1px;'>Atención médica para tu familia, sin salir de casa</p>
</div>""", unsafe_allow_html=True)
st.divider()

if st.session_state.paso == "login":
    st.markdown("### 🔎 Validación de Usuario")
    with st.form("login_form", border=False):
        rut_input = st.text_input("Ingresa tu RUT:", placeholder="12345678K")
        if st.form_submit_button("Consultar Sistema", use_container_width=True):
            if rut_input:
                rut_clean = rut_input.replace(".", "").strip().upper()
                paciente = obtener_datos_paciente(rut_clean)
                if paciente:
                    if (paciente.get('reservas_realizadas') or 0) >= 4: 
                        st.error("⚠️ Has alcanzado el límite máximo de 4 atenciones permitidas.")
                    else: 
                        st.session_state.rut_validado = rut_clean; st.session_state.paso = "resultados"; st.rerun()
                else: st.error("RUT no encontrado.")

else:
    info = obtener_datos_paciente(st.session_state.rut_validado)
    reservas = info['reservas_realizadas'] or 0
    
    # Lógica de colores y mensajes de estado
    if reservas >= 4:
        box_class = "user-box-red"
        status_msg = "⚠️ Has completado tus cupos disponibles"
        status_color = "#991B1B"
    elif reservas == 3:
        box_class = "user-box-yellow"
        status_msg = "⚠️ ¡Atención! Te queda tu último cupo disponible"
        status_color = "#92400E"
    else:
        box_class = "user-box-green"
        status_msg = "✅ Registro validado correctamente"
        status_color = "#166534"
    
    st.markdown(f"""<div class="{box_class}">
        <h3 style="margin:0; color:{status_color};">{status_msg}</h3>
        <p style="margin:10px 0 5px 0; font-size:0.95rem;"><b>Paciente:</b> {info['nombre_completo']} | <b>RUT:</b> {info['rut']}</p>
        <p style="margin:0; font-size:0.95rem;"><b>Sede:</b> {info['sede'] or 'Sede Central'} | <b>Estado:</b> {reservas} de 4 cupos utilizados</p>
    </div>""", unsafe_allow_html=True)

    if st.session_state.confirmado:
        st.success("✅ ¡Atención registrada! Redirigiendo a plataforma de agendamiento sacmed...")
        st.components.v1.html(f'<script>window.open("{st.session_state.link_temp}", "_blank");</script>', height=0)
        
        # Al alcanzar 4, el botón de finalizar saca al usuario del sistema
        btn_label = "Finalizar proceso y salir" if reservas >= 4 else "Volver al inicio"
        if st.button(btn_label):
            if reservas >= 4:
                st.session_state.paso = "login"; st.session_state.rut_validado = None
            st.session_state.confirmado = False; st.rerun()
    else:
        # Bloqueo preventivo si ya tiene 4 cupos y no está en modo confirmación
        if reservas >= 4:
            st.warning("Ya no puedes agendar más especialistas en este ciclo.")
            if st.button("🚪 Salir del Sistema", use_container_width=True):
                st.session_state.paso = "login"; st.session_state.rut_validado = None; st.rerun()
        else:
            st.markdown("### 🎯 Encuentra tu Especialista")
            categorias = obtener_categorias_db()
            c1, col2 = st.columns(2)
            with c1: cat_sel = st.selectbox("Categoría Principal", ["Seleccionar..."] + categorias)
            with col2:
                if cat_sel != "Seleccionar...":
                    motivos = obtener_motivos_db(cat_sel)
                    motivo_sel = st.selectbox("Motivo específico", ["Seleccionar..."] + motivos)
                else:
                    st.selectbox("Motivo específico", ["Primero elige categoría"], disabled=True)
                    motivo_sel = None

            if motivo_sel and motivo_sel != "Seleccionar...":
                conn = get_connection()
                if conn:
                    cur = conn.cursor(cursor_factory=RealDictCursor)
                    cur.execute("SELECT DISTINCT e.* FROM especialistas e JOIN mapeo_consultas m ON e.nombre = m.profesional WHERE e.activo = TRUE AND m.motivo_tecnico = %s AND m.categoria = %s", (motivo_sel, cat_sel))
                    specs = cur.fetchall(); conn.close()
                    if specs:
                        for i in range(0, len(specs), 2):
                            cols = st.columns(2)
                            for j in range(2):
                                if i + j < len(specs):
                                    s = specs[i+j]
                                    with cols[j]:
                                        st.markdown(f"""<div class="specialist-card">
                                            <img src="{s['foto_url']}" class="profile-img">
                                            <div class="spec-name">{s['nombre']}</div>
                                            <div class="spec-prof">{s['profesion']}</div>
                                            <div class="description-scroll">{s['descripcion']}</div>
                                            <div style="margin-top:auto; width:100%;">
                                                <div class="section-title">Público:</div><div style="text-align:left;">{" ".join([f'<span class="pill">{e}</span>' for e in (s.get('grupo_etario') or [])])}</div>
                                                <div class="section-title" style="margin-top:8px;">Especialidades:</div><div style="text-align:left; margin-bottom:15px;">{" ".join([f'<span class="pill">{m}</span>' for m in (s.get('motivos_consulta') or [])[:3]])}</div>
                                            </div>
                                        </div>""", unsafe_allow_html=True)
                                        if st.button(f"Agendar con {s['nombre'].split()[0]}", key=f"res_{s['id']}", use_container_width=True):
                                            if registrar_atencion_completa(st.session_state.rut_validado, s['nombre'], info['sede'], motivo_sel):
                                                st.session_state.link_temp = s["link_sacmed"]
                                                st.session_state.confirmado = True; st.rerun()

    st.divider()
    if st.button("🚪 Cerrar Sesión", use_container_width=True):
        st.session_state.paso = "login"; st.session_state.rut_validado = None; st.session_state.confirmado = False; st.rerun()

st.markdown("""<div class="footer-main"><div class="footer-links">
    <a href="https://sanad.cl">Web Principal</a><a href="https://www.sanad.cl/especialidad/psicologia">Especialistas</a><a href="https://sanad.cl/contacto">Contacto</a>
    </div><p>© 2026 sanad.cl | Tecnología para tu salud</p></div>""", unsafe_allow_html=True)