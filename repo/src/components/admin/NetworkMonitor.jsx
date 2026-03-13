import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Box, Container, Grid, IconButton, Stack, Chip, Divider, Typography
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Line
} from 'recharts';
import { 
  Hub, Security, Sensors, Terminal, ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NexusCard, NexusButton, CyberTitle, NeuralProgress, GlassBox } from '../common/NexusUI';

// Memoized Chart to prevent re-rendering the whole page on setiap data tick
const TelemetryChart = React.memo(({ data }) => (
    <Box sx={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} fontWeight={900} />
                <RechartsTooltip 
                    contentStyle={{ bgcolor: '#050514', border: '1px solid var(--primary)', borderRadius: '10px' }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="req" stroke="var(--primary)" fillOpacity={1} fill="url(#colorReq)" strokeWidth={3} />
                <Line type="monotone" dataKey="latency" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    </Box>
));

const NetworkMonitor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ cpu: 22, mem: 45, net: 12, disk: 30 });
  const [activeNodes, setActiveNodes] = useState([]);
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    const initialTraffic = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      req: Math.floor(Math.random() * 50) + 10,
      latency: Math.floor(Math.random() * 20) + 5
    }));
    setTrafficData(initialTraffic);

    const nodes = [
      { id: 'NODE_01', region: 'LATAM_NORTH', status: 'ACTIVE', load: 45 },
      { id: 'NODE_02', region: 'USEAST_SYNC', status: 'ACTIVE', load: 12 },
      { id: 'NODE_03', region: 'EURO_WEST', status: 'STANDBY', load: 0 },
      { id: 'NODE_04', region: 'ASIA_PACIFIC', status: 'THROTTLED', load: 88 }
    ];
    setActiveNodes(nodes);
    setLoading(false);

    const interval = setInterval(() => {
      setTrafficData(prev => [...prev.slice(1), {
        time: prev[prev.length - 1].time + 1,
        req: Math.floor(Math.random() * 60) + 20,
        latency: Math.floor(Math.random() * 15) + 5
      }]);

      setSystemHealth(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        mem: Math.min(100, Math.max(0, prev.mem + (Math.random() * 4 - 2))),
        net: Math.min(100, Math.max(0, prev.net + (Math.random() * 20 - 10))),
        disk: prev.disk
      }));

      const events = ['HANDSHAKE_ESTABLISHED', 'ENCRYPTION_KEY_ROTATED', 'PACKET_FILTER_SCAN', 'NODE_SYNC_COMPLETE'];
      setLogs(prev => [...prev.slice(-9), {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        event: events[Math.floor(Math.random() * events.length)],
        node: `NODE_0${Math.floor(Math.random() * 4) + 1}`
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  if (loading) return null;

  return (
    <Box sx={{ minHeight: '100vh', pb: 5 }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <IconButton onClick={() => navigate('/home')} sx={{ color: 'var(--primary)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 900, letterSpacing: 3 }}>SYS_MONITOR // REAL_TIME_TELEMETRY</Typography>
            <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: -1 }}>REDE_NEXUS_TRAFFIC_MONITOR</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
             <Chip icon={<Security sx={{ fontSize: '1rem !important' }} />} label="FIREWALL_ACTIVE" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', fontWeight: 800 }} />
             <Chip icon={<Sensors sx={{ fontSize: '1rem !important' }} />} label="LIVE_STREAM" sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', fontWeight: 800 }} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <NexusCard sx={{ p: 3, height: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, opacity: 0.7 }}>FLUJO_DE_DATOS_SECUNDARIO (PPS)</Typography>
              <TelemetryChart data={trafficData} />
            </NexusCard>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <NexusCard sx={{ p: 3, height: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, opacity: 0.7 }}>SALUD_DEL_SISTEMA</Typography>
              <Stack spacing={4} sx={{ mt: 2 }}>
                 <NeuralProgress label="PROCESAMIENTO_NEURAL" value={systemHealth.cpu} color="var(--primary)" />
                 <NeuralProgress label="ANCHO_DE_BANDA_GLOBAL" value={systemHealth.net} color="var(--accent)" />
                 <NeuralProgress label="MEMORIA_DE_NÚCLEO" value={systemHealth.mem} color="var(--secondary)" />
                 <NeuralProgress label="ESTABILIDAD_DATOS" value={98} color="#fff" />
              </Stack>
            </NexusCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <NexusCard sx={{ p: 3, height: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, opacity: 0.7 }}>NODOS_DE_SINCRONIZACIÓN_ACTIVOS</Typography>
              <Grid container spacing={2}>
                {activeNodes.map(node => (
                   <Grid size={6} key={node.id}>
                      <GlassBox sx={{ p: 2, border: `1px solid ${node.status === 'ACTIVE' ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'var(--primary)' }}>{node.id}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.5, fontSize: '0.9rem' }}>{node.region}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                           <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: node.status === 'ACTIVE' ? 'var(--primary)' : 'rgba(255,255,255,0.3)', boxShadow: node.status === 'ACTIVE' ? '0 0 10px var(--primary)' : 'none' }} />
                           <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.5 }}>{node.status}</Typography>
                        </Stack>
                      </GlassBox>
                   </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 'auto', p: 4, textAlign: 'center', opacity: 0.1 }}>
                 <Hub sx={{ fontSize: '5rem' }} />
              </Box>
            </NexusCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="frosted-glass" sx={{ p: 0, height: 400, display: 'flex', flexDirection: 'column', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.2)' }}>
                <Terminal sx={{ color: 'var(--accent)', fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'var(--accent)', letterSpacing: 1 }}>SISTEMA_DE_LOGS_DE_RED</Typography>
              </Box>
              <Box ref={logRef} sx={{ p: 2, overflowY: 'auto', flexGrow: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                <AnimatePresence>
                  {logs.map(log => (
                    <Box key={log.id} component={motion.div} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} sx={{ mb: 1, display: 'flex', gap: 2 }}>
                       <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>[{log.time}]</Typography>
                       <Typography variant="caption" sx={{ color: 'var(--accent)', fontWeight: 900 }}>{log.node}</Typography>
                       <Typography variant="caption" sx={{ color: '#fff' }}>{log.event}</Typography>
                    </Box>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default NetworkMonitor;
