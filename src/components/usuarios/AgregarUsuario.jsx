import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, IconButton, InputAdornment, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AgregarUsuario = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    rol: '',
  };

  const schema = yup.object({
    nombre_usuario: yup.string().required('Nombre es requerido'),
    correo: yup.string().email('Correo inválido').required('Correo es requerido'),
    contraseña: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
    rol: yup.string().required('Rol es requerido'),
  });

  const { handleSubmit, control } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    AxiosInstance.get('roles/')
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        setError('No se pudieron cargar los roles.');
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const userData = {
        nombre_usuario: data.nombre_usuario.trim(),
        correo: data.correo.trim(),
        password: data.contraseña,
        rol_id: data.rol,
      };

      const response = await AxiosInstance.post('usuarios/', userData);
      const message = `El usuario ${data.nombre_usuario} fue creado exitosamente.`;
      setSuccessMessage(message);
      setError('');
      setTimeout(() => navigate('/usuarios', { state: { message } }), 2000);
    } catch (error) {
      let backendError = error.response?.data;
      let errorMessage = 'Ocurrió un error inesperado al crear el usuario.';

      if (typeof backendError === 'string') errorMessage = backendError;
      else if (backendError?.detail) errorMessage = backendError.detail;
      else if (backendError?.message) errorMessage = backendError.message;
      else if (typeof backendError === 'object') {
        const fieldErrors = [];
        for (const field in backendError) {
          fieldErrors.push(`${field}: ${backendError[field]}`);
        }
        errorMessage = fieldErrors.join('; ');
      }

      setError(`Error: ${errorMessage}`);
      setSuccessMessage('');
    }
  };

  const handleCancel = () => setOpenDialog(true);
  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (confirm) navigate('/usuarios');
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #0a0f2c, #101c3c)',
      padding: '20px',
      color: 'white',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '900px',
        backgroundColor: '#1c2232',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
      }}>
        <Box sx={{
          background: 'linear-gradient(to right, #5c6bc0, #7986cb)',
          color: 'white',
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '8px',
        }}>
          <Typography variant="h5">Agregar Usuario</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
          }}>
            <Controller
              name="nombre_usuario"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{ backgroundColor: '#2a2f45' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="correo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Correo"
                  fullWidth
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{ backgroundColor: '#2a2f45' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="contraseña"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{
                    style: { color: 'white' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'white' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ backgroundColor: '#2a2f45' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="rol"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Rol"
                  select
                  fullWidth
                  variant="filled"
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{ backgroundColor: '#2a2f45' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {roles.map((rol, index) => (
                    <MenuItem key={index} value={rol}>
                      {typeof rol === 'string'
                        ? rol.charAt(0).toUpperCase() + rol.slice(1)
                        : rol.nombre || rol.name || rol
                      }
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" sx={{
              backgroundColor: '#5c6bc0',
              '&:hover': { backgroundColor: '#3f4f84' }
            }}>
              Guardar
            </Button>
          </Box>
        </form>

        <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
          <DialogTitle>Cancelar creación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de cancelar la creación del usuario?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)}>No</Button>
            <Button onClick={() => handleDialogClose(true)} autoFocus>Sí</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AgregarUsuario;
