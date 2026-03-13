import React, { useState } from 'react';
import {
  Box, List, Typography, ListItem, ListItemButton, ListItemIcon, 
  IconButton, Avatar, Menu, MenuItem, Divider, Tooltip
} from '@mui/material';

import BoltIcon from '@mui/icons-material/Bolt';
import CollectionsIcon from '@mui/icons-material/Collections';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { motion } from 'framer-motion';
import profileImage from '../images/aeterna/daniel.png';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0ea5e9' }, // Ocean Blue
    secondary: { main: '#6366f1' }, // Indigo
    background: { default: '#030712', paper: 'rgba(17, 24, 39, 0.95)' },
  },
  shape: { borderRadius: 16 },
});

const NavBar = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const menuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    const handleStorage = () => {
      setUserData(JSON.parse(localStorage.getItem('user') || '{}'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  };

  const user = userData;
  const userRole = typeof user?.rol === 'object' ? user.rol.rol : user?.rol;

  const menuItems = [
    { text: 'NEXUS AI Studio', path: '/studio', icon: <BoltIcon /> },
    { text: 'Mi Galería', path: '/historiales', icon: <CollectionsIcon /> },
    ...(userRole === 'administrador' ? [
      { text: 'Mando Central', path: '/home', icon: <AdminPanelSettingsIcon /> },
      { text: 'Gestión Usuarios', path: '/usuarios', icon: <TravelExploreIcon /> }
    ] : []),
    { text: 'Sobre NEXUS', path: '/about', icon: <InfoIcon /> },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--background)' }}>
        
        {/* Floating Vertical Dock */}
        <Box className="frosted-glass" sx={{ 
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column', 
          alignItems: 'center',
          width: '75px',
          height: 'fit-content',
          maxHeight: '90vh',
          position: 'fixed',
          top: '5vh',
          left: '20px',
          zIndex: 1000,
          py: 3,
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
        }}>
          {/* NEXUS Logo */}
          <IconButton 
            component={RouterLink} 
            to="/studio" 
            sx={{ 
              mb: 4, 
              color: 'var(--primary)',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid var(--primary)',
              '&:hover': { background: 'rgba(14, 165, 233, 0.2)', boxShadow: 'var(--neon-glow)' }
            }}
          >
            <Avatar sx={{ bgcolor: 'transparent', color: 'var(--primary)', fontWeight: 950, fontSize: '1.5rem' }}>N</Avatar>
          </IconButton>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center', width: '100%', p: 0 }}>
            {menuItems.map((item) => (
              <Tooltip key={item.text} title={item.text} placement="right">
                <ListItem disablePadding sx={{ width: 'auto' }}>
                  <IconButton
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '14px',
                      color: path === item.path ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                      background: path === item.path ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--primary)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          <Divider sx={{ my: 4, width: '40%', bgcolor: 'rgba(255,255,255,0.1)' }} />

          {/* Profile Action */}
          <IconButton 
            onClick={handleMenuClick}
            sx={{ 
              p: 0.5, 
              border: '2px solid rgba(255,255,255,0.1)',
              mb: 2,
              '&:hover': { borderColor: 'var(--primary)' }
            }}
          >
            <Avatar src={profileImage} sx={{ width: 34, height: 34 }} />
          </IconButton>

          <Tooltip title="Cerrar Sesión" placement="right">
            <IconButton onClick={handleLogout} sx={{ color: 'var(--secondary)', opacity: 0.7, '&:hover': { opacity: 1, textShadow: 'var(--pink-glow)' } }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Premium Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          sx={{ 
            mt: 0.5,
            '& .MuiPaper-root': {
              background: 'transparent',
              boxShadow: 'none',
              overflow: 'visible'
            }
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10, filter: 'blur(10px)' }}
            animate={menuOpen ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <Box className="frosted-glass" sx={{ 
              minWidth: 240,
              p: 1.5,
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--border-neon)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), var(--neon-glow)'
            }}>
              {/* User Header Section */}
              <Box sx={{ p: 2, mb: 1, textAlign: 'center' }}>
                <Avatar 
                  src={profileImage} 
                  sx={{ 
                    width: 60, height: 60, mx: 'auto', mb: 1.5,
                    border: '2px solid var(--primary)',
                    boxShadow: 'var(--neon-glow)'
                  }} 
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
                  {user.nombre_usuario?.toUpperCase() || 'USUARIO'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 700, opacity: 0.8 }}>
                  {userRole?.toUpperCase() || 'COLABORADOR'}
                </Typography>
              </Box>

              <Divider sx={{ mb: 1.5, opacity: 0.1, bgcolor: 'var(--primary)' }} />

              <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <MenuItem 
                  onClick={() => { navigate('/perfil'); handleMenuClose(); }}
                  sx={{ 
                    borderRadius: '12px',
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(14, 165, 233, 0.1)',
                      color: 'var(--primary)',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                    <BoltIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Mi Perfil</Typography>
                </MenuItem>


                {userRole === 'administrador' && (
                  <MenuItem 
                    onClick={() => { navigate('/home'); handleMenuClose(); }}
                    sx={{ 
                      borderRadius: '12px',
                      py: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--primary)',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Mando Central</Typography>
                  </MenuItem>
                )}

                <Divider sx={{ my: 1, opacity: 0.05 }} />

                <MenuItem 
                  onClick={() => { handleLogout(); handleMenuClose(); }}
                  sx={{ 
                    borderRadius: '12px',
                    py: 1.5,
                    color: 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(244, 114, 182, 0.1)',
                      color: 'var(--accent)',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>Cerrar Sesión</Typography>
                </MenuItem>
              </List>
            </Box>
          </motion.div>
        </Menu>

        {/* Main Content Area */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          pl: { xs: 2, md: '120px' }, 
          pr: { xs: 2, md: 4 },
          py: 4,
          minHeight: '100vh',
          width: '100%',
          position: 'relative'
        }}>
          {children}
        </Box>

        {/* Mobile Navbar (Simplified) */}
        <Box className="frosted-glass" sx={{ 
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: 10,
          p: 1,
          gap: 1.5,
          zIndex: 2000,
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
          border: '1px solid var(--primary)'
        }}>
          {menuItems.map((item) => (
            <IconButton 
              key={item.text}
              component={RouterLink} 
              to={item.path}
              sx={{ color: path === item.path ? 'var(--primary)' : '#fff', p: 1.5 }}
            >
              {item.icon}
            </IconButton>
          ))}
          <IconButton onClick={handleMenuClick} sx={{ p: 0.5 }}>
            <Avatar src={profileImage} sx={{ width: 32, height: 32, border: '1px solid var(--primary)' }} />
          </IconButton>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default NavBar;