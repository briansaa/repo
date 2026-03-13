import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import { 
  Box, Typography, Alert, IconButton, TextField, Button, 
  Grid, Card, CardMedia, CardContent, CircularProgress,
  Dialog, DialogContent, Tooltip, Stack
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  AutoAwesome as MagicIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Brush as BrushIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NexusConfirmModal, CyberTitle, NexusButton } from '../common/NexusUI';

const HistorialIA = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const getHistorial = () => {
    setLoading(true);
    AxiosInstance.get('historiales/')
      .then((res) => {
        setHistorial(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener historial:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getHistorial();
  }, []);

  const handleDeleteTrigger = (id) => {
    navigate(`/eliminar-historial/${id}`);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header Section: Rebranded as Showcase */}
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h2" sx={{ fontWeight: 950, mb: 1, letterSpacing: '8px', fontSize: { xs: '2rem', md: '3.5rem' }, color: 'var(--primary)' }}>
          NEXUS_SHOWCASE
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 3, maxWidth: '600px', mx: 'auto', fontWeight: 500 }}>
          Explora y gestiona tu archivo histórico de visiones generadas por la red neuronal Nexus.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <NexusButton 
                onClick={() => navigate('/studio')}
                startIcon={<BrushIcon />}
                sx={{ px: 4, py: 1 }}
            >
                IR AL ESTUDIO
            </NexusButton>
        </Stack>
      </Box>

      {/* Grid Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, px: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff', opacity: 0.8 }}>
            ARCHIVO_DE_VISIONES
        </Typography>
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 800 }}>
            {historial.length} ELEMENTOS_SINTETIZADOS
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: 'var(--primary)' }} />
        </Box>
      ) : (
        <Grid container spacing={1} justifyContent="center">
           <AnimatePresence>
            {historial.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={item.id_historial}>
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Card sx={{ 
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: 'var(--primary)',
                                boxShadow: 'var(--neon-glow)',
                                transform: 'translateY(-8px)'
                            },
                            '&:hover .overlay': { opacity: 1 }
                        }}>
                            <Box sx={{ 
                                position: 'relative', 
                                height: 320, 
                                width: '100%',
                                overflow: 'hidden',
                                bgcolor: '#000'
                            }}>
                                <CardMedia
                                    component="img"
                                    image={item.imagen_generada}
                                    sx={{ 
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.8s ease'
                                    }}
                                />
                                <Box className="overlay" sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                                    opacity: 0,
                                    transition: 'opacity 0.4s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    p: 2,
                                    gap: 1
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: 'var(--primary)', 
                                        fontWeight: 900,
                                        fontSize: '0.75rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.2
                                    }}>
                                        {item.prompt}
                                    </Typography>
                                    
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Tooltip title="Vista Previa">
                                            <IconButton size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'var(--primary)', color: '#000' } }} onClick={() => setSelectedImage(item)}>
                                                <ViewIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Descargar">
                                            <IconButton size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'var(--primary)', color: '#000' } }} href={item.imagen_generada} target="_blank">
                                                <DownloadIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" sx={{ color: '#ff4d4d', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: '#ff4d4d', color: '#fff' } }} onClick={() => handleDeleteTrigger(item.id_historial)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                    
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 800 }}>
                                        SÍNTESIS // {new Date(item.fecha_generacion).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
           </AnimatePresence>
        </Grid>
      )}

      {/* Visor de imágenes */}
      <Dialog 
        open={Boolean(selectedImage)} 
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
            {selectedImage && (
                <Box sx={{ textAlign: 'center' }}>
                    <img 
                        src={selectedImage.imagen_generada} 
                        style={{ width: '100%', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 50px rgba(0,0,0,1)' }} 
                        alt={selectedImage.prompt}
                    />
                    <Box sx={{ mt: 3, p: 3, background: 'rgba(15, 23, 42, 0.95)', borderRadius: '20px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography sx={{ color: '#fff', mb: 2, fontWeight: 500, fontSize: '1.1rem' }}>{selectedImage.prompt}</Typography>
                        <Button 
                            startIcon={<DownloadIcon />} 
                            variant="contained" 
                            fullWidth
                            sx={{ borderRadius: '12px', py: 1.5, bgcolor: 'var(--primary)', color: '#000', fontWeight: 900 }} 
                            href={selectedImage.imagen_generada} 
                            target="_blank"
                        >
                            DESCARGAR ALTA RESOLUCIÓN
                        </Button>
                    </Box>
                </Box>
            )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default HistorialIA;
