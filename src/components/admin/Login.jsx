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

      if (nombreRol !== 'administrador') {
        setMessage('Acceso denegado: solo los administradores pueden ingresar.');
        setSeverity('error');
        return;
      }

      // ✅ Guardar correctamente como 'user'
      localStorage.setItem('user', JSON.stringify({
        access,
        refresh,
        correo,
        rol: nombreRol,
        nombre_usuario,
      }));

      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      const err =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        'Credenciales inválidas o sin permisos.';
      setMessage(err);
      setSeverity('error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>

        {message && (
          <Alert severity={severity} sx={{ mt: 2 }}>
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
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar sesión
          </Button>
        </form>

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/register" variant="body2">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
