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
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person, CheckCircle } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [tareasCompletadas, setTareasCompletadas] = useState(0);

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

  const getTareasCompletadas = () => {
    AxiosInstance.get('tareas/')
      .then((res) => {
        const completadas = res.data.filter((t) => t.completada === true);
        setTareasCompletadas(completadas.length);
      })
      .catch((err) => {
        console.error('Error al obtener tareas:', err);
      });
  };

  useEffect(() => {
    getUsuarios();
    getTareasCompletadas();
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
      accessorKey: 'rol_id',
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
    <Box sx={{ display: 'flex', gap: 3, marginLeft: -12, marginRight: 20 }}>
      {/* Tabla de usuarios */}
      <Box sx={{ flex: 3 }}>
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
          <Typography variant="h5">Usuarios</Typography>
          <Button
            variant="contained"
            sx={{
              backgroundImage: 'linear-gradient(to right, rgba(16, 17, 22, 0.8), rgba(16, 17, 22, 0.6))',
            }}
            onClick={() => navigate('/agregar-usuario')}
          >
            Agregar Usuario
          </Button>
        </Box>

        {showMessage && (
          <Alert severity="error" sx={{ marginBottom: '16px' }}>
            <strong>{message}</strong>
          </Alert>
        )}

        {loading ? (
          <Typography>Cargando usuarios...</Typography>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={usuarios}
            enableRowActions
            muiTableContainerProps={{ sx: { width: '100%' } }}
            muiTablePaperProps={{ sx: { width: '100%', boxShadow: 'none' } }}
            muiTableBodyCellProps={{ sx: { fontSize: '1rem' } }}
            muiTableHeadCellProps={{ sx: { fontSize: '1.05rem', fontWeight: 'bold' } }}
            renderRowActions={({ row }) => (
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <IconButton
                  sx={{ color: blue[900] }}
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
      </Box>

{/* Indicadores a la derecha */}
<Box sx={{
  flex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  padding: 3,
  borderRadius: '16px',
  boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  height: 'fit-content',
  mt: 8,
  border: '1px solid rgba(255, 255, 255, 0.1)',
}}>

  {/* Card 1: Usuarios */}
  <Box sx={{
    backgroundColor: '#ffffff10',
    padding: 3,
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      backgroundColor: '#ffffff15',
    }
  }}>
    <Box sx={{ 
      backgroundColor: '#3b82f620', 
      width: 60, 
      height: 60, 
      borderRadius: '50%', 
      mx: 'auto', 
      mb: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Person sx={{ fontSize: 35, color: '#3b82f6' }} />
    </Box>
    <Typography variant="subtitle2" fontWeight="bold" color="#cbd5e1">
      Cantidad de Usuarios
    </Typography>
    <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
      {totalUsuarios}
    </Typography>
  </Box>

  {/* Card 2: Tareas */}
  <Box sx={{
    backgroundColor: '#ffffff10',
    padding: 3,
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      backgroundColor: '#ffffff15',
    }
  }}>
    <Box sx={{ 
      backgroundColor: '#10b98120', 
      width: 60, 
      height: 60, 
      borderRadius: '50%', 
      mx: 'auto', 
      mb: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <CheckCircle sx={{ fontSize: 35, color: '#10b981' }} />
    </Box>
    <Typography variant="subtitle2" fontWeight="bold" color="#cbd5e1">
      Tareas Completadas
    </Typography>
    <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 'bold' }}>
      {tareasCompletadas}
    </Typography>
  </Box>
</Box>

    </Box>
  );
};

export default Usuario;