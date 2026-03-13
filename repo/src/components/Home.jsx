import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Box, Container, Grid, Avatar, Chip, Tooltip, Stack, Divider, Typography
} from '@mui/material';
import { 
  Terminal, Storage, TravelExplore, Visibility, 
  SettingsInputComponent, Hub, Security, ArrowBackIosNew, ArrowForwardIos
} from '@mui/icons-material';
import AxiosInstance from './Axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NexusCard, NexusButton, CyberTitle, NeuralProgress, GlassBox } from './common/NexusUI';

const AdminTerminal = React.memo(({ activity, terminalRef, page, totalItems, onNext, onPrev }) => {
    const totalPages = Math.ceil(totalItems / 10);
    const hasNext = page < totalPages - 1;
    const hasPrev = page > 0;

    return (
        <Box className="frosted-glass" sx={{ p: 0, overflow: 'hidden', height: '100%', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(0,0,0,0.4)', position: 'relative', zIndex: 10 }}>
                <Terminal sx={{ fontSize: '1rem', color: 'var(--accent)' }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'var(--accent)', letterSpacing: 2 }}>MONITOR_SÍNTESIS_NEXUS_AI</Typography>
                
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, fontSize: '0.65rem' }}>
                        PAG: {page + 1} / {totalPages || 1}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Box 
                            component={motion.div}
                            whileHover={hasPrev ? { scale: 1.2, color: 'var(--primary)' } : {}}
                            onClick={hasPrev ? onPrev : undefined}
                            sx={{ cursor: hasPrev ? 'pointer' : 'default', opacity: hasPrev ? 1 : 0.2 }}
                        >
                            <ArrowBackIosNew sx={{ fontSize: '0.9rem' }} />
                        </Box>
                        <Box 
                            component={motion.div}
                            whileHover={hasNext ? { scale: 1.2, color: 'var(--primary)' } : {}}
                            onClick={hasNext ? onNext : undefined}
                            sx={{ cursor: hasNext ? 'pointer' : 'default', opacity: hasNext ? 1 : 0.2 }}
                        >
                            <ArrowForwardIos sx={{ fontSize: '0.9rem' }} />
                        </Box>
                    </Stack>
                    <Divider orientation="vertical" flexItem sx={{ height: 16, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--accent)', opacity: 0.5 }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary)', opacity: 0.5 }} />
                    </Box>
                </Box>
            </Box>
            <Box ref={terminalRef} className="admin-terminal" sx={{ height: '100%', minHeight: 320, bgcolor: 'rgba(0,0,0,0.2)', border: 'none', position: 'relative' }}>
                <div className="terminal-scanline"></div>
                {activity.map((item, i) => (
                    <div key={i} className="terminal-line">
                        <span className="terminal-timestamp">[{new Date(item.fecha_generacion).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="terminal-prompt">&gt; SÍNTESIS_REQ:</span>
                        <span className="terminal-content">
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{item.nombre_usuario.toUpperCase()}</span> generó: "{item.prompt.substring(0, 60)}..."
                        </span>
                    </div>
                ))}
                {!hasNext && (
                    <div className="terminal-line">
                        <span className="terminal-timestamp">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="terminal-prompt">&gt; SISTEMA_LISTO:</span> 
                        <span className="terminal-content" style={{ opacity: 0.5 }}>Esperando nuevos comandos...</span>
                    </div>
                )}
            </Box>
        </Box>
    );
});

