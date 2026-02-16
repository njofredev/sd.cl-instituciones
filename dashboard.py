import streamlit as st
import psycopg2
import pandas as pd
import plotly.express as px
import os
from datetime import datetime
from io import BytesIO

# --- CONFIGURACIÓN DE PÁGINA ---
# Cambiado a "Admin - Instituciones" según solicitud
st.set_page_config(page_title="Admin - Instituciones", page_icon="🏢", layout="wide")

def check_password():
    if "password_correct" not in st.session_state:
        st.session_state.password_correct = False
    if st.session_state.password_correct:
        return True

    st.markdown("<div style='text-align: center; margin-top: 50px;'>", unsafe_allow_html=True)
    if os.path.exists("logo.png"): st.image("logo.png", width=150)
    st.title("Acceso Administrativo")
    st.markdown("</div>", unsafe_allow_html=True)

    with st.form("login_admin"):
        password = st.text_input("Contraseña de Administrador", type="password")
        if st.form_submit_button("Entrar al Sistema"):
            if password == st.secrets["admin_password"]:
                st.session_state.password_correct = True
                st.rerun()
            else:
                st.error("Credenciales incorrectas.")
    return False

if check_password():
    # --- CSS DINÁMICO MEJORADO ---
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

        div[data-testid="stMetric"], .stPlotlyChart, div.stDataFrame, .stSelectbox, .stNumberInput, .stTextInput {
            background-color: var(--secondary-background-color) !important;
            border: 1px solid rgba(128, 128, 128, 0.2) !important;
            border-radius: 16px !important;
            padding: 15px !important;
        }

        .view-description { color: var(--text-color); opacity: 0.8; font-size: 1rem; margin-top: -15px; margin-bottom: 25px; }
        
        div.stButton > button {
            width: 100% !important; height: 48px;
            background-color: #2E6BFF !important; color: #FFFFFF !important;
            border-radius: 10px !important; border: none !important;
            font-weight: 600; margin-top: 10px;
        }

        [data-testid="stSidebar"] div.stButton > button {
            background-color: rgba(255, 75, 75, 0.1) !important;
            border: 1px solid #FF4B4B !important;
            color: #FF4B4B !important;
            height: 40px;
        }
        [data-testid="stSidebar"] div.stButton > button:hover {
            background-color: #FF4B4B !important; color: #FFFFFF !important;
        }
        </style>
        """, unsafe_allow_html=True)

    def get_connection():
        try: return psycopg2.connect(**st.secrets["postgres"])
        except: return None

    def cargar_datos(query):
        conn = get_connection()
        if conn:
            df = pd.read_sql(query, conn)
            for col in df.columns:
                if 'fecha' in col.lower():
                    df[col] = pd.to_datetime(df[col]).dt.tz_localize('UTC').dt.tz_convert('America/Santiago').dt.strftime('%d-%m-%Y %H:%M:%S')
            conn.close(); return df
        return pd.DataFrame()

    def to_excel(df):
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Reporte')
        return output.getvalue()

    with st.sidebar:
        if os.path.exists("logo.png"): st.image("logo.png", width=120)
        st.title("Sanad Admin")
        menu = st.radio("Navegación", ["Dashboard General", "Historial de Atenciones", "Gestión de Usuarios", "Gestión de Motivos", "Control de Especialistas", "Centro de Descargas"])
        st.divider()
        st.caption(f"Chile/Santiago: {datetime.now().strftime('%H:%M')}")
        if st.button("Cerrar Sesión"):
            st.session_state.password_correct = False
            st.rerun()

    # --- 1. DASHBOARD GENERAL ---
    if menu == "Dashboard General":
        st.title("Panel de Control")
        st.markdown('<p class="view-description">Indicadores de gestión y rendimiento de la plataforma.</p>', unsafe_allow_html=True)
        
        c1, c2, c3, c4 = st.columns(4)
        df_u = cargar_datos("SELECT count(*) as t FROM registros_usuarios")
        total_u = df_u.iloc[0,0] if not df_u.empty else 0
        df_r = cargar_datos("SELECT sum(reservas_realizadas) as t FROM registros_usuarios")
        total_r = int(df_r.iloc[0,0]) if not df_r.empty and df_r.iloc[0,0] else 0
        df_activos = cargar_datos("SELECT count(*) as t FROM registros_usuarios WHERE reservas_realizadas > 0")
        pacientes_activos = df_activos.iloc[0,0] if not df_activos.empty else 0
        
        # Métricas limpias sin indicador delta para centrado vertical óptimo
        c1.metric("Pacientes Totales", total_u)
        c2.metric("Atenciones Totales", total_r)
        c3.metric("Conversión", f"{round((pacientes_activos/total_u*100),1) if total_u > 0 else 0}%")
        c4.metric("Uso Promedio", f"{round(total_r/pacientes_activos, 1) if pacientes_activos > 0 else 0} res")

        st.divider()
        g1, g2 = st.columns(2)
        with g1:
            df_s = cargar_datos("SELECT sede as \"Sede\", count(*) as \"Cantidad\" FROM registros_usuarios GROUP BY sede")
            if not df_s.empty: st.plotly_chart(px.pie(df_s, values='Cantidad', names='Sede', hole=0.5, title="Distribución por Sede"), use_container_width=True)
        with g2:
            df_m = cargar_datos("SELECT motivo_consulta as \"Motivo\", count(*) as \"Cantidad\" FROM logs_atenciones WHERE motivo_consulta IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 5")
            if not df_m.empty: st.plotly_chart(px.bar(df_m, x='Cantidad', y='Motivo', orientation='h', title="Top 5 Motivos de Consulta"), use_container_width=True)

    # --- 2. HISTORIAL ---
    elif menu == "Historial de Atenciones":
        st.title("Historial")
        st.markdown('<p class="view-description">Registro cronológico de todas las interacciones médico-paciente.</p>', unsafe_allow_html=True)
        df_h = cargar_datos("""SELECT l.fecha_registro as "Fecha", u.nombre_completo as "Paciente", l.nombre_especialista as "Médico", l.motivo_consulta as "Motivo", l.sede_paciente as "Sede"
            FROM logs_atenciones l LEFT JOIN registros_usuarios u ON l.rut_paciente = u.rut ORDER BY l.fecha_registro DESC""")
        st.dataframe(df_h, use_container_width=True, hide_index=True)

    # --- 3. GESTIÓN DE USUARIOS ---
    elif menu == "Gestión de Usuarios":
        st.title("Pacientes")
        st.markdown('<p class="view-description">Administración integral de la base de datos de pacientes.</p>', unsafe_allow_html=True)
        
        with st.expander("➕ Agregar Nuevo Paciente"):
            with st.form("form_nuevo"):
                c1, c2, c3 = st.columns(3)
                n_rut = c1.text_input("RUT")
                n_nom = c2.text_input("Nombre Completo")
                n_eml = c3.text_input("Email")
                c4, c5 = st.columns(2)
                n_sed = c4.selectbox("Sede", ["Santiago Centro", "Las Condes", "Providencia", "Viña del Mar", "Concepción", "Antofagasta", "La Serena", "Temuco", "Sede Central"])
                n_cup = c5.number_input("Atenciones Iniciales", 0)
                if st.form_submit_button("Registrar Paciente"):
                    conn = get_connection()
                    if conn:
                        cur = conn.cursor()
                        cur.execute("INSERT INTO registros_usuarios (rut, nombre_completo, email, sede, reservas_realizadas) VALUES (%s,%s,%s,%s,%s)", (n_rut, n_nom, n_eml, n_sed, n_cup))
                        conn.commit(); conn.close(); st.success("Usuario Creado"); st.rerun()

        df_p = cargar_datos("SELECT id, rut, nombre_completo, email, sede, reservas_realizadas FROM registros_usuarios ORDER BY id DESC")
        st.dataframe(df_p.drop(columns=['id']), use_container_width=True, hide_index=True)
        
        st.markdown("### Modificar Registro")
        rut_edit = st.selectbox("1. Seleccione el RUT para modificar datos", ["---"] + list(df_p['rut']))
        
        if rut_edit != "---":
            datos_paciente = df_p[df_p['rut'] == rut_edit].iloc[0]
            with st.form("form_edit"):
                st.info(f"Editando: {datos_paciente['nombre_completo']}")
                c1, c2 = st.columns(2)
                up_nom = c1.text_input("Nombre Completo", value=datos_paciente['nombre_completo'])
                up_eml = c2.text_input("Email", value=datos_paciente['email'] if datos_paciente['email'] else "")
                
                c3, c4 = st.columns(2)
                sedes = ["Santiago Centro", "Las Condes", "Providencia", "Viña del Mar", "Concepción", "Antofagasta", "La Serena", "Temuco", "Sede Central"]
                idx_s = sedes.index(datos_paciente['sede']) if datos_paciente['sede'] in sedes else 0
                up_sed = c3.selectbox("Sede", sedes, index=idx_s)
                up_res = c4.number_input("Atenciones", value=int(datos_paciente['reservas_realizadas']))
                
                if st.form_submit_button("Guardar Cambios"):
                    conn = get_connection()
                    if conn:
                        cur = conn.cursor()
                        cur.execute("UPDATE registros_usuarios SET nombre_completo=%s, email=%s, sede=%s, reservas_realizadas=%s WHERE rut=%s", (up_nom, up_eml, up_sed, up_res, rut_edit))
                        conn.commit(); conn.close(); st.success("Registro Actualizado"); st.rerun()

    # --- 4. GESTIÓN DE MOTIVOS ---
    elif menu == "Gestión de Motivos":
        st.title("Análisis de Motivos de Consulta")
        st.markdown('<p class="view-description">Estadísticas y registro detallado de las necesidades de los pacientes.</p>', unsafe_allow_html=True)
        
        m1, m2 = st.columns(2)
        with m1:
            df_m_stats = cargar_datos("SELECT motivo_consulta as \"Motivo\", count(*) as \"Cantidad\" FROM logs_atenciones GROUP BY 1 ORDER BY 2 DESC LIMIT 10")
            if not df_m_stats.empty:
                st.plotly_chart(px.bar(df_m_stats, x='Cantidad', y='Motivo', orientation='h', title="Top 10 Motivos más recurrentes", color='Cantidad', color_continuous_scale='Blues'), use_container_width=True)
        with m2:
            df_m_sede = cargar_datos("SELECT sede_paciente as \"Sede\", count(*) as \"Consultas\" FROM logs_atenciones GROUP BY 1")
            if not df_m_sede.empty:
                st.plotly_chart(px.pie(df_m_sede, values='Consultas', names='Sede', title="Volumen de Consultas por Sede", hole=0.4), use_container_width=True)

        st.divider()
        st.markdown("### Registro Detallado de Motivos")
        df_motivos_all = cargar_datos("""
            SELECT l.fecha_registro as "Fecha", l.motivo_consulta as "Motivo", u.nombre_completo as "Paciente", l.nombre_especialista as "Especialista"
            FROM logs_atenciones l 
            JOIN registros_usuarios u ON l.rut_paciente = u.rut 
            ORDER BY l.fecha_registro DESC
        """)
        
        filtro_motivo = st.text_input("🔍 Buscar por motivo o paciente...", placeholder="Ej: Ansiedad")
        if filtro_motivo:
            df_motivos_all = df_motivos_all[df_motivos_all['Motivo'].str.contains(filtro_motivo, case=False, na=False) | df_motivos_all['Paciente'].str.contains(filtro_motivo, case=False, na=False)]
            
        st.dataframe(df_motivos_all, use_container_width=True, hide_index=True)

    # --- 5. CONTROL DE ESPECIALISTAS ---
    elif menu == "Control de Especialistas":
        st.title("Especialistas")
        st.markdown('<p class="view-description">Control de disponibilidad de la cartilla médica pública.</p>', unsafe_allow_html=True)
        df_e = cargar_datos("SELECT id, nombre as \"Nombre\", profesion as \"Especialidad\", activo as \"Activo\" FROM especialistas ORDER BY nombre ASC")
        ed = st.data_editor(df_e, use_container_width=True, disabled=["id", "Nombre", "Especialidad"], hide_index=True)
        
        if st.button("Publicar Cambios"):
            conn = get_connection()
            if conn:
                cur = conn.cursor()
                for _, r in ed.iterrows(): cur.execute("UPDATE especialistas SET activo = %s WHERE id = %s", (r['Activo'], r['id']))
                conn.commit(); conn.close(); st.success("Cartilla actualizada."); st.rerun()

    # --- 6. CENTRO DE DESCARGAS ---
    elif menu == "Centro de Descargas":
        st.title("Exportación")
        st.markdown('<p class="view-description">Generación de reportes para análisis externo.</p>', unsafe_allow_html=True)
        tipo = st.selectbox("Módulo a exportar", ["Pacientes", "Atenciones", "Especialistas"])
        
        if tipo == "Pacientes":
            q = "SELECT * FROM registros_usuarios ORDER BY id DESC"
        elif tipo == "Atenciones":
            q = "SELECT * FROM logs_atenciones ORDER BY fecha_registro DESC"
        else:
            q = "SELECT * FROM especialistas ORDER BY nombre ASC"
            
        df_exp = cargar_datos(q)
        if not df_exp.empty:
            st.info(f"Vista previa: {tipo}")
            st.dataframe(df_exp.head(15), use_container_width=True, hide_index=True)
            st.divider()
            d1, d2 = st.columns(2)
            d1.download_button("Descargar Excel", data=to_excel(df_exp), file_name=f"Sanad_{tipo}_{datetime.now().strftime('%Y%m%d')}.xlsx", use_container_width=True)
            d2.download_button("Descargar CSV", data=df_exp.to_csv(index=False).encode('utf-8-sig'), file_name=f"Sanad_{tipo}_{datetime.now().strftime('%Y%m%d')}.csv", use_container_width=True)

    st.sidebar.divider(); st.sidebar.caption("© 2026 sanad.cl | Admin Instituciones")