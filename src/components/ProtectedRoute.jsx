import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol si intentan acceder a una ruta no permitida
    return <Navigate to={user.rol === 'paciente' ? '/pacientes' : '/dashboard'} replace />;
  }

  return children;
};
