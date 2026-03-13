import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography,
  Box, Alert, Grid, Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/token/', {
        correo,
        password: contraseña,
      });

      const { access, refresh, rol, nombre_usuario } = response.data;
      const nombreRol = typeof rol === 'object' ? rol.rol : rol;

      localStorage.setItem('user', JSON.stringify({
        access,
        refresh,
        correo,
        rol: nombreRol,
        nombre_usuario,
      }));

      if (nombreRol === 'administrador') {
        navigate('/home');
      } else {
        navigate('/studio');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorData = error?.response?.data;
      let errMsg = 'Credenciales inválidas o sin permisos.';
      
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
      <Container maxWidth="xs" className="glass-card" sx={{ 
        py: 8, 
        px: 4,
        border: '1px solid rgba(14, 165, 233, 0.15)',
        position: 'relative',
        borderRadius: 6,
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
      }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            mb: 1,
            letterSpacing: '-1px',
            background: 'linear-gradient(90deg, #fff, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Acceso al Sistema
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.7 }}>
            Identifícate para ingresar a Nexus AI
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

        <form onSubmit={handleLogin}>
          <TextField
            label="Correo"
            fullWidth
            margin="normal"
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
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            variant="filled"
            InputProps={{ 
              disableUnderline: true,
              style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
            }}
            InputLabelProps={{ style: { color: 'var(--text-secondary)', fontWeight: 600 } }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ 
              mt: 4, 
              py: 1.8,
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: 3,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px rgba(0, 255, 178, 0.3)',
              }
            }}
          >
            Iniciar Sesión
          </Button>
        </form>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            ¿Eres nuevo? {' '}
            <Link 
              component={RouterLink} 
              to="/register" 
              sx={{ 
                color: 'var(--primary)', 
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
