import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, TextField, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment, MenuItem, Grid
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
  const [usuario, setUsuario] = useState(null);

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
        setValue('rol_id', user.rol?.id_rol || '');
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
      // El backend requiere el campo password. Si está vacío, enviamos uno por defecto o el actual
      // Para evitar errores de validación 400, nos aseguramos que no sea un string vacío si la API lo exige
      password: data.contraseña || '********', 
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
<Box sx={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 3,
  background: 'radial-gradient(circle at 50% 50%, #030712 0%, #000 100%)'
}}>
  <Box sx={{
    width: '100%',
    maxWidth: '900px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -2, left: -2, right: -2, bottom: -2,
      background: 'linear-gradient(45deg, var(--secondary), var(--primary))',
      borderRadius: '26px',
      zIndex: -1,
      opacity: 0.2,
      blur: '15px'
    }
  }}>
    <Box className="glass-card" sx={{
      p: { xs: 3, md: 5 },
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
    }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'var(--secondary)', fontWeight: 900, letterSpacing: 3, display: 'block', mb: 1 }}>
          TERMINAL_DE_EDICIÓN // SEC_OVRD
        </Typography>
        <Typography variant="h4" sx={{ 
          fontWeight: 950, 
          background: 'linear-gradient(90deg, #fff, var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1
        }}>
          MODIFICAR_IDENTIDAD_OPERADOR
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>{successMessage}</Alert>}

      <form onSubmit={handleSubmit(submission)}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="nombre_usuario"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="IDENTIFICADOR"
                  fullWidth
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true,
                    style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                  }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem' } }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="correo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="CORREO_DE_REGISTRO"
                  fullWidth
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true,
                    style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                  }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem' } }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="contraseña"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="NUEVA_CLAVE (OPCIONAL)"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true,
                    style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'var(--secondary)' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem' } }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="rol_id"
              control={control}
              rules={{ required: 'Selecciona un rol' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="PERMISOS_SISTEMA"
                  select
                  fullWidth
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true,
                    style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }
                  }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem' } }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol} sx={{ fontWeight: 700 }}>
                      {typeof rol.rol === 'string' 
                        ? rol.rol.toUpperCase()
                        : `SEC_ID_${rol.id_rol}`
                      }
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              py: 1.5, 
              color: 'rgba(255,255,255,0.4)', 
              borderColor: 'rgba(255,255,255,0.1)',
              fontWeight: 900,
              '&:hover': { borderColor: '#ef4444', color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)' }
            }}
          >
            CANCELAR
          </Button>
          <Button 
            variant="contained" 
            type="submit" 
            sx={{ 
              borderRadius: 3, 
              px: 6, 
              py: 1.5, 
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              fontWeight: 900,
              color: '#fff',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }
            }}
          >
            ACTUALIZAR_DATOS
          </Button>
        </Box>
      </form>

      <Dialog 
        open={openDialog} 
        onClose={() => handleDialogClose(false)}
        PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>[MODIFICACIÓN_PENDIENTE]</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            ¿Estás seguro de descartar los cambios en este perfil? La integridad de los datos revertirá a su estado anterior.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => handleDialogClose(false)} sx={{ color: '#fff', fontWeight: 900 }}>REANUDAR</Button>
          <Button onClick={() => handleDialogClose(true)} sx={{ color: '#ef4444', fontWeight: 900 }}>DESCARTAR_CAMBIOS</Button>
        </DialogActions>
      </Dialog>
    </Box>
  </Box>
</Box>

  );
};

export default EditarUsuario;
