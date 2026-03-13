import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import { NexusConfirmModal } from './NexusUI';

/**
 * NexusDeleteTerminal - Unified deletion component for the NEXUS AI ecosystem.
 * 
 * @param {string} apiEndpoint - The API path (e.g., 'usuarios', 'historiales', 'tareas').
 * @param {string} successRedirect - Route to navigate to after successful deletion.
 * @param {string} title - Modal title (e.g., 'ELIMINAR_OPERADOR').
 * @param {function} getMessage - Function that takes the item data and returns the warning message.
 * @param {string} confirmText - Label for the delete button.
 */
const NexusDeleteTerminal = ({ 
  apiEndpoint, 
  successRedirect, 
  title = "CONFIRMAR_ELIMINACIÓN",
  getMessage,
  confirmText = "ELIMINAR",
  cancelText = "ABORTAR"
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(`${apiEndpoint}/${id}/`);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching data for deletion [${apiEndpoint}]:`, error);
        setError('Error al localizar el artefacto en la red.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, apiEndpoint]);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${apiEndpoint}/${id}/`);
      navigate(successRedirect, {
        state: {
          message: `Operación completada: ID ${id} eliminado del registro.`
        }
      });
    } catch (error) {
      console.error(`Error deleting [${apiEndpoint}]:`, error);
      setError('ERROR_SEQ_FAIL // No se pudo completar la desintegración.');
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    navigate(successRedirect);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'var(--background)' }}>
      <CircularProgress sx={{ color: 'var(--primary)' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--background)' }}>
      <NexusConfirmModal
        open={openModal}
        onClose={handleClose}
        onConfirm={handleDelete}
        title={title}
        message={data ? getMessage(data) : "Estableciendo enlace de seguridad..."}
        confirmText={confirmText}
        cancelText={cancelText}
      />
      {error && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="caption" sx={{ fontWeight: 900, letterSpacing: 1 }}>{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default NexusDeleteTerminal;
