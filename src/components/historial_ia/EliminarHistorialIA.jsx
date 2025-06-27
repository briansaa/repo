import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const EliminarHistorialIA = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(true);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await AxiosInstance.get(`historiales/${id}/`); // Ruta adaptada a tu API
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al obtener historial:', error);
        setError('Error al obtener los datos del historial.');
      }
    };

    fetchHistorial();
  }, [id]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`historiales/${id}/`); // Ruta adaptada
      navigate('/historiales', {
        state: {
          message: `El historial con el ID ${id} fue eliminado correctamente.`
        }
      });
    } catch (error) {
      console.error('Error al eliminar historial:', error);
      setError('Error al eliminar el historial. Intente nuevamente.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/historiales');
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: 'blur(3px)' }}
      >
        <DialogTitle id="alert-dialog-title">Eliminar Historial IA</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
            {historial ? (
              <>¿Estás seguro de que deseas eliminar el historial con el ID <strong>{historial.id_historial}</strong>? Esta acción no se puede deshacer.</>
            ) : (
              'Cargando...'
            )}
          </DialogContentText>
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EliminarHistorialIA;
