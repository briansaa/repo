import React from 'react';
import { Box, Typography, Button, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bolt as NeuralIcon, AutoAwesome as MagicIcon, Security as SecurityIcon, Hub as HubIcon } from '@mui/icons-material';
import { NexusButton, CyberTitle, GlassBox } from './common/NexusUI';

const LandingPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = typeof user?.rol === 'object' ? user.rol.rol : user?.rol;

    const features = [
        { icon: <MagicIcon sx={{ fontSize: 40 }} />, title: 'SÍNTESIS_IA', desc: 'Generación de imágenes ultra-detalladas mediante clústeres neuronales distribuidos.' },
        { icon: <HubIcon sx={{ fontSize: 40 }} />, title: 'ESTRUCTURA_NEXUS', desc: 'Gestión multi-secuencia para organizar tus visiones por hilos tácticos.' },
        { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'NÚCLEO_ADMIN', desc: 'Control total de la red y monitoreo de tráfico en tiempo real para administradores.' },
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'var(--background)', 
            color: 'var(--text-primary)', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            
            {/* HERO SECTION */}
            <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 20 }, pb: 10, zIndex: 10, position: 'relative' }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h1" sx={{ 
                            fontSize: { xs: '2.8rem', sm: '4rem', md: '7rem' }, 
                            mb: 2, 
                            fontWeight: 950,
                            letterSpacing: { xs: '-1px', md: '-2px' },
                            background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1
                        }}>
                            NEXUS_AI
                        </Typography>
                        <Typography variant="h5" sx={{ 
                            color: 'var(--primary)', 
                            fontWeight: 900, 
                            mb: 4, 
                            letterSpacing: { xs: 2, md: 4 },
                            fontSize: { xs: '0.9rem', sm: '1.2rem', md: '1.5rem' },
                            opacity: 0.8 
                        }}>
                            RED_DE_SÍNTESIS_NEURAL_AVANZADA
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            color: 'rgba(255,255,255,0.6)', 
                            maxWidth: '700px', 
                            mx: 'auto', 
                            mb: 6,
                            fontSize: '1.2rem',
                            lineHeight: 1.8
                        }}>
                            Bienvenidos a la frontera de la creación artificial. NEXUS proporciona el poder de cálculo
                            necesario para materializar visiones complejas en segundos. Entra en el núcleo y toma el control.
                        </Typography>
                        
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                            <NexusButton 
                                onClick={() => {
                                    if (!isLoggedIn) navigate('/login');
                                    else if (userRole === 'administrador') navigate('/home');
                                    else navigate('/studio');
                                }}
                                sx={{ px: 8, py: 2, fontSize: '1.2rem' }}
                            >
                                {isLoggedIn ? 'ACCEDER_AL_SISTEMA' : 'INICIAR_SECUENCIA'}
                            </NexusButton>
                            {!isLoggedIn && (
                                <Button 
                                    onClick={() => navigate('/register')}
                                    sx={{ 
                                        color: '#fff', 
                                        fontWeight: 900, 
                                        letterSpacing: 2,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        px: 6,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid #fff' }
                                    }}
                                >
                                    REGISTRAR_OPERADOR
                                </Button>
                            )}
                        </Stack>
                    </motion.div>
                </Box>

                {/* FEATURES GRID */}
                <Grid container spacing={3} sx={{ mt: { xs: 4, md: 10 } }}>
                    {features.map((f, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * i, duration: 0.6 }}
                            >
                                <GlassBox sx={{ 
                                    p: 4, 
                                    textAlign: 'center', 
                                    height: '100%',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    '&:hover': { borderColor: 'var(--primary)', boxShadow: 'var(--neon-glow)' }
                                }}>
                                    <Box sx={{ color: 'var(--primary)', mb: 3 }}>{f.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 950, mb: 2, letterSpacing: 1 }}>{f.title}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</Typography>
                                </GlassBox>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* NEURAL ARCHITECTURE SECTION */}
                <Box sx={{ mt: 20 }}>
                    <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 950, letterSpacing: 3, display: 'block', mb: 2 }}>
                        INFRAESTRUCTURA_DE_PROCESAMIENTO
                    </Typography>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 950, 
                                mb: 4, 
                                letterSpacing: 1, 
                                fontSize: { xs: '1.75rem', md: '2.40rem', lg: '3.5rem' },
                                lineHeight: 1.1,
                            }}>
                                ARQUITECTURA <br /> NEURAL_SOLARIS
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, lineHeight: 1.8 }}>
                                El núcleo Nexus opera sobre un clúster de tensores de quinta generación, optimizado para la interpolación latente en tiempo real. 
                                Nuestra arquitectura permite una fidelidad de detalle sin precedentes, escalando dinámicamente según la complejidad del prompt.
                            </Typography>
                            <Stack spacing={3}>
                                {[
                                    { label: 'NODE_CAPACITY', val: '2.4 Petahash/s' },
                                    { label: 'LATENCY_SINC', val: '45ms' },
                                    { label: 'MODEL_VERSION', val: 'AETERNA_v5.0_CORE' }
                                ].map((spec, i) => (
                                    <Box key={i} sx={{ borderLeft: '3px solid var(--primary)', pl: 3 }}>
                                        <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 900 }}>{spec.label}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{spec.val}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <GlassBox sx={{ 
                                p: 1, 
                                borderRadius: '32px', 
                                border: '1px solid rgba(14, 165, 233, 0.1)',
                                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(99, 102, 241, 0.05))'
                            }}>
                                <Box sx={{ 
                                    width: '100%', 
                                    height: 400, 
                                    borderRadius: '24px', 
                                    bgcolor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <NeuralIcon sx={{ fontSize: 160, color: 'var(--primary)', opacity: 0.1, position: 'absolute' }} />
                                    <Box sx={{ position: 'relative', textAlign: 'center', p: 4, backdropFilter: 'blur(10px)' }}>
                                        <Typography sx={{ color: 'var(--primary)', fontWeight: 900, mb: 1, letterSpacing: 2 }}>[NÚCLEO_ACTIVO]</Typography>
                                        <Box sx={{ height: '2px', width: '160px', bgcolor: 'rgba(255,255,255,0.05)', mx: 'auto', borderRadius: 2, overflow: 'hidden' }}>
                                            <motion.div 
                                                animate={{ x: [-160, 160] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                style={{ height: '100%', width: '100%', background: 'var(--primary)' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </GlassBox>
                        </Grid>
                    </Grid>
                </Box>

                {/* SYNTHESIS WORKFLOW SECTION */}
                <Box sx={{ mt: { xs: 10, md: 20 }, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 950, mb: { xs: 4, md: 8 }, fontSize: { xs: '1.75rem', md: '3rem' } }}>PROTOCOLO_DE_SÍNTESIS</Typography>
                    <Grid container spacing={3}>
                        {[
                            { step: '01', title: 'INPUT_DE_COMANDO', desc: 'Define los parámetros semánticos y ópticos de tu visión.' },
                            { step: '02', title: 'PROCESAMIENTO', desc: 'Nuestra red analiza los vectores de ruido para encontrar coherencia visual.' },
                            { step: '03', title: 'REFINAMIENTO', desc: 'Se aplican clústeres de detalle para optimizar texturas y luz.' },
                            { step: '04', title: 'OUTPUT_FINAL', desc: 'Materialización de la síntesis en alta resolución 8k.' }
                        ].map((w, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <Box sx={{ p: 4, position: 'relative' }}>
                                    <Typography variant="h1" sx={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: '50%', 
                                        transform: 'translateX(-50%)',
                                        opacity: 0.05,
                                        fontWeight: 950,
                                        fontSize: '6rem'
                                    }}>
                                        {w.step}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--primary)', position: 'relative' }}>{w.title}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{w.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* METRICS PANEL */}
                <Box sx={{ mt: 20 }}>
                    <GlassBox sx={{ p: 6, borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Grid container spacing={4} textAlign="center">
                            {[
                                { label: 'VISIONES_GENERADAS', val: '154,290+' },
                                { label: 'NODOS_ACTIVOS', val: '842' },
                                { label: 'EFICIENCIA_NEURAL', val: '99.9%' }
                            ].map((m, i) => (
                                <Grid size={{ xs: 12, md: 4 }} key={i}>
                                    <Typography variant="h3" sx={{ fontWeight: 950, color: 'var(--primary)', mb: 1 }}>{m.val}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, opacity: 0.5 }}>{m.label}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </GlassBox>
                </Box>
            </Container>

            {/* CALL TO ACTION BOTTOM */}
            <Box sx={{ py: 15, textAlign: 'center', background: 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.02))' }}>
                <Typography variant="h4" sx={{ fontWeight: 950, mb: 4 }}>¿LISTO_PARA_SINTETIZAR?</Typography>
                <NexusButton 
                    onClick={() => navigate(isLoggedIn ? (userRole === 'administrador' ? '/home' : '/studio') : '/login')}
                    sx={{ px: 10, py: 2.5, fontSize: '1.2rem' }}
                >
                    ESTABLECER_CONEXIÓN
                </NexusButton>
            </Box>

            {/* FOOTER */}
            <Box sx={{ mt: 'auto', py: 6, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(3, 7, 18, 0.5)' }}>
                <Typography variant="caption" sx={{ opacity: 0.3, fontWeight: 900, letterSpacing: 2 }}>
                    NEXUS_AI_SYSTEM // PROTOCOLO_V5.0 // © 2026_AETERNA_CORP
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;
