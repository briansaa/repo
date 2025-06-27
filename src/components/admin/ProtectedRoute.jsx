import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  // Si ya está logueado, redirige al home
  if (user && user.access) {
    return <Navigate to="/home" />;
  }

  // Si no, permite el acceso al componente (login, register, etc.)
  return children;
};

export default ProtectedRoute;
