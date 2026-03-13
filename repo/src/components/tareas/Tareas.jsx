import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AxiosInstance from '../Axios';
import { MaterialReactTable } from 'material-react-table';
import Dayjs from 'dayjs';
import { Box, IconButton, Button, Typography, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getTareas = () => {
    AxiosInstance.get('tareas/')
      .then((res) => {
        setTareas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener tareas:', err);
        setLoading(false);
        setMessage('Hubo un problema al cargar las tareas.');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setMessage(null);
        }, 5000);
      });
  };

  useEffect(() => {
    getTareas();
  }, []);

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setMessage(null);
      }, 5000);
    }
  }, [location.state]);

  const columns = useMemo(() => [
    {
      accessorKey: 'titulo',
      header: 'Título',
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
    },
    {
      accessorFn: (row) => Dayjs(row.fecha_vencimiento).format('DD-MM-YYYY'),
      header: 'Fecha Vencimiento',
    },
    {
      accessorKey: 'prioridad',
      header: 'Prioridad',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
    },
    {
      accessorFn: (row) => (row.completada ? 'Sí' : 'No'),
      header: '¿Completada?',
    },
    {
      accessorKey: 'usuario',
      header: 'ID Usuario',
    }
  ], []);

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
        <Typography variant="h5">Tareas</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundImage: 'linear-gradient(to right, rgba(16, 17, 22, 0.8), rgba(16, 17, 22, 0.6))',
          }}
          onClick={() => navigate('/agregar-tarea')}
        >
          Agregar Tarea
        </Button>
      </Box>

      {showMessage && (
        <Alert severity="error" sx={{ marginBottom: '16px' }}>
          <strong>{message}</strong>
        </Alert>
      )}

      {loading ? (
        <Typography>Cargando tareas...</Typography>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={tareas}
          enableRowActions
            muiTableContainerProps={{
    sx: {
      maxWidth: '1000px',  // Límite de ancho
      mx: 'auto',          // Centrar horizontalmente
    },
  }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <IconButton
                sx={{ color: blue[900] }}
                component={Link}
                to={`/editar-tarea/${row.original.id}`}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                component={Link}
                to={`/eliminar-tarea/${row.original.id}`}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      )}
    </Box>
  );
};

export default Tareas;
