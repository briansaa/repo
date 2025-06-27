import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const HistorialIA = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Capturamos el estado pasado desde la navegación
  const [message, setMessage] = useState(location.state?.message || null); // Si hay mensaje, lo capturamos
  const [showMessage, setShowMessage] = useState(false);

  // Obtener historial IA
  const getHistorial = () => {
    AxiosInstance.get('historiales/')
      .then((res) => {
        setHistorial(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener historial:', err);
        setLoading(false);
        setMessage('Hubo un problema al cargar el historial.');
      });
  };

  useEffect(() => {
    getHistorial();
  }, []);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false); // Oculta el mensaje después de 5 segundos
        setMessage(null); // Limpia el mensaje
      }, 5000);
      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [message]);

  const columns = [
    {
      accessorKey: 'nombre_usuario', // Mostrar nombre del usuario
      header: 'Usuario',
      size: 150,
    },
    {
      accessorKey: 'prompt',
      header: 'Prompt',
      size: 200,
    },
    {
      accessorKey: 'imagen_generada',
      header: 'Imagen Generada',
      size: 250,
      Cell: ({ cell }) => <a href={cell.getValue()} target="_blank" rel="noopener noreferrer">Ver Imagen</a>,
    },
    {
      accessorKey: 'fecha_generacion',
      header: 'Fecha Generación',
      size: 180,
    },
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', marginLeft: -12, marginRight: 20 }}>
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to right, rgba(63, 85, 118, 1), rgba(63, 85, 118, 0.6))',
          color: '#fff',
          padding: '12px 16px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5">Historial IA</Typography>
      </Box>

      {/* Mostrar el mensaje de éxito si está presente y el estado showMessage es true */}
      {showMessage && message && (
        <Alert severity="success" sx={{ marginBottom: '16px' }}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Typography>Cargando historial...</Typography>
      ) : (
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable
            columns={columns}
            data={historial}
            enableRowActions
            muiTableContainerProps={{ sx: { width: '100%' } }}
            muiTablePaperProps={{ sx: { width: '100%', boxShadow: 'none' } }}
            muiTableBodyCellProps={{ sx: { fontSize: '1rem' } }}
            muiTableHeadCellProps={{ sx: { fontSize: '1.05rem', fontWeight: 'bold' } }}
            renderRowActions={({ row }) => (
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <IconButton
                  color="error"
                  component={Link}
                  to={`/eliminar-historial/${row.original.id_historial}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default HistorialIA;
