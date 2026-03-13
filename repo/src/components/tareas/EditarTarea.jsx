import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Alert, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AxiosInstance from '../Axios';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  titulo: yup.string().required('El título es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  fecha_vencimiento: yup.date().required('La fecha es requerida'),
  prioridad: yup.string().required('La prioridad es requerida'),
  tipo: yup.string().required('El tipo es requerido'),
  usuario: yup.number().required('El usuario es requerido'),
  completada: yup.boolean(),
});

const EditarTarea = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [tarea, setTarea] = useState(null);

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    AxiosInstance.get('usuarios/')
      .then((res) => setUsuarios(res.data))
      .catch(() => setError('Error al cargar los usuarios'));
  }, []);

  useEffect(() => {
    AxiosInstance.get(`tareas/${id}/`)
      .then((res) => {
        setTarea(res.data);
        const t = res.data;
        setValue('titulo', t.titulo);
        setValue('descripcion', t.descripcion);
        setValue('fecha_vencimiento', t.fecha_vencimiento);
        setValue('prioridad', t.prioridad);
        setValue('tipo', t.tipo);
        setValue('usuario', t.usuario);
        setValue('completada', t.completada);
      })
      .catch(() => setError('Error al cargar la tarea'));
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formattedFecha = new Date(data.fecha_vencimiento).toISOString().split('T')[0];

    const payload = {
      ...data,
      fecha_vencimiento: formattedFecha,
      usuario: parseInt(data.usuario),
    };

    try {
      await AxiosInstance.put(`tareas/${id}/`, payload);
      setSuccessMessage('Tarea actualizada correctamente.');
      setError('');
      setTimeout(() => navigate('/tareas'), 2000);
    } catch (err) {
      setError('Error al actualizar la tarea.');
      console.error(err.response?.data || err.message);
    }
  };

  if (!tarea) return <Typography>Cargando tarea...</Typography>;

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
        Editar Tarea
      </Typography>
    </Box>

    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Fecha */}
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
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
              InputProps={{ style: { backgroundColor: '#334155', color: '#f1f5f9' } }}
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

      {/* Checkbox completada */}
      <Box sx={{ mt: 3 }}>
        <Controller
          name="completada"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="¿Tarea completada?"
              sx={{ color: '#e2e8f0' }}
            />
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

export default EditarTarea;
