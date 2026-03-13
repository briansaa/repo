import React from 'react';
import { 
  Box, Typography, List, IconButton, ListItemButton, ListItemText, ListItemSecondaryAction 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { NexusButton } from '../common/NexusUI';

const AIStudioSidebar = React.memo(({ sessions, activeSession, onSelect, onDelete, onNew }) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(5, 7, 10, 0.95)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <NexusButton fullWidth startIcon={<AddIcon />} onClick={onNew} sx={{ py: 1.5 }}>
        NUEVA SECUENCIA
      </NexusButton>
    </Box>
    <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pt: 2 }}>
      <Typography variant="caption" sx={{ px: 2, mb: 2, display: 'block', opacity: 0.4, fontWeight: 900, letterSpacing: 2 }}> HISTORIAL_DE_SÍNTESIS </Typography>
      {sessions.map((session) => (
        <ListItemButton 
          key={session.id_chat}
          onClick={() => onSelect(session.id_chat)}
          sx={{ 
            borderRadius: '12px',
            mb: 1,
            bgcolor: activeSession === session.id_chat ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
            border: activeSession === session.id_chat ? '1px solid var(--primary)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
          }}
        >
          <ListItemText 
            primary={session.nombre || 'Secuencia sin nombre'} 
            primaryTypographyProps={{ 
              noWrap: true, 
              variant: 'body2', 
              sx: { fontWeight: activeSession === session.id_chat ? 900 : 500, color: activeSession === session.id_chat ? 'var(--primary)' : '#fff' } 
            }}
            secondary={new Date(session.fecha_creacion).toLocaleDateString()}
            secondaryTypographyProps={{ sx: { fontSize: '0.65rem', opacity: 0.5 } }}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onDelete(session.id_chat); }} sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#ff4d4d' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </List>
  </Box>
));

export default AIStudioSidebar;
