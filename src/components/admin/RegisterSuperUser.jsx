import React, { useEffect, useState } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Box,
  Typography, Container, Alert, MenuItem, Grid, Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';  // Importar Link de react-router-dom

const Register = () => {
  const [correo, setCorreo] = useState('');
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [listaRoles, setListaRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/roles/')
      .then((res) => {
        setListaRoles(res.data);
        if (res.data.length > 0) {
          setRol(res.data[0].id_rol);
        }
      })
      .catch((err) => {
        console.error('Error al obtener roles:', err);
        setMessage('No se pudieron cargar los roles');
        setSeverity('error');
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contraseña !== confirmContraseña) {
      setMessage('Las contraseñas no coinciden');
      setSeverity('error');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/usuarios/', {
        correo,
        nombre_usuario,
        password: contraseña,  // Asegúrate de enviar "password" en lugar de "contraseña"
        rol_id: rol 
      });

      setMessage('Usuario registrado con éxito');
      setSeverity('success');
      setCorreo('');
      setNombreUsuario('');
      setContraseña('');
      setConfirmContraseña('');
      setRol(listaRoles[0]?.id_rol || '');
    } catch (error) {
      const errMsg = error?.response?.data?.detail || 'Error al registrar el usuario';
      setMessage(errMsg);
      setSeverity('error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Registro</Typography>
        {message && <Alert severity={severity} sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Correo"
            fullWidth
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
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
          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirmContraseña}
            onChange={(e) => setConfirmContraseña(e.target.value)}
            required
          />
          <TextField
            select
            label="Rol"
            fullWidth
            margin="normal"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            {listaRoles.map((r) => (
              <MenuItem key={r.id_rol} value={r.id_rol}>
                {r.rol} ({r.permiso})
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Registrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
