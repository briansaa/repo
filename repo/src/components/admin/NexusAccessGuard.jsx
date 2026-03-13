import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * NexusAccessGuard - Consistent route protection for NEXUS AI.
 * 
 * @param {string} mode - Guard type: 'authenticated' (requires login), 'guest' (requires no login), 'admin' (requires admin role).
 */
const NexusAccessGuard = ({ children, mode = 'authenticated' }) => {
  const [authorized, setAuthorized] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const verify = async () => {
      // MODE: GUEST (Login/Register)
      if (mode === 'guest') {
        if (user && user.access) {
          setAuthorized(false); // Should redirect to Home
        } else {
          setAuthorized(true);
        }
        return;
      }

      // MODE: AUTHENTICATED / ADMIN
      if (!user?.access) {
        setAuthorized(false);
        return;
      }

      try {
        const userData = await authService.fetchUserData();
        
        if (mode === 'admin') {
          // Robust check for administrator role
          const roleName = typeof userData.rol === 'object' ? userData.rol.rol : userData.rol;
          const isAdmin = roleName === 'administrador';
          setAuthorized(isAdmin);
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error('Access verification failed:', error);
        authService.logout();
        setAuthorized(false);
      }
    };

    verify();
  }, [mode, user]);

  if (authorized === null) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--primary)', fontWeight: 900 }}>
        VERIFICANDO_CREDENCIALES_AC_OXI...
      </div>
    );
  }

  if (!authorized) {
    if (mode === 'guest') return <Navigate to="/studio" />;
    return <Navigate to="/login" />;
  }

  return children;
};

export default NexusAccessGuard;
