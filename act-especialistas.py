import psycopg2
import streamlit as st # Usamos st.secrets para la conexión

# --- 1. MOTIVOS EXACTOS (Extraídos del CSV) ---
# He simplificado la lista aquí para el script, pero usa los textos exactos.
MOTIVOS = {
    "ANSIEDAD": "Preocupación constante / no puedo apagar la mente",
    "PANICO": "Crisis de pánico / crisis de angustia",
    "DEPRESION": "Tristeza persistente / llanto frecuente",
    "DUELO": "Duelo por fallecimiento o pérdidas",
    "PAREJA": "Conflictos de pareja / comunicación / celos / infidelidad",
    "AUTOESTIMA": "Autoestima baja / inseguridad personal",
    "STRESS": "Estrés laboral o escolar / burnout",
    # Agrega más si necesitas usarlos como referencia rápida
}

def conectar_db():
    try:
        # Usa los mismos parámetros que tienes en tu app de Streamlit
        params = st.secrets["postgres"]
        conn = psycopg2.connect(**params)
        return conn
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def actualizar_especialista(nombre_profesional, lista_motivos):
    """
    Actualiza los motivos de un especialista específico.
    lista_motivos: Debe ser una lista de strings con los textos exactos.
    """
    conn = conectar_db()
    if not conn: return

    try:
        with conn.cursor() as cur:
            # SQL para actualizar el array de motivos_consulta
            query = """
                UPDATE especialistas 
                SET motivos_consulta = %s 
                WHERE nombre ILIKE %s
            """
            cur.execute(query, (lista_motivos, f"%{nombre_profesional}%"))
            conn.commit()
            print(f"✅ Actualizado: {nombre_profesional} con {len(lista_motivos)} motivos.")
    except Exception as e:
        print(f"❌ Error actualizando a {nombre_profesional}: {e}")
    finally:
        conn.close()

# --- 2. CONFIGURACIÓN DEL MAPEO ---
# Aquí es donde tú defines qué motivos tiene cada profesional.
# COPIA Y PEGA los textos exactos del diccionario MOTIVOS o del CSV.

MAPEO_ESPECIALISTAS = [
    {
        "nombre": "Juan Pérez", # Nombre tal cual aparece en tu base de datos
        "motivos": [
            "Preocupación constante / no puedo apagar la mente",
            "Crisis de pánico / crisis de angustia",
            "Estrés laboral o escolar / burnout"
        ]
    },
    {
        "nombre": "María García",
        "motivos": [
            "Tristeza persistente / llanto frecuente",
            "Me cuesta disfrutar / siento vacío",
            "Autoestima baja / inseguridad personal"
        ]
    },
    # Agrega todos los que necesites...
]

if __name__ == "__main__":
    print("Actualización...")
    
    # OPCIONAL: Ejecutar primero el cambio de tipo de columna si no se ha hecho
    # (Descomenta las siguientes líneas si la columna no es TEXT[] aún)
    """
    conn = conectar_db()
    cur = conn.cursor()
    cur.execute("ALTER TABLE especialistas ALTER COLUMN motivos_consulta TYPE TEXT[] USING motivos_consulta::TEXT[];")
    conn.commit()
    conn.close()
    """

    for esp in MAPEO_ESPECIALISTAS:
        actualizar_especialista(esp["nombre"], esp["motivos"])
    
    print("✨ Proceso terminado.")