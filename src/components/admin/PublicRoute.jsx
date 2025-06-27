import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

const PublicRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user && user.access ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
