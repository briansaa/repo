import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, CssBaseline, Toolbar, List, Typography,
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Divider
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ImageIcon from '@mui/icons-material/Image';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import FaceIcon from '@mui/icons-material/Face';
import BrushIcon from '@mui/icons-material/Brush';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import profileImage from '../images/daniel.jpg';

// Tema personalizado con colores oscuros
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e3a5f', // Azul oscuro principal
    },
    background: {
      default: '#0f1419', // Fondo muy oscuro
      paper: '#1a2332', // Fondo del drawer
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

const NavBar = ({ drawerWidth = 280, children }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const changeOpenStatus = () => setOpen(!open);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuItemClick = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { text: 'Inicio', path: '/home', icon: <HomeIcon /> },
    { text: 'Usuarios', path: '/usuarios', icon: <FaceIcon /> },
    { text: 'Tareas', path: '/tareas', icon: <TuneIcon /> },
    { text: 'Historial IA', path: '/historiales', icon: <HistoryEduIcon /> },
    { text: 'Sobre SYNCHRON IA', path: '/about', icon: <InfoIcon /> },
  ];

  const myDrawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="h6" sx={{ 
          color: '#ffffff', 
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          SELTA ADMIN
        </Typography>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={RouterLink} 
                to={item.path}
                selected={path === item.path}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    borderLeft: '3px solid #3b82f6',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: path === item.path ? '#3b82f6' : '#b0bec5',
                  minWidth: 40,
                  transition: 'color 0.3s ease'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      fontWeight: path === item.path ? 600 : 400,
                      color: path === item.path ? '#ffffff' : '#b0bec5',
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #1e3a5f 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar>
            <IconButton 
              color="inherit" 
              onClick={changeOpenStatus} 
              sx={{ 
                mr: 2, 
                display: { sm: "none" },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{
              fontWeight: 700,
              letterSpacing: '1px',
              background: 'linear-gradient(45deg, #ffffff 30%, #3b82f6 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            SYNCHRON IA            
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton 
              onClick={handleMenuClick} 
              sx={{ 
                p: 0,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Avatar 
                alt="Profile" 
                src={profileImage}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                }}
              />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#1a2332',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  borderRadius: 2,
                  mt: 1
                }
              }}
            >
              <MenuItem 
                onClick={() => handleMenuItemClick('/perfil')}
                sx={{ 
                  color: '#ffffff',
                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                }}
              >
                Perfil
              </MenuItem>
              <MenuItem 
                onClick={() => handleMenuItemClick('/cuenta')}
                sx={{ 
                  color: '#ffffff',
                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                }}
              >
                Cuenta
              </MenuItem>
              <MenuItem 
                onClick={() => handleMenuItemClick('/home')}
                sx={{ 
                  color: '#ffffff',
                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                }}
              >
                Panel
              </MenuItem>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: '#ef4444',
                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                }}
              >
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Drawer permanente */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              border: 'none'
            },
          }}
        >
          {myDrawer}
        </Drawer>

        {/* Drawer temporal para pantallas pequeñas */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={changeOpenStatus}
          sx={{
            display: { xs: "block", sm: "none" },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              border: 'none'
            },
          }}
        >
          {myDrawer}
        </Drawer>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            backgroundColor: '#0f1419',
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NavBar;