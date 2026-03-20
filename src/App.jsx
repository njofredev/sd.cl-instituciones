import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas (Las crearemos en los siguientes pasos)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PacienteHome from './pages/PacienteHome';

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={
        user ? (
          <Navigate to={user.rol === 'paciente' ? '/pacientes' : '/dashboard'} replace />
        ) : (
          <Login />
        )
      } />
      
      <Route path="/dashboard/*" element={
        <ProtectedRoute allowedRoles={['admin_sistema', 'admin_casa_matriz', 'admin_sede', 'clinico']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/pacientes/*" element={
        <ProtectedRoute allowedRoles={['paciente']}>
          <PacienteHome />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
