# Sanad.cl | Sistema de Gestión de Teleconsultas 🧠

Módulo de gestión y analítica desarrollado para **sanad.cl**. Este sistema permite centralizar la cartilla de especialistas médicos, validar el acceso de pacientes mediante cuotas de atención y proporcionar una capa de analítica avanzada para el **Sanad SPA**.

## 🏗️ Arquitectura del Proyecto

El ecosistema está construido bajo un enfoque de microservicios integrados en una arquitectura de datos centralizada:

- **Frontend de Pacientes (`instituciones.py`):** Interfaz de cara al usuario para validación de RUT y búsqueda de psicólogos.
- **Panel Administrativo (`dashboard.py`):** BackOffice para gestión de datos, métricas de conversión y administración de especialistas.
- **Capa de Datos:** PostgreSQL alojado en infraestructura propia.
- **Despliegue:** Contenedores Docker gestionados a través de **Coolify**.

## 📋 Lógica de Negocio: Gestión de Cupos

Se ha implementado una lógica de control de acceso basada en la saturación del servicio, garantizando una experiencia de usuario fluida y transparente:

- **Validación Automática:** Sanitización de RUT (eliminación de puntos y guiones) antes de la consulta a DB.
- **Estados Dinámicos de Usuario:**
    - **Verde (0-2 atenciones):** Acceso libre.
    - **Amarillo (3 atenciones):** Advertencia de último cupo disponible.
    - **Rojo (4 atenciones):** Límite alcanzado. Se bloquea el buscador y se fuerza el cierre de sesión tras la última agenda.
- **Redirección Segura:** Al confirmar una agenda, se registra el log de atención y se redirige automáticamente a la plataforma **Sacmed**.

## 🛠️ Stack Tecnológico

- **Lenguaje:** Python 3.9+.
- **Framework UI:** Streamlit (Estética minimalista y profesional).
- **Base de Datos:** PostgreSQL con `psycopg2`.
- **Analítica:** Pandas y Plotly Express.
- **Reportabilidad:** XlsxWriter para generación de reportes Excel y CSV.

## 🖥️ Módulos del Dashboard Administrativo

El Panel de Control está diseñado para la toma de decisiones basada en datos:

1. **Análisis Global:** Métricas de conversión, pacientes totales y uso promedio.
2. **Visualización de Datos:** Gráficos de distribución por sede y motivos de consulta más frecuentes.
3. **Historial de Atenciones:** Tabla detallada con fechas, pacientes y especialistas consultados.
4. **Gestión de Usuarios:** Posibilidad de resetear o ajustar manualmente los contadores de reserva.
5. **Control de Especialistas:** Interruptor maestro para activar o desactivar médicos de la cartilla pública.
6. **Centro de Descargas:** Exportación masiva de datos en formato Excel y CSV.

## 🚀 Instalación y Despliegue Local

1. Clonar el repositorio.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Ejecutar aplicación: `streamlit run app.py`.

---
© 2026 sanad.cl | Software para la Salud Digital del Futuro.
