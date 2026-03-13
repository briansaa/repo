import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AxiosInstance from '../Axios';
import { MaterialReactTable } from 'material-react-table';
import Dayjs from 'dayjs';
import {
  Box,
  IconButton,
  Button,
  Typography,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const getUsuarios = () => {
    AxiosInstance.get('usuarios/')
      .then((res) => {
        setUsuarios(res.data);
        setTotalUsuarios(res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener usuarios:', err);
        setLoading(false);
        setMessage('Hubo un problema al cargar los usuarios.');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setMessage(null);
        }, 5000);
      });
  };


  useEffect(() => {
    getUsuarios();
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
      accessorKey: 'nombre_usuario',
      header: 'Nombre',
      size: 150,
    },
    {
      accessorKey: 'correo',
      header: 'Correo',
      size: 220,
    },
    {
      accessorFn: (row) => row.rol?.rol || 'Sin Rol',
      header: 'Rol',
      size: 100,
    },
    {
      accessorFn: (row) => Dayjs(row.fecha_registro).format('DD-MM-YYYY'),
      header: 'Fecha Registro',
      size: 130,
    },
  ], []);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Tabla de usuarios */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box
            sx={{
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              color: '#fff',
              padding: '12px 16px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--neon-glow)',
              borderRadius: '12px',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '1px' }}>USUARIOS</Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#05070a',
                color: '#fff',
                fontWeight: 800,
                borderRadius: '12px',
                border: '1px solid var(--primary)',
                '&:hover': {
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                }
              }}
              onClick={() => navigate('/agregar-usuario')}
            >
              NUEVO USUARIO
            </Button>
          </Box>

          {showMessage && (
            <Alert severity="error" sx={{ marginBottom: '16px' }}>
              <strong>{message}</strong>
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: 'var(--primary)' }} />
            </Box>
          ) : (
            <MaterialReactTable
              columns={columns}
              data={usuarios}
              enableRowActions
              muiTableContainerProps={{ sx: { width: '100%' } }}
              muiTablePaperProps={{ 
                sx: { 
                  width: '100%', 
                  boxShadow: 'none',
                  bgcolor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                } 
              }}
              muiTableBodyCellProps={{ sx: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' } }}
              muiTableHeadCellProps={{ sx: { fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: 1 } }}
              renderRowActions={({ row }) => (
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <IconButton
                    sx={{ color: 'var(--primary)' }}
                    component={Link}
                    to={`/editar-usuario/${row.original.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    component={Link}
                    to={`/eliminar-usuario/${row.original.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            />
          )}
        </Grid>

        {/* Indicadores a la derecha */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Box sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(20px)',
            padding: 3,
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            height: 'fit-content',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>

  {/* Card 1: Usuarios */}
  <Box sx={{
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 3,
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.05)',
    '&:hover': {
      transform: 'translateY(-5px)',
      borderColor: 'var(--primary)',
      boxShadow: 'var(--neon-glow)',
    }
  }}>
    <Box sx={{ 
      backgroundColor: 'rgba(14, 165, 233, 0.1)', 
      width: 60, 
      height: 60, 
      borderRadius: '12px', 
      mx: 'auto', 
      mb: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid var(--primary)' 
    }}>
      <Person sx={{ fontSize: 35, color: 'var(--primary)' }} />
    </Box>
    <Typography variant="subtitle2" fontWeight="bold" color="#cbd5e1">
      Cantidad de Usuarios
    </Typography>
    <Typography variant="h5" sx={{ color: 'var(--primary)', fontWeight: 'bold' }}>
      {totalUsuarios}
    </Typography>
  </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Usuario;