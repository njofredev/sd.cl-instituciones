# Sanad Dashboard - Frontend

Plataforma institucional para pacientes y administrativos de SANAD.  
Construido con **React**, **Vite**, y **Tailwind CSS**.

## Configuración y Variables de Entorno
Este proyecto requiere variables de entorno explícitas al momento de compilarse, tanto en desarrollo como en producción en la plataforma de Coolify.
Crea un archivo `.env` o agrégalo en la configuración de la UI de Coolify:

```env
# La URL donde se encuentre desplegado tu servicio backend
# Ej. https://api.sanad.cl (Sin / al final)
VITE_API_URL=http://localhost:8000

# La misma API_KEY que configuraste en tu `.env` del backend (SANAD_API_KEY)
VITE_API_KEY=SND-tu-api-key-secreta
```

## Despliegue en Coolify (Guía Rápida)
1. Importa este repositorio desde tu GitHub en tu panel principal de Coolify.
2. Como Framework, elige el autodetectado **Node.js** (Nixpacks) o **Static Site**.
3. Asegúrate de configurar explícitamente en el menú Build que el **Build Command** es `npm run build` y el **Publish Directory** es el directorio interno llamado `dist/`.
4. Define las **Variables de Entorno** (`VITE_API_URL` y `VITE_API_KEY`) **antes** del primer despliegue, ya que Vite las inyecta silenciosamente en el código durante la compilación.
5. Inicia el despliegue.

## Entorno Local de Desarrollo
1. Descarga el repositorio y abre la terminal en su directorio:
2. Instala las dependencias de los módulos de Node:
   ```bash
   npm install
   ```
3. Genera el entorno de variables local con `.env`.
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Para probar el build comprimido localmente como lo haría Coolify:
   ```bash
   npm run build
   npm run preview
   ```
