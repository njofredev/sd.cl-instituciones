import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem('sanad_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('sanad_session', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('sanad_session');
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      sessionStorage.setItem('sanad_session', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
