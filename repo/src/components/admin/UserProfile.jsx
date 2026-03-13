import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Avatar, Grid, 
  TextField, Button, Divider, IconButton, Alert,
  Zoom, Chip, Stack, LinearProgress
} from '@mui/material';
import { 
  PhotoCamera, 
  Save as SaveIcon,
  Email as EmailIcon,
  Shield as ShieldIcon,
  AutoAwesome as AutoAwesomeIcon,
  Terminal as TerminalIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AxiosInstance from '../Axios';
import { GlassBox, NexusButton } from '../common/NexusUI';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        correo: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await AxiosInstance.get('me/');
                setUser(res.data);
                setFormData({
                    nombre_usuario: res.data.nombre_usuario,
                    correo: res.data.correo
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            await AxiosInstance.patch(`usuarios/${user.id}/`, formData);
            setMessage('IDENTIDAD_ACTUALIZADA // SINC_SUCCESS');
            setSeverity('success');
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            setMessage('ERROR_SYNCHRONIZING // SEQ_FAIL');
            setSeverity('error');
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return (
        <Box sx={{ width: '100%', mt: 4, px: 4 }}>
            <LinearProgress sx={{ bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: 'var(--primary)' } }} />
        </Box>
    );

    const userRole = user.rol?.rol || 'explorer';
    const firstLetter = formData.nombre_usuario?.charAt(0) || 'U';

    return (
        <Container maxWidth="xl" sx={{ pt: 6, pb: 10 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Grid container spacing={4}>
                    {/* LEFT COLUMN: IDENTITY DECK */}
                    <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                        <GlassBox sx={{ 
                            p: 0, 
                            borderRadius: '32px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            background: 'rgba(15, 23, 42, 0.4)',
                            height: '100%'
                        }}>
                            {/* Profile Header Background */}
                            <Box sx={{ 
                                height: 280, 
                                width: '100%', 
                                background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.2) 0%, transparent 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 180, height: 180, 
                                            bgcolor: 'var(--primary)',
                                            fontSize: '4.5rem', fontWeight: 900,
                                            boxShadow: 'var(--neon-glow)',
                                            border: '6px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {firstLetter.toUpperCase()}
                                    </Avatar>
                                </motion.div>
                                <IconButton 
                                    sx={{ 
                                        position: 'absolute', bottom: 60, right: 'calc(50% - 90px)', 
                                        bgcolor: '#fff', color: '#000',
                                        '&:hover': { bgcolor: 'var(--primary)', color: '#fff' }
                                    }}
                                >
                                    <PhotoCamera fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ px: 4, pb: 6, mt: -4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 950, mb: 1 }}>{formData.nombre_usuario}</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, fontWeight: 500 }}>
                                    Último acceso: {new Date().toLocaleDateString()} // Nexus_v5.0
                                </Typography>

                                <Stack spacing={3}>
                                    <TextField
                                        label="NOMBRE_OPERADOR"
                                        fullWidth
                                        variant="standard"
                                        value={formData.nombre_usuario}
                                        onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                                        InputProps={{ disableUnderline: true, sx: { color: '#fff', fontSize: '1.1rem', fontWeight: 600, p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' } }}
                                        InputLabelProps={{ shrink: true, sx: { color: 'var(--primary)', fontWeight: 900, ml: 1 } }}
                                    />
                                    <TextField
                                        label="DIRECCIÓN_ENLACE"
                                        fullWidth
                                        variant="standard"
                                        value={formData.correo}
                                        disabled
                                        InputProps={{ disableUnderline: true, sx: { color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', fontWeight: 600, p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' } }}
                                        InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.3)', fontWeight: 900, ml: 1 } }}
                                    />
                                </Stack>

                                <Box sx={{ mt: 5 }}>
                                    <NexusButton 
                                        onClick={handleSave} 
                                        fullWidth 
                                        startIcon={<SaveIcon />}
                                        sx={{ py: 2, borderRadius: '16px' }}
                                    >
                                        SINCRONIZAR_PERFIL
                                    </NexusButton>
                                </Box>

                                {message && (
                                    <Zoom in={true}><Alert severity={severity} sx={{ mt: 3, borderRadius: '12px' }}>{message}</Alert></Zoom>
                                )}
                            </Box>
                        </GlassBox>
                    </Grid>

                    {/* RIGHT COLUMN: OPERATIONAL DECK */}
                    <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                        <Stack spacing={4}>
                            {/* Card 1: Account Nodes */}
                            <GlassBox sx={{ p: 4, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 950 }}>NODOS_IA_ACTIVOS</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <NexusButton variant="text" size="small" sx={{ color: 'var(--primary)' }}>SINC_TODO</NexusButton>
                                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.2)' }}><TerminalIcon fontSize="small" /></IconButton>
                                    </Stack>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ p: 3, bgcolor: 'rgba(14, 165, 233, 0.05)', borderRadius: '20px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 900, color: 'var(--primary)', mb: 1, display: 'block' }}>CAPACIDAD_NODE_A</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 950 }}>2.4 TH/s</Typography>
                                            <Box sx={{ mt: 2, height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5 }} style={{ height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box sx={{ p: 3, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 900, color: 'var(--secondary)', mb: 1, display: 'block' }}>LATENCIA_NEURAL</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 950 }}>12 ms</Typography>
                                            <Box sx={{ mt: 2, height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} transition={{ duration: 1.5 }} style={{ height: '100%', background: 'var(--secondary)', borderRadius: 2 }} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </GlassBox>

                            {/* Card 2: Security & Credentials */}
                            <GlassBox sx={{ p: 4, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 950, mb: 4 }}>SEGURIDAD_Y_ACCESO</Typography>
                                <Grid container spacing={4}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack spacing={2}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--primary)' }}>GESTIÓN_DE_CLAVES</Typography>
                                            <TextField
                                                type="password"
                                                label="CLAVE_ACTUAL"
                                                placeholder="••••••••••••"
                                                fullWidth
                                                variant="filled"
                                                InputProps={{ disableUnderline: true, sx: { color: '#fff', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px' } }}
                                                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)', fontWeight: 800 } }}
                                            />
                                            <TextField
                                                type="password"
                                                label="NUEVA_CLAVE"
                                                fullWidth
                                                variant="filled"
                                                InputProps={{ disableUnderline: true, sx: { color: '#fff', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px' } }}
                                                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)', fontWeight: 800 } }}
                                            />
                                            <NexusButton size="small" sx={{ alignSelf: 'flex-start' }}>ROTAR_CLAVES</NexusButton>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--secondary)', mb: 2 }}>PROTECCIÓN_MULTICAPA</Typography>
                                        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>AUTENTICACIÓN_2FA</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>Protección por token biométrico</Typography>
                                                </Box>
                                                <Chip label="ACTIVO" size="small" sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', fontWeight: 900 }} />
                                            </Stack>
                                        </Box>
                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>SESIONES_ACTIVAS</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>2 terminales enlazados</Typography>
                                                </Box>
                                                <IconButton size="small" sx={{ color: 'var(--secondary)' }}><PublicIcon fontSize="small" /></IconButton>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </GlassBox>

                            {/* Card 3: System Preferences */}
                            <GlassBox sx={{ p: 4, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 950, mb: 4 }}>PREFERENCIAS_DEL_SISTEMA</Typography>
                                <Grid container spacing={4}>
                                    {[
                                        { label: 'ALTO_RENDIMIENTO', desc: 'Maximiza el uso de la GPU para síntesis ultra-rápida.', active: true },
                                        { label: 'NOTIFICACIONES_NEXUS', desc: 'Alertas de red y actualizaciones de modelos IA.', active: true },
                                        { label: 'MODO_SINC_AUTO', desc: 'Respaldo automático de imágenes en el nodo central.', active: false }
                                    ].map((pref, i) => (
                                        <Grid size={{ xs: 12, md: 4 }} key={i}>
                                            <Box sx={{ 
                                                p: 3, 
                                                height: '100%', 
                                                bgcolor: 'rgba(255,255,255,0.02)', 
                                                borderRadius: '24px', 
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { bgcolor: 'rgba(14, 165, 233, 0.05)', borderColor: 'var(--primary)' }
                                            }}>
                                                <Stack spacing={2}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: pref.active ? 'var(--primary)' : 'rgba(255,255,255,0.4)' }}>{pref.label}</Typography>
                                                        <Box sx={{ 
                                                            width: 40, height: 20, 
                                                            bgcolor: pref.active ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                                                            borderRadius: 10, position: 'relative', cursor: 'pointer' 
                                                        }}>
                                                            <Box sx={{ 
                                                                width: 16, height: 16, 
                                                                bgcolor: '#fff', 
                                                                borderRadius: '50%', 
                                                                position: 'absolute', 
                                                                top: 2, 
                                                                left: pref.active ? 22 : 2, 
                                                                transition: '0.2s' 
                                                            }} />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption" sx={{ opacity: 0.5, lineHeight: 1.4 }}>{pref.desc}</Typography>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </GlassBox>

                            {/* Card 4: Recent Logs (Inspired by Reference) */}
                            <GlassBox sx={{ p: 4, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 950 }}>REGISTRO_DE_SÍNTESIS</Typography>
                                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.2)' }}><HistoryIcon /></IconButton>
                                </Stack>

                                <Stack spacing={2.5}>
                                    {[
                                        { label: 'SÍNTESIS_IMAGE_4k', id: '#4520', status: 'COMPLETADO', color: 'var(--primary)', icon: <CheckIcon fontSize="small" /> },
                                        { label: 'VECTOR_REF_SYNC', id: '#4518', status: 'RECHAZADO', color: '#ff5252', icon: <WarningIcon fontSize="small" /> },
                                        { label: 'NEURAL_TRAINING', id: '#4515', status: 'COMPLETADO', color: 'var(--primary)', icon: <CheckIcon fontSize="small" /> },
                                        { label: 'DATA_SINC_NEXUS', id: '#4512', status: 'COMPLETADO', color: 'var(--primary)', icon: <CheckIcon fontSize="small" /> }
                                    ].map((log, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ color: log.color, display: 'flex' }}>{log.icon}</Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{log.label}</Typography>
                                            </Stack>
                                            <Chip 
                                                label={log.status} 
                                                size="small" 
                                                sx={{ 
                                                    minWidth: 100,
                                                    bgcolor: log.color === 'var(--primary)' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255, 82, 82, 0.1)', 
                                                    color: log.color, 
                                                    fontWeight: 900,
                                                    fontSize: '0.65rem'
                                                }} 
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </GlassBox>
                        </Stack>
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    );
};

export default UserProfile;
