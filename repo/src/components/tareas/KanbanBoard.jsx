import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Card, CardContent, IconButton, 
  Chip, Avatar, Button, Tooltip, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ChevronRight,
  ChevronLeft,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = typeof user?.rol === 'object' ? user.rol.rol : user?.rol;

    const fetchTasks = async () => {
        try {
            const res = await AxiosInstance.get('tareas/');
            setTasks(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const columns = [
        { id: 'PENDIENTE', title: 'PENDIENTES', color: '#9d1df5' },
        { id: 'PROGRESO', title: 'EN PROGRESO', color: '#ff007f' },
        { id: 'COMPLETADA', title: 'COMPLETADAS', color: '#00f3ff' }
    ];

    const moveTask = async (taskId, newStatus) => {
        try {
            await AxiosInstance.patch(`tareas/${taskId}/`, { estado: newStatus, completada: newStatus === 'COMPLETADA' });
            fetchTasks();
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    const deleteTask = async (taskId) => {
        if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
            try {
                await AxiosInstance.delete(`tareas/${taskId}/`);
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const getPriorityColor = (prio) => {
        switch(prio) {
            case 'ALTA': return '#ef4444';
            case 'MEDIA': return '#f59e0b';
            case 'BAJA': return '#10b981';
            default: return '#3b82f6';
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                    Tablero Kanban
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => navigate('/agregar-tarea')}
                    sx={{ 
                        borderRadius: '4px',
                        background: 'linear-gradient(45deg, #9d1df5 30%, #ff007f 90%)',
                        boxShadow: '0 0 20px rgba(157, 29, 245, 0.4)',
                        fontWeight: 900,
                        letterSpacing: '1px'
                    }}
                >
                    NUEVA TAREA
                </Button>
            </Box>

            <Grid container spacing={3}>
                {columns.map((column) => (
                    <Grid size={{ xs: 12, md: 4 }} key={column.id}>
                        <Paper sx={{ 
                            p: 2, 
                            minHeight: '70vh', 
                            background: '#0a0c12',
                            border: `1px solid ${column.color}33`,
                            borderRadius: 2,
                            boxShadow: `0 0 30px ${column.color}05`
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: column.color, mr: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#94a3b8', flexGrow: 1 }}>
                                    {column.title}
                                </Typography>
                                <Chip 
                                    label={tasks.filter(t => t.estado === column.id).length} 
                                    size="small" 
                                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }} 
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <AnimatePresence mode='popLayout'>
                                    {tasks.filter(t => t.estado === column.id).map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card sx={{ 
                                                background: '#05070a',
                                                border: '1px solid rgba(157, 29, 245, 0.2)',
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: column.color,
                                                    boxShadow: `0 0 20px ${column.color}44`,
                                                    transform: 'scale(1.02)'
                                                }
                                            }}>
                                                <CardContent sx={{ p: '16px !important' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Chip 
                                                            label={task.tipo} 
                                                            size="small" 
                                                            sx={{ 
                                                                fontSize: '0.65rem', 
                                                                height: 20,
                                                                bgcolor: `${column.color}11`,
                                                                color: column.color,
                                                                borderRadius: '4px',
                                                                fontWeight: 800
                                                            }} 
                                                        />
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            {column.id !== 'PENDIENTE' && (
                                                                <IconButton size="small" onClick={() => moveTask(task.id, column.id === 'COMPLETADA' ? 'PROGRESO' : 'PENDIENTE')}>
                                                                    <ChevronLeft fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            {column.id !== 'COMPLETADA' && (
                                                                <IconButton size="small" onClick={() => moveTask(task.id, column.id === 'PENDIENTE' ? 'PROGRESO' : 'COMPLETADA')}>
                                                                    <ChevronRight fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            <IconButton size="small" color="error" onClick={() => deleteTask(task.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                                                        {task.titulo}
                                                    </Typography>
                                                    
                                                    <Typography variant="body2" sx={{ 
                                                        color: '#94a3b8', 
                                                        mb: 2,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {task.descripcion}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <FlagIcon sx={{ fontSize: 16, color: getPriorityColor(task.prioridad) }} />
                                                            <Typography variant="caption" sx={{ color: '#a0aec0', fontWeight: 600 }}>
                                                                {task.prioridad}
                                                            </Typography>
                                                            {userRole === 'administrador' && task.nombre_usuario && (
                                                                <Chip 
                                                                    label={`@${task.nombre_usuario}`} 
                                                                    size="small" 
                                                                    sx={{ 
                                                                        height: 18, 
                                                                        fontSize: '0.6rem', 
                                                                        bgcolor: 'rgba(255,255,255,0.05)',
                                                                        color: 'var(--text-secondary)',
                                                                        ml: 1
                                                                    }} 
                                                                />
                                                            )}
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <ScheduleIcon sx={{ fontSize: 14, color: '#64748b' }} />
                                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                {task.fecha_vencimiento}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default KanbanBoard;
