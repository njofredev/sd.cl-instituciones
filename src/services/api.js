const API_URL = import.meta.env.VITE_API_URL;

/**
 * Utility to fetch with automatic retries for network errors
 */
const fetchWithRetry = async (url, options, retries = 2, backoff = 500) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (retries > 0 && (error.name === 'TypeError' || error.message === 'Failed to fetch')) {
      console.warn(`Fetch failed, retrying in ${backoff}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const getAuthHeaders = () => {
  const session = JSON.parse(sessionStorage.getItem('sanad_session') || '{}');
  const token = session.access_token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const loginInstitucion = async (email, password, rut_institucion) => {
  const response = await fetchWithRetry(`${API_URL}/api/auth/login-institucion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rut_institucion })
  });

  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = 'Credenciales incorrectas';
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map(d => d.msg || d.type).join(', ');
      } else if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      }
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const loginPaciente = async (rut) => {
  const response = await fetchWithRetry(`${API_URL}/api/auth/login-paciente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rut })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'RUT no encontrado');
  }
  return response.json();
};

export const getDashboardKpis = async (sede) => {
  const url = sede && sede !== 'todas' ? `${API_URL}/api/v1/dashboard/kpis?sede=${sede}` : `${API_URL}/api/v1/dashboard/kpis`;
  const response = await fetchWithRetry(url, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar KPIs');
  return response.json();
};

export const getDashboardPacientes = async (sede) => {
  const url = sede && sede !== 'todas' ? `${API_URL}/api/v1/dashboard/pacientes?sede=${sede}` : `${API_URL}/api/v1/dashboard/pacientes`;
  const response = await fetchWithRetry(url, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar pacientes');
  return response.json();
};

export const getProfessionals = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key]) searchParams.append(key, params[key]);
  });
  const url = `${API_URL}/api/v1/profesionales?${searchParams.toString()}`;
  const response = await fetchWithRetry(url, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar profesionales');
  return response.json();
};

export const getPacienteHistorial = async (rut) => {
  const url = `${API_URL}/api/v1/pacientes/${rut}/historial`;
  const response = await fetchWithRetry(url, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar historial');
  return response.json();
};

