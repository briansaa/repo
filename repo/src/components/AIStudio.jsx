import React, { useState } from 'react';
import { 
  Box, Typography, IconButton, Stack, 
  CircularProgress, Divider, useMediaQuery, useTheme, SwipeableDrawer
} from '@mui/material';
import { 
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AutoAwesome as MagicIcon
} from '@mui/icons-material';
import { NexusConfirmModal } from './common/NexusUI';

// Refactored Imports
import { useSynthesis } from '../hooks/useSynthesis';
import AIStudioSidebar from './studio/AIStudioSidebar';
import AIStudioMessage from './studio/AIStudioMessage';
import AIStudioInput from './studio/AIStudioInput';

const AIStudio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Custom Hook for logic
  const {
      chatSessions, activeSession, setActiveSession, messages, loading,
      scrollRef, handleGenerate, handleNewSession, deleteSession, deleteMessage
  } = useSynthesis();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [prompt, setPrompt] = useState('');
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });

  const handlePresetClick = (presetPrompt) => {
    const newPrompt = prompt ? `${prompt}, ${presetPrompt}` : presetPrompt;
    setPrompt(newPrompt);
    handleGenerate(newPrompt);
  };

  const handleTriggerGenerate = () => {
      handleGenerate(prompt);
      setPrompt('');
  };

  const handleDeleteSession = (id) => {
    setConfirmModal({ open: true, id });
  };

  const confirmDelete = async () => {
    await deleteSession(confirmModal.id);
    setConfirmModal({ open: false, id: null });
  };

  return (
    <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 64px)', 
        overflow: 'hidden', 
        position: 'relative', 
        bgcolor: 'var(--background)',
        flexDirection: 'row'
    }}>

      {/* SIDEBAR */}
      {isMobile ? (
        <SwipeableDrawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          PaperProps={{ sx: { width: 280, bgcolor: 'rgba(5, 7, 10, 0.98)', backgroundImage: 'none' } }}
        >
          <AIStudioSidebar 
            sessions={chatSessions} 
            activeSession={activeSession}
            onSelect={(id) => { setActiveSession(id); setSidebarOpen(false); }}
            onDelete={handleDeleteSession}
            onNew={handleNewSession}
          />
        </SwipeableDrawer>
      ) : (
        <Box sx={{ 
          width: sidebarOpen ? 280 : 0, 
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          overflow: 'hidden',
          zIndex: 10,
          boxShadow: sidebarOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'
        }}>
          <AIStudioSidebar 
            sessions={chatSessions} 
            activeSession={activeSession}
            onSelect={setActiveSession}
            onDelete={handleDeleteSession}
            onNew={handleNewSession}
          />
        </Box>
      )}

      {/* MAIN WORKSPACE */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, minWidth: 0 }}>
        
        {/* TOOLBAR */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          bgcolor: 'rgba(13, 2, 33, 0.4)',
          backdropFilter: 'blur(20px)'
        }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: 'var(--primary)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                    {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Box>
                    <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 900, display: 'block', letterSpacing: 1 }}>
                        SALA_DE_SÍNTESIS // {activeSession ? `ID_${activeSession}` : 'STANDBY'}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: -1, lineHeight: 1 }}>AI_STUDIO_TERMINAL</Typography>
                </Box>
            </Stack>
            
            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 800 }}>MÉTRICA_LATENCIA</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--accent)', fontWeight: 900, fontFamily: 'monospace' }}>124ms</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 800 }}>ESTADO_NÚCLEO</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 900, fontFamily: 'monospace' }}>OPTIMAL</Typography>
                </Box>
            </Stack>
        </Box>

        {/* MESSAGES FEED */}
        <Box 
          ref={scrollRef}
          sx={{ 
            flexGrow: 1, 
            overflowY: 'scroll', 
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 2,
            maxHeight: '100%',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.05)', borderRadius: 10 }
          }}
        >
          {messages.length === 0 && !loading && (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.15 }}>
                <MagicIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>INICIAR_SECUENCIA_DE_SÍNTESIS</Typography>
                <Typography variant="caption">El sistema está en espera de comandos tácticos</Typography>
            </Box>
          )}

          {loading && (
             <Box sx={{ alignSelf: 'flex-start', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={16} sx={{ color: 'var(--primary)' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: 1 }}>SINTETIZANDO_VISIÓN_CORE...</Typography>
             </Box>
          )}

          {messages.map((msg) => (
            <AIStudioMessage key={msg.id_historial} msg={msg} onDelete={deleteMessage} />
          ))}
        </Box>

        {/* INPUT AREA */}
        <AIStudioInput 
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleTriggerGenerate}
            onPresetClick={handlePresetClick}
            loading={loading}
        />
      </Box>

      {/* CONFIRMATION MODAL */}
      <NexusConfirmModal 
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
        onConfirm={confirmDelete}
        title="ELIMINAR_SECUENCIA"
        message="¿Estás seguro de que deseas eliminar permanentemente esta secuencia de síntesis? Esta acción no se puede deshacer."
        confirmText="SÍ, ELIMINAR"
        cancelText="ABORTAR"
      />
    </Box>
  );
};

export default AIStudio;
