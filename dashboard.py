import streamlit as st
import psycopg2
import pandas as pd
import plotly.express as px
import os
from datetime import datetime
from io import BytesIO

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
        password = st.text_input("Contraseña de Administrador", type="password", help="Ingrese la clave de acceso para el personal de Sanad.")
        if st.form_submit_button("Entrar al Sistema"):
            if password == st.secrets["admin_password"]:
                st.session_state.password_correct = True
                st.rerun()
            else:
                st.error("Credenciales incorrectas. Por favor, intente de nuevo.")
    return False

if check_password():
    st.set_page_config(page_title="Sanad BackOffice", page_icon="🏢", layout="wide")

    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html, body, [class*="css"] { font-family: 'Inter', sans-serif; background-color: #FFFFFF; }
        
        div[data-testid="stMetric"], .stPlotlyChart, div.stDataFrame, .stSelectbox, .stNumberInput {
            background-color: #F8FAFC !important;
            border: 1px solid #E2E8F0 !important;
            border-radius: 16px !important;
            padding: 15px !important;
        }
        .view-description { color: #94A3B8; font-size: 1rem; margin-top: -15px; margin-bottom: 25px; }
        
        div.stButton > button {
            width: 100% !important; height: 50px;
            background-color: #0F172A !important; color: white !important;
            border-radius: 12px !important; border: none !important;
            font-weight: 600; margin-top: 10px;
        }
        [data-testid="stMetricValue"] { font-weight: 700 !important; color: #0F172A !important; }
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
        menu = st.radio("Navegación", ["Dashboard General", "Historial de Atenciones", "Gestión de Usuarios", "Control de Especialistas", "Centro de Descargas"])
        st.divider()
        st.caption(f"Chile/Santiago: {datetime.now().strftime('%H:%M')}")
        if st.button("Cerrar Sesión"):
            st.session_state.password_correct = False
            st.rerun()

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
        
        c1.metric("Pacientes Totales", total_u, help="Número total de pacientes registrados en la base de datos.")
        c2.metric("Atenciones", total_r, delta=f"{pacientes_activos} activos", help="Total de reservas confirmadas y pacientes con al menos una atención.")
        c3.metric("Conversión", f"{round((pacientes_activos/total_u*100),1) if total_u > 0 else 0}%", help="Porcentaje de usuarios registrados que han realizado al menos una atención.")
        c4.metric("Uso Promedio", f"{round(total_r/pacientes_activos, 1) if pacientes_activos > 0 else 0} res", help="Promedio de atenciones por cada paciente activo.")

        st.divider()
        g1, g2 = st.columns(2)
        with g1:
            df_s = cargar_datos("SELECT sede as \"Sede\", count(*) as \"Cantidad\" FROM registros_usuarios GROUP BY sede")
            if not df_s.empty: st.plotly_chart(px.pie(df_s, values='Cantidad', names='Sede', hole=0.5, title="Distribución por Sede"), use_container_width=True)
        with g2:
            df_m = cargar_datos("SELECT motivo_consulta as \"Motivo\", count(*) as \"Cantidad\" FROM logs_atenciones WHERE motivo_consulta IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 5")
            if not df_m.empty: st.plotly_chart(px.bar(df_m, x='Cantidad', y='Motivo', orientation='h', title="Top 5 Motivos de Consulta"), use_container_width=True)

    elif menu == "Historial de Atenciones":
        st.title("Historial")
        st.markdown('<p class="view-description">Registro cronológico de todas las interacciones médico-paciente.</p>', unsafe_allow_html=True)
        df_h = cargar_datos("""SELECT l.fecha_registro as "Fecha", u.nombre_completo as "Paciente", l.nombre_especialista as "Médico", l.motivo_consulta as "Motivo", l.sede_paciente as "Sede"
            FROM logs_atenciones l LEFT JOIN registros_usuarios u ON l.rut_paciente = u.rut ORDER BY l.fecha_registro DESC""")
        st.dataframe(df_h, use_container_width=True, hide_index=True)

    elif menu == "Gestión de Usuarios":
        st.title("Pacientes")
        st.markdown('<p class="view-description">Administración de base de datos y ajuste manual de cupos.</p>', unsafe_allow_html=True)
        df_p = cargar_datos("SELECT rut as \"RUT\", nombre_completo as \"Nombre\", sede as \"Sede\", reservas_realizadas as \"Atenciones\" FROM registros_usuarios")
        st.dataframe(df_p, use_container_width=True, hide_index=True)
        
        st.markdown("### Modificar Registro")
        with st.container():
            c1, c2 = st.columns(2)
            with c1: rut_sel = st.selectbox("Seleccione Paciente", df_p['RUT'], help="Seleccione el RUT del paciente que desea actualizar.")
            with c2: v_nuevo = st.number_input("Número de Atenciones", 0, 10, 0, help="Defina el nuevo contador de atenciones realizadas.")
            if st.button("Guardar Cambios"):
                conn = get_connection()
                if conn:
                    cur = conn.cursor()
                    cur.execute("UPDATE registros_usuarios SET reservas_realizadas = %s WHERE rut = %s", (v_nuevo, rut_sel))
                    conn.commit(); conn.close(); st.success("Registro actualizado exitosamente."); st.rerun()

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
                conn.commit(); conn.close(); st.success("Cartilla actualizada correctamente."); st.rerun()

    elif menu == "Centro de Descargas":
        st.title("Exportación")
        st.markdown('<p class="view-description">Generación de reportes para análisis externo.</p>', unsafe_allow_html=True)
        tipo = st.selectbox("Módulo a exportar", ["Atenciones", "Pacientes", "Especialistas"], help="Seleccione el conjunto de datos que desea descargar.")
        q = "SELECT * FROM registros_usuarios" if tipo == "Pacientes" else "SELECT * FROM logs_atenciones"
        df_exp = cargar_datos(q)
        if not df_exp.empty:
            st.info("Vista previa de los datos a exportar")
            st.dataframe(df_exp.head(10), use_container_width=True, hide_index=True)
            st.divider()
            d1, d2 = st.columns(2)
            d1.download_button("Descargar Excel", data=to_excel(df_exp), file_name=f"Sanad_{tipo}.xlsx", use_container_width=True)
            d2.download_button("Descargar CSV", data=df_exp.to_csv(index=False).encode('utf-8-sig'), file_name=f"Sanad_{tipo}.csv", use_container_width=True)

    st.sidebar.divider(); st.sidebar.caption("© 2026 sanad.cl | BackOffice")