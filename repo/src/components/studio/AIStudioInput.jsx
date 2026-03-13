import React from 'react';
import { Box, TextField, Stack, Typography, CircularProgress } from '@mui/material';
import { FlashOn as FlashIcon } from '@mui/icons-material';
import { NexusButton } from '../common/NexusUI';

const PRESETS = [
    { id: 'REAL', label: 'REALISMO', prompt: "photorealistic, hyper-detailed, 8k" },
    { id: 'CYBR', label: 'CYBERPUNK', prompt: "cyberpunk aesthetic, neon glow" },
    { id: 'ART', label: 'OIL_PAINT', prompt: "oil painting style, masterpiece" },
    { id: 'ANIM', label: 'ANIME', prompt: "anime style, vibrant" },
    { id: 'SURR', label: 'SURREAL', prompt: "surrealist vision, dreamlike" },
];

const AIStudioInput = ({ prompt, setPrompt, onGenerate, onPresetClick, loading }) => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ 
          width: '100%',
          maxWidth: 900, 
          display: 'flex', 
          gap: 2,
          bgcolor: 'rgba(5, 7, 10, 0.9)',
          p: 1,
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(30px)',
          position: 'relative',
          '&:focus-within': { border: '1px solid var(--primary)' }
      }}>
          <TextField 
              fullWidth
              multiline
              maxRows={4}
              placeholder="Escribe tu comando de visión aquí..."
              variant="standard"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => { 
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onGenerate(); 
                }
              }}
              sx={{ 
                  px: 2,
                  '& .MuiInput-underline:before, & .MuiInput-underline:after': { display: 'none' },
                  textarea: { color: '#fff', fontSize: '1rem', fontWeight: 500 }
              }}
          />
          <NexusButton 
              disabled={loading || !prompt.trim()}
              onClick={() => onGenerate()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FlashIcon />}
              sx={{ px: 4 }}
          >
              SINTETIZAR
          </NexusButton>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ opacity: 0.6 }}>
          {PRESETS.map((p) => (
              <Typography 
                  key={p.id} 
                  variant="caption" 
                  onClick={() => onPresetClick(p.prompt)}
                  sx={{ cursor: 'pointer', '&:hover': { color: 'var(--primary)' }, fontWeight: 800 }}
              >
                  /{p.label}
              </Typography>
          ))}
      </Stack>
    </Box>
  );
};

export default AIStudioInput;
