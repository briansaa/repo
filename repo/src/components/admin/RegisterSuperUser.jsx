import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Box, Typography, Container, Alert, MenuItem, Grid, Link, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [listaRoles, setListaRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/roles/')
      .then((res) => {
        setListaRoles(res.data);
        setFilteredRoles(res.data);
        if (res.data.length > 0) {
          setRol(res.data[0].id_rol);
        }
      })
      .catch((error) => {
        console.error('Error al obtener roles:', error);
        const errorData = error?.response?.data;
        let errMsg = 'Network protocol error. Roles offline.';
        
        if (errorData) {
          if (typeof errorData === 'string') {
            errMsg = errorData;
          } else if (errorData.detail) {
            errMsg = errorData.detail;
          } else {
            errMsg = Object.keys(errorData)
              .map(key => `${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`)
              .join(' | ');
          }
        }
        setMessage(errMsg);
        setSeverity('error');
      });
  }, []);

  useEffect(() => {
    if (listaRoles.length === 0) return;

    const isAdminEmail = correo.toLowerCase().includes('admin') || correo.toLowerCase().endsWith('@nexus.ai');
    
    let newFiltered = [];
    if (isAdminEmail) {
      // Show only admin roles
      newFiltered = listaRoles.filter(r => r.rol.toLowerCase().includes('admin'));
    } else {
      // Show only user roles
      newFiltered = listaRoles.filter(r => !r.rol.toLowerCase().includes('admin'));
    }

    setFilteredRoles(newFiltered);

    // Auto-select the first available role in the filtered list
    if (newFiltered.length > 0) {
      const isCurrentStillValid = newFiltered.some(r => r.id_rol === rol);
      if (!isCurrentStillValid) {
        setRol(newFiltered[0].id_rol);
      }
    } else {
      setRol('');
    }
  }, [correo, listaRoles]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contraseña !== confirmContraseña) {
      setMessage('Validation error: Passwords do not match');
      setSeverity('error');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/usuarios/', {
        correo,
        nombre_usuario,
        password: contraseña,
        rol_id: rol 
      });

      setMessage('Identity created. Synchronizing...');
      setSeverity('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorData = error?.response?.data;
      let errMsg = 'Registration sequence failure';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errMsg = errorData;
        } else if (errorData.detail) {
          errMsg = errorData.detail;
        } else {
          errMsg = Object.keys(errorData)
            .map(key => `${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`)
            .join(' | ');
        }
      }
      
      setMessage(errMsg);
      setSeverity('error');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 2,
      background: 'radial-gradient(circle at 50% 50%, #030712 0%, #000 100%)'
    }}>
      <Container maxWidth="sm" className="glass-card" sx={{ 
        py: 8, 
        px: { xs: 4, md: 8 },
        border: '1px solid rgba(14, 165, 233, 0.15)',
        position: 'relative',
        borderRadius: 8,
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ 
            display: 'inline-flex', 
            p: 2, 
            borderRadius: '50%', 
            background: 'rgba(14, 165, 233, 0.05)', 
            mb: 3,
            border: '1px solid rgba(14, 165, 233, 0.2)'
          }}>
            <PersonAdd sx={{ color: 'var(--primary)', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            mb: 1,
            letterSpacing: '-1px',
            background: 'linear-gradient(90deg, #ffffff 30%, var(--primary) 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Nuevo Registro
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.8 }}>
            Únete al ecosistema de Nexus AI
          </Typography>
        </Box>

        {message && (
          <Alert 
            severity={severity} 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              backgroundColor: severity === 'error' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(14, 165, 233, 0.1)',
              color: severity === 'error' ? '#ff5252' : 'var(--primary)',
              border: `1px solid ${severity === 'error' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
              fontWeight: 600
            }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nombre"
                fullWidth
                value={nombre_usuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                variant="filled"
                InputProps={{ 
                  disableUnderline: true,
                  style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                }}
                InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Correo"
                fullWidth
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                variant="filled"
                InputProps={{ 
                  disableUnderline: true,
                  style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                }}
                InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                variant="filled"
                InputProps={{ 
                  disableUnderline: true,
                  style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'var(--primary)' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Repetir Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={confirmContraseña}
                onChange={(e) => setConfirmContraseña(e.target.value)}
                required
                variant="filled"
                InputProps={{ 
                  disableUnderline: true,
                  style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                }}
                InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Nivel de Acceso / Rol"
                fullWidth
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
                variant="filled"
                InputProps={{ 
                  disableUnderline: true,
                  style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                }}
                InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
              >
                {filteredRoles.map((r) => (
                  <MenuItem key={r.id_rol} value={r.id_rol} sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {r.rol.charAt(0).toUpperCase() + r.rol.slice(1)} - {r.permiso.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 5, 
              mb: 3, 
              py: 1.8,
              fontWeight: 800,
              fontSize: '1rem',
              borderRadius: 3,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'var(--neon-glow)',
              }
            }}
          >
            Crear Cuenta
          </Button>
          <Grid container justifyContent="center">
            <Grid size="auto">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                ¿Ya tienes una cuenta? {' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  sx={{ 
                    color: 'var(--primary)', 
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Ingresa aquí
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
