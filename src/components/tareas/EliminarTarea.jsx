import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import {
  Box, Button, Typography,
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';

const EliminarTarea = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tarea, setTarea] = useState({});
  const [openDialog, setOpenDialog] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTarea = async () => {
      try {
        const response = await AxiosInstance.get(`tareas/${id}/`);
        setTarea(response.data);
      } catch {
        setError('Error al obtener la tarea');
      }
    };
    fetchTarea();
  }, [id]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`tareas/${id}/`);
      navigate('/tareas', {
        state: { message: `La tarea "${tarea.titulo}" fue eliminada correctamente.` },
      });
    } catch {
      setError('Error al eliminar la tarea.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/tareas');
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            borderRadius: '12px',
            padding: 2,
            boxShadow: '0px 6px 20px rgba(0,0,0,0.7)',
          },
        }}
        sx={{
          backdropFilter: 'blur(6px)',
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#f8fafc' }}>
          Eliminar Tarea
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#cbd5e1' }}>
            {tarea && tarea.titulo ? (
              <>
                ¿Estás seguro de que deseas eliminar la tarea{' '}
                <strong style={{ color: '#f87171' }}>{tarea.titulo}</strong>? Esta acción no se puede deshacer.
              </>
            ) : (
              'Cargando...'
            )}
          </DialogContentText>

          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            sx={{
              borderColor: '#6366f1',
              color: '#6366f1',
              '&:hover': {
                backgroundColor: '#6366f1',
                color: '#fff',
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#dc2626',
              },
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EliminarTarea;
