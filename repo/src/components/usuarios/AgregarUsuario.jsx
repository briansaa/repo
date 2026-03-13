import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, IconButton, InputAdornment, MenuItem, Grid
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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      background: 'radial-gradient(circle at 50% 50%, #030712 0%, #000 100%)'
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '800px',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2, left: -2, right: -2, bottom: -2,
          background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
          borderRadius: '26px',
          zIndex: -1,
          opacity: 0.3,
          blur: '10px'
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
            <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 900, letterSpacing: 3, display: 'block', mb: 1 }}>
              SISTEMA_DE_GESTIÓN // NEXUS_AI
            </Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 950, 
              background: 'linear-gradient(90deg, #fff, var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -1
            }}>
              AGREGAR_NUEVO_OPERADOR
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>{successMessage}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="nombre_usuario"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="NOMBRE_IDENTIFICADOR"
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
                      label="NODO_DE_ACCESO (CORREO)"
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
                      label="CLAVE_DE_ENCRIPTACIÓN"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      variant="filled"
                      InputProps={{ 
                        disableUnderline: true,
                        style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'var(--primary)' }}>
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
                  name="rol"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="NIVEL_DE_AUTORIZACIÓN"
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
                            : `ID_${rol.id_rol}`
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
                ABORTAR
              </Button>
              <Button 
                variant="contained" 
                type="submit" 
                sx={{ 
                  borderRadius: 3, 
                  px: 6, 
                  py: 1.5, 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  fontWeight: 900,
                  color: '#000',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.4)' }
                }}
              >
                CREAR_OPERADOR
              </Button>
            </Box>
          </form>

          <Dialog 
            open={openDialog} 
            onClose={() => handleDialogClose(false)}
            PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } }}
          >
            <DialogTitle sx={{ fontWeight: 900 }}>[ALERTA_DE_SISTEMA]</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                ¿Confirmas la interrupción del protocolo de registro? Los datos no sincronizados se perderán.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => handleDialogClose(false)} sx={{ color: '#fff', fontWeight: 900 }}>REANUDAR</Button>
              <Button onClick={() => handleDialogClose(true)} sx={{ color: '#ef4444', fontWeight: 900 }}>CONFIRMAR_ABORTAR</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default AgregarUsuario;
