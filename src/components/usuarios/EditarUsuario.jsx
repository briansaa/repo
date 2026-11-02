import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, TextField, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import useBlockNavigation from '../../hooks/useBlockNavigation';

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [, setUsuario] = useState(null);

  const defaultValues = {
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    rol_id: '',
  };

  const { handleSubmit, control, setValue } = useForm({ defaultValues });

  useBlockNavigation(true, '¿Estás seguro de cancelar la edición del usuario?');

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID de usuario válido.");
      return;
    }

    const fetchUsuario = async () => {
      try {
        const res = await AxiosInstance.get(`usuarios/${id}/`);
        const user = res.data;

        setUsuario(user);
        setValue('nombre_usuario', user.nombre_usuario);
        setValue('correo', user.correo);
        setValue('contraseña', '');
        setValue('rol_id', user.rol);  // El campo correcto es "rol"
      } catch (error) {
        console.error('Error al cargar usuario:', error.response || error);
        setError('Error al cargar los datos del usuario.');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await AxiosInstance.get('roles/');
        setRoles(res.data); // Debe ser un array simple de strings
      } catch (error) {
        console.error('Error al cargar roles:', error.response || error);
        setError('Error al cargar los roles.');
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [id, setValue]);

  const submission = async (data) => {
    const updatedData = {
      nombre_usuario: data.nombre_usuario,
      correo: data.correo,
      ...(data.contraseña ? { password: data.contraseña } : {}),
      rol: data.rol_id,  
    };

    console.log("Datos desde formulario:", data);
    console.log('Datos a enviar:', updatedData);

    try {
      await AxiosInstance.put(`usuarios/${id}/`, updatedData);

      setSuccessMessage(`El usuario ${data.nombre_usuario} se actualizó correctamente.`);
      setError('');
      setTimeout(() => navigate('/usuarios'), 2000);
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);

      if (err.response) {
        setError(`Error: ${err.response.data.detail || 'Verifique los datos.'}`);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  const handleCancel = () => setOpenDialog(true);
  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (confirm) navigate('/usuarios');
  };

  return (
<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '20px',
  }}
>
  <Box
    sx={{
      width: '100%',
      maxWidth: '1000px',
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 6px 30px rgba(0,0,0,0.6)',
    }}
  >
    {/* Encabezado */}
    <Box
      sx={{
        backgroundImage: 'linear-gradient(to right, #6366f1, #818cf8)',
        color: '#fff',
        padding: '14px 20px',
        marginBottom: '24px',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Editar Usuario
      </Typography>
    </Box>

    {/* Alertas */}
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

    {/* Formulario */}
    <form onSubmit={handleSubmit(submission)}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          pb: 3,
        }}
      >
        {/* Nombre */}
        <Controller
          name="nombre_usuario"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nombre"
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Correo */}
        <Controller
          name="correo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Correo"
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Contraseña */}
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
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{
                style: { color: '#f1f5f9', backgroundColor: '#334155' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Rol */}
        <Controller
          name="rol_id"
          control={control}
          rules={{ required: 'Selecciona un rol' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Rol"
              select
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {roles.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  {rol.charAt(0).toUpperCase() + rol.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: '#6366f1',
            color: '#fff',
            '&:hover': { backgroundColor: '#4f46e5' },
          }}
        >
          Guardar
        </Button>
      </Box>
    </form>

    {/* Diálogo de confirmación */}
    <Dialog
      open={openDialog}
      onClose={() => handleDialogClose(false)}
      PaperProps={{
        sx: {
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>Cancelar Edición</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#cbd5e1' }}>
          ¿Estás seguro de cancelar la edición del usuario?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDialogClose(false)}>No</Button>
        <Button onClick={() => handleDialogClose(true)} autoFocus color="error">
          Sí
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
</Box>

  );
};

export default EditarUsuario;
