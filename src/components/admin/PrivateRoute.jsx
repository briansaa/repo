// src/components/admin/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const PrivateRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      const user = authService.getCurrentUser();

      if (!user?.access) {
        setAuthorized(false); // ⛔ No hay token, no seguimos
        return;
      }

      try {
        await authService.fetchUserData(); // ✅ solo si hay token
        setAuthorized(true);
      } catch (error) {
        console.error('Acceso denegado:', error);
        authService.logout(); // Limpia localStorage si falla
        setAuthorized(false);
      }
    };

    checkAccess();
  }, []);

  // Cargando estado de verificación
  if (authorized === null) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Verificando acceso...</div>;
  }

  return authorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
