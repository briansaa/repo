import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const AgregarTarea = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  // Validación con Yup
  const schema = yup.object({
    titulo: yup.string().required('El título es requerido'),
    descripcion: yup.string().required('La descripción es requerida'),
    fecha_vencimiento: yup.date().required('La fecha es requerida'),
    prioridad: yup.string().required('La prioridad es requerida'),
    tipo: yup.string().required('El tipo es requerido'),
    usuario: yup.number().required('El usuario es requerido'),
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      fecha_vencimiento: '',
      prioridad: '',
      tipo: '',
      usuario: '',
    },
  });

  useEffect(() => {
    AxiosInstance.get('usuarios/')
      .then((res) => setUsuarios(res.data))
      .catch(() => setError('Error al cargar los usuarios.'));
  }, []);

  const onSubmit = async (data) => {
    const formattedFecha = new Date(data.fecha_vencimiento).toISOString().split('T')[0]; // YYYY-MM-DD

    const payload = {
      ...data,
      fecha_vencimiento: formattedFecha,
      usuario: parseInt(data.usuario),
      completada: false,
    };

    console.log("📦 Enviando payload al backend:", payload);

    try {
      const response = await AxiosInstance.post('tareas/', payload);
      console.log("✅ Respuesta del backend:", response.data);

      setSuccessMessage(`Tarea "${data.titulo}" creada exitosamente.`);
      setError('');
      setTimeout(() => navigate('/tareas'), 2000);
    } catch (error) {
      console.error("❌ Error al crear tarea:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Error al crear la tarea. Revisa los campos.");
    }
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
    {/* Header */}
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
        Agregar Nueva Tarea
      </Typography>
    </Box>

    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '30px',
        }}
      >
        {/* Título */}
        <Controller
          name="titulo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Título"
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          name="descripcion"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Descripción"
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Fecha de Vencimiento */}
        <Controller
          name="fecha_vencimiento"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Fecha de Vencimiento"
              type="date"
              fullWidth
              variant="filled"
              InputLabelProps={{ shrink: true, style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Prioridad */}
        <Controller
          name="prioridad"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Prioridad"
              select
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="ALTA">Alta</MenuItem>
              <MenuItem value="MEDIA">Media</MenuItem>
              <MenuItem value="BAJA">Baja</MenuItem>
            </TextField>
          )}
        />

        {/* Tipo */}
        <Controller
          name="tipo"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tipo"
              select
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="ACADEMICA">Académica</MenuItem>
              <MenuItem value="PERSONAL">Personal</MenuItem>
            </TextField>
          )}
        />

        {/* Usuario */}
        <Controller
          name="usuario"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Usuario"
              select
              fullWidth
              variant="filled"
              InputLabelProps={{ style: { color: '#cbd5e1' } }}
              InputProps={{ style: { color: '#f1f5f9', backgroundColor: '#334155' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {usuarios.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombre_usuario} ({u.correo})
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant="outlined" color="error" onClick={() => navigate('/tareas')}>
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
  </Box>
</Box>

  );
};

export default AgregarTarea;
