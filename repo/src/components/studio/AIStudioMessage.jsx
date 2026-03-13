import React from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { NexusCard } from '../common/NexusUI';

const AIStudioMessage = React.memo(({ msg, onDelete }) => (
  <Box 
    component={motion.div}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    sx={{ mb: 4, maxWidth: '85%', alignSelf: 'flex-start' }}
  >
    <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--primary)', color: '#000', fontSize: '0.8rem', fontWeight: 900 }}>NX</Avatar>
      <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.5 }}>SISTEMA_NEXUS // {new Date(msg.fecha_generacion).toLocaleTimeString()}</Typography>
      <IconButton size="small" onClick={() => onDelete(msg.id_historial)} sx={{ ml: 'auto', opacity: 0.2, '&:hover': { opacity: 1, color: '#ff4d4d' } }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
    
    <NexusCard sx={{ p: 2, background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', pl: 2 }}>
        "{msg.prompt}"
      </Typography>
      <Box sx={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={msg.imagen_generada} alt="Sintetizado" style={{ width: '100%', display: 'block' }} />
        <Box sx={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 1 }}>
            <Tooltip title="Descargar">
                <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'var(--primary)', color: '#000' } }} href={msg.imagen_generada} target="_blank">
                    <ImageIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
      </Box>
    </NexusCard>
  </Box>
));

export default AIStudioMessage;
