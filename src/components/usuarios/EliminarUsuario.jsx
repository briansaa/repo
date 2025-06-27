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

const EliminarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await AxiosInstance.get(`usuarios/${id}/`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setError('Error al obtener los datos del usuario.');
      }
    };

    fetchUsuario();
  }, [id]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`usuarios/${id}/`);
      navigate('/usuarios', {
        state: {
          message: `El usuario ${usuario.nombre_usuario} fue eliminado correctamente.`,
        },
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar el usuario. Intente nuevamente.');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/usuarios');
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
        PaperProps={{
          sx: {
            backgroundColor: '#0f1419',
            color: '#e2e8f0',
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: '#ef4444',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.03)',
          }}
        >
          Eliminar Usuario
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: '#cbd5e1',
              fontSize: '1rem',
              lineHeight: 1.6,
              mt: 2,
            }}
          >
            {usuario ? (
              <>
                ¿Estás seguro de que deseas eliminar al usuario <strong style={{ color: '#f87171' }}>{usuario.nombre_usuario}</strong>?<br />
                <br />
                Esta acción <span style={{ color: '#f87171', fontWeight: 'bold' }}>no se puede deshacer</span>.
              </>
            ) : (
              'Cargando...'
            )}
          </DialogContentText>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            sx={{
              borderColor: '#3b82f6',
              color: '#3b82f6',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(59,130,246,0.1)',
                borderColor: '#60a5fa',
              }
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
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#dc2626',
              }
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

export default EliminarUsuario;
