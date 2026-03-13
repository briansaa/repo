import React from 'react';
import { Box, Typography, Button, Paper, Stack, LinearProgress, Dialog, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { Bolt as NeuralIcon } from '@mui/icons-material';

/**
 * NexusCard: A premium, frosted-glass card with neon borders and hover effects.
 */
export const NexusCard = React.memo(({ children, sx = {}, onClick, glassSweep = false, ...props }) => (
  <Box
    component={motion.div}
    whileHover={onClick ? { scale: 1.01, translateY: -4 } : {}}
    onClick={onClick}
    className={`frosted-glass ${glassSweep ? 'glass-sweep' : ''}`}
    sx={{
      p: 3,
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.5)',
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
));

/**
 * NexusButton: A high-contrast neon button with custom animations.
 */
export const NexusButton = React.memo(({ children, variant = "primary", sx = {}, ...props }) => {
  const isSecondary = variant === "secondary";
  const isAccent = variant === "accent";
  const color = isSecondary ? 'var(--secondary)' : isAccent ? 'var(--accent)' : 'var(--primary)';
  
  return (
    <Button
       component={motion.div}
       whileHover={{ scale: 1.02, translateY: -1 }}
       whileTap={{ scale: 0.98 }}
       sx={{
         borderRadius: '12px',
         px: 4,
         py: 1.2,
         fontWeight: 900,
         letterSpacing: '1px',
         bgcolor: isSecondary || isAccent ? 'transparent' : color,
         color: isSecondary || isAccent ? color : '#000',
         border: isSecondary || isAccent ? `2px solid ${color}` : 'none',
         '&:hover': {
            bgcolor: isSecondary || isAccent ? 'rgba(255,255,255,0.05)' : '#fff',
         },
         ...sx
       }}
       {...props}
    >
      {children}
    </Button>
  );
});

/**
 * CyberTitle: A stylized title component with glitch effects.
 */
export const CyberTitle = React.memo(({ children, variant = "h4", glitch = false, ...props }) => (
  <Typography
    variant={variant}
    className={glitch ? "glitch-text" : ""}
    data-text={glitch ? children : undefined}
    sx={{
      fontWeight: 800,
      letterSpacing: '-0.5px',
      mb: 1,
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Typography>
));

/**
 * GlassBox: A lightweight utility for wrapping content in subtle frosted backgrounds.
 */
export const GlassBox = React.memo(({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.05)',
      p: 2,
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
));

/**
 * NeuralProgress: A stylized linear progress bar.
 */
export const NeuralProgress = React.memo(({ value, color = "var(--primary)", ...props }) => (
    <Box sx={{ width: '100%', mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.65rem', opacity: 0.7 }}>{props.label}</Typography>
            <Typography variant="caption" sx={{ color: color, fontWeight: 900 }}>{Math.round(value)}%</Typography>
        </Stack>
        <LinearProgress 
            variant="determinate" 
            value={value} 
            sx={{ 
                height: 6, 
                borderRadius: 3, 
                bgcolor: 'rgba(255,255,255,0.03)',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 }
            }} 
        />
    </Box>
));

/**
 * NexusConfirmModal: A premium confirmation dialog.
 */
export const NexusConfirmModal = React.memo(({ open, onClose, onConfirm, title, message, confirmText = "ACEPTAR", cancelText = "CANCELAR" }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      sx: {
        bgcolor: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 204, 0, 0.2)',
        borderRadius: '24px',
        boxShadow: '0 25px 80px -20px rgba(0,0,0,0.8)',
        maxWidth: '400px',
        color: '#fff'
      }
    }}
  >
    <DialogContent sx={{ pt: 4, pb: 2 }}>
      <CyberTitle variant="h6" sx={{ mb: 2, color: 'var(--primary)' }}>{title}</CyberTitle>
      <Typography variant="body2" sx={{ opacity: 0.8, color: '#fff', letterSpacing: '0.5px' }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 3, gap: 1 }}>
      <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>{cancelText}</Button>
      <NexusButton onClick={() => { onConfirm(); onClose(); }} variant="primary" sx={{ px: 3 }}>
        {confirmText}
      </NexusButton>
    </DialogActions>
  </Dialog>
));

/**
 * NexusCreditBadge: A premium indicator for neural credits.
 */
export const NexusCreditBadge = React.memo(({ credits, sx }) => (
  <Tooltip title="CAPACIDAD_DE_SÍNTESIS_REMANENTE">
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.8,
        borderRadius: '30px',
        background: 'rgba(255, 204, 0, 0.1)',
        border: '1px solid rgba(255, 204, 0, 0.3)',
        boxShadow: '0 0 15px rgba(255, 204, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        cursor: 'help',
        ...sx
      }}
    >
      <NeuralIcon sx={{ color: 'var(--primary)', fontSize: '1rem' }} />
      <Box>
        <Typography variant="caption" sx={{ 
          color: 'var(--primary)', 
          fontWeight: 950, 
          letterSpacing: 1,
          lineHeight: 1,
          display: 'block'
        }}>
          {credits}
        </Typography>
        <Typography variant="caption" sx={{ 
          fontSize: '0.5rem', 
          opacity: 0.6, 
          fontWeight: 900, 
          display: 'block',
          mt: -0.2
        }}>
          CRÉDITOS_AI
        </Typography>
      </Box>
    </Box>
  </Tooltip>
));