const Home = () => {
  const navigate = useNavigate();
  const terminalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [terminalPage, setTerminalPage] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    total_generations: 0,
    active_users: 0,
    daily_traffic: [],
    recent_activity: [], 
    system_stats: { cpu: 24, ram: 12, net: 45 }
  });
  const [user, setUser] = useState({ nombre: '', rol: '' });

  const fetchData = useCallback(async () => {
    try {
        const [statsRes, feedRes] = await Promise.all([
            AxiosInstance.get('stats/'),
            AxiosInstance.get('historiales/')
        ]);
        
        setDashboardData(prev => ({
            ...prev,
            total_generations: statsRes.data.total_sintesis,
            active_users: statsRes.data.usuarios_activos,
            daily_traffic: statsRes.data.historical_data,
            recent_activity: feedRes.data,
            system_stats: { 
                cpu: Math.floor(Math.random() * 40) + 20, 
                ram: Math.floor(Math.random() * 15) + 30, 
                net: Math.floor(Math.random() * 80) + 10 
            }
        }));
        setLoading(false);
    } catch (err) {
        console.error("Admin Error:", err);
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const role = typeof storedUser?.rol === 'object' ? storedUser.rol.rol : storedUser?.rol;
    
    setUser({ nombre: storedUser.nombre_usuario || 'Explorer', rol: role });

    if (role !== 'administrador') {
      navigate('/studio');
      return;
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData, navigate]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [dashboardData.recent_activity]);

  const quickModules = useMemo(() => [
    { label: 'Visor de Showcase', icon: <Visibility />, desc: 'Auditoría de generaciones IA', path: '/historiales', color: 'var(--accent)' },
    { label: 'Entrada al Studio', icon: <Terminal />, desc: 'Acceso a terminal de síntesis', path: '/studio', color: 'var(--primary)' },
    { label: 'Monitor de Red', icon: <Hub />, desc: 'Tráfico y estabilidad de nodos', path: '/network-monitor', color: '#fff' },
    { label: 'Gestión de Acceso', icon: <TravelExplore />, desc: 'Control de operadores autorizados', path: '/usuarios', color: 'var(--secondary)' },
  ], []);

  if (loading) return null;

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', bgcolor: 'var(--background)' }}>
      
      <Container maxWidth="xl" sx={{ pt: 1, pb: 4, position: 'relative', zIndex: 1 }}>
        
        {/* HEADER STATUS BAR */}
        <NexusCard sx={{ mb: 4, py: 2 }}>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" justifyContent="space-between">
            <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="caption" sx={{ color: 'var(--secondary)', fontWeight: 900, letterSpacing: 2 }}>
                      NEXUS_CORE // SYNTHESIS_MONITOR
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 950 }}>DASHBOARD_DE_SÍNTESIS_NEURAL</Typography>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
                <Stack direction="row" spacing={2}>
                     <Chip icon={<Hub sx={{ fontSize: '1rem !important' }} />} label="NODE_ONLINE" size="small" sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)', fontWeight: 800 }} />
                     <Chip icon={<Security sx={{ fontSize: '1rem !important' }} />} label="SECURE_PROTO" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary)', fontWeight: 800 }} />
                </Stack>
            </Stack>

            <Box sx={{ display: 'flex', gap: 4 }}>
               {[
                 { label: 'CPU', value: `${dashboardData.system_stats.cpu}%`, color: 'var(--primary)' },
                 { label: 'MEM', value: `${dashboardData.system_stats.ram}%`, color: 'var(--accent)' },
                 { label: 'NET', value: `${dashboardData.system_stats.net}ms`, color: 'var(--secondary)' }
               ].map((stat, i) => (
                 <Box key={i} sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800 }}>{stat.label}</Typography>
                    <Typography variant="body1" sx={{ color: stat.color, fontWeight: 900, fontFamily: 'monospace' }}>{stat.value}</Typography>
                 </Box>
               ))}
            </Box>
          </Stack>
        </NexusCard>

        <Grid container spacing={3}>
          {/* SYSTEM METRICS */}
          <Grid size={{ xs: 12, sm: 5, md: 4 }}>
            <Stack spacing={1.5} sx={{ height: '100%' }}>
                <NexusCard sx={{ flexGrow: 1, py: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, mb: 2, display: 'block', opacity: 0.5, letterSpacing: 1 }}>SISTEMA_VITALES</Typography>
                    <NeuralProgress label="PROCESAMIENTO_NEURAL" value={dashboardData.system_stats.cpu} color="var(--primary)" />
                    <NeuralProgress label="ANCHO_DE_BANDA_SINC" value={dashboardData.system_stats.net} color="var(--accent)" />
                    <NeuralProgress label="MEMORIA_DE_NÚCLEO" value={dashboardData.system_stats.ram} color="var(--secondary)" />
                </NexusCard>

                <NexusCard glassSweep sx={{ background: 'rgba(14, 165, 233, 0.05)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 950, color: 'var(--primary)' }}>{dashboardData.active_users}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 1 }}>OPERADORES_CONECTADOS</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.5, mt: 1 }}>Estado de sincronización: OPTIMAL</Typography>
                </NexusCard>
            </Stack>
          </Grid>

          {/* TERMINAL */}
          <Grid size={{ xs: 12, sm: 7, md: 8 }}>
            <AdminTerminal 
                activity={dashboardData.recent_activity.slice(terminalPage * 10, (terminalPage + 1) * 10)} 
                terminalRef={terminalRef}
                page={terminalPage}
                totalItems={dashboardData.recent_activity.length}
                onNext={() => setTerminalPage(p => p + 1)}
                onPrev={() => setTerminalPage(p => p - 1)}
            />
          </Grid>

          {/* ACTIVITY TABLE */}
          <Grid size={{ xs: 12 }}>
             <NexusCard>
                <Typography variant="h6" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, fontWeight: 950 }}>
                    <Storage sx={{ color: 'var(--primary)' }} /> REGISTRO_DE_SÍNTESIS_GLOBAL
                </Typography>
                
                <Box sx={{ overflowX: 'auto' }}>
                    <table className="cyber-table">
                        <thead>
                            <tr style={{ background: 'transparent' }}>
                                <th style={{ textAlign: 'left', padding: '12px 16px', opacity: 0.5, fontSize: '0.75rem' }}>TIMESTAMP</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', opacity: 0.5, fontSize: '0.75rem' }}>OPERADOR</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', opacity: 0.5, fontSize: '0.75rem' }}>PROTOCOLO_PROMPT</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', opacity: 0.5, fontSize: '0.75rem' }}>VISUAL_PREVIEW</th>
                                <th style={{ textAlign: 'right', padding: '12px 16px', opacity: 0.5, fontSize: '0.75rem' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recent_activity.slice(0, 6).map((item) => (
                                <tr key={item.id_historial}>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{new Date(item.fecha_generacion).toLocaleString()}</td>
                                    <td>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem', bgcolor: 'var(--primary)', color: '#000' }}>{item.nombre_usuario?.[0]}</Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.nombre_usuario}</Typography>
                                        </Stack>
                                    </td>
                                    <td>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                                            {item.prompt.length > 80 ? item.prompt.substring(0, 80) + '...' : item.prompt}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={item.imagen_generada} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NexusButton size="small" variant="accent" sx={{ py: 0.5, px: 2, fontSize: '0.7rem' }}>AUDITAR</NexusButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
             </NexusCard>
          </Grid>

          {/* QUICK MODULES */}
          <Grid size={{ xs: 12 }}>
             <Grid container spacing={3}>
                {quickModules.map((mod, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                        <NexusCard 
                            onClick={mod.path !== '#' ? () => navigate(mod.path) : undefined}
                            glassSweep
                            sx={{ height: '100%' }}
                        >
                            <Box sx={{ color: mod.color, mb: 2 }}>{mod.icon}</Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{mod.label}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', mt: 1 }}>{mod.desc}</Typography>
                        </NexusCard>
                    </Grid>
                ))}
             </Grid>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Home;