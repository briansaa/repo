import React, { useEffect, useMemo, useState } from 'react';
import AxiosInstance from './Axios';
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardActions, CardMedia, 
  Container, Chip, IconButton, Avatar, Paper
} from '@mui/material';
import { 
  ArrowForward, 
  AutoAwesome, 
  Speed, 
  Security,
  TrendingUp,
  Visibility,
  LocalShipping,
  Support,
  Palette,
  ShoppingCart,
  People,
  Assignment
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const Home = () => {
  // Datos reales de la API (antes eran números fijos de ejemplo)
  const [usuarios, setUsuarios] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    Promise.all([AxiosInstance.get('usuarios/'), AxiosInstance.get('tareas/')])
      .then(([u, t]) => { setUsuarios(u.data); setTareas(t.data); })
      .catch(() => {});
  }, []);

  const features = [
    {
      title: 'Diseños Personalizados',
      description: 'Crea tus propios diseños únicos con ayuda de nuestra IA generativa de última generación.',
      image: './src/images/primero.png',
      icon: <Palette sx={{ fontSize: 30 }} />,
      color: '#3b82f6'
    },
    {
      title: 'Vista Previa en Tiempo Real',
      description: 'Visualiza cómo quedará tu producto final antes de ordenarlo con renderizado instantáneo.',
      image: './src/images/segundo.png',
      icon: <Visibility sx={{ fontSize: 30 }} />,
      color: '#10b981'
    },
    {
      title: 'Órdenes Simplificadas',
      description: 'Realiza tus pedidos con facilidad y seguimiento en línea con nuestra plataforma optimizada.',
      image: './src/images/tercero.png',
      icon: <ShoppingCart sx={{ fontSize: 30 }} />,
      color: '#f59e0b'
    },
    {
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está siempre disponible para ayudarte con cualquier duda o problema.',
      image: './src/images/cuarto.png',
      icon: <Support sx={{ fontSize: 30 }} />,
      color: '#ef4444'
    },
    {
      title: 'Entrega Rápida',
      description: 'Recibe tus productos en el menor tiempo posible, sin sorpresas ni retrasos.',
      image: './src/images/quinto.png',
      icon: <LocalShipping sx={{ fontSize: 30 }} />,
      color: '#8b5cf6'
    },
    {
      title: 'Diseños Exclusivos',
      description: 'Accede a diseños exclusivos creados especialmente para ti por nuestros expertos.',
      image: './src/images/sexto.png',
      icon: <AutoAwesome sx={{ fontSize: 30 }} />,
      color: '#06b6d4'
    },
  ];

  // Tareas por mes de vencimiento (últimos 6 meses)
  const userTaskData = useMemo(() => {
    const hoy = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - 5 + i, 1);
      const delMes = tareas.filter((t) => {
        const f = new Date(`${t.fecha_vencimiento}T00:00:00`);
        return f.getFullYear() === d.getFullYear() && f.getMonth() === d.getMonth();
      });
      return {
        mes: MESES[d.getMonth()],
        usuarios: new Set(delMes.map((t) => t.usuario)).size,
        tareas: delMes.length,
        completadas: delMes.filter((t) => t.completada).length,
      };
    });
  }, [tareas]);

  // Estado de las tareas
  const hoyISO = new Date().toISOString().slice(0, 10);
  const completadas = tareas.filter((t) => t.completada).length;
  const vencidas = tareas.filter((t) => !t.completada && t.fecha_vencimiento < hoyISO).length;
  const taskStatusData = [
    { name: 'Completadas', value: completadas, color: '#10b981' },
    { name: 'Pendientes', value: tareas.length - completadas - vencidas, color: '#3b82f6' },
    { name: 'Vencidas', value: vencidas, color: '#ef4444' },
  ];

  const tasa = tareas.length ? Math.round((completadas / tareas.length) * 100) : 0;
  const stats = [
    { value: tareas.length.toLocaleString('es-PE'), label: 'Total Tareas', color: '#3b82f6' },
    { value: usuarios.length.toLocaleString('es-PE'), label: 'Usuarios', color: '#10b981' },
    { value: `${tasa}%`, label: 'Tasa Completada', color: '#f59e0b' },
    { value: vencidas.toLocaleString('es-PE'), label: 'Tareas Vencidas', color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          background: 'rgba(0, 0, 0, 0.9)',
          padding: 2,
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 600 }}>{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} sx={{ color: entry.color, fontSize: '0.9rem' }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)',
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0
          }
        }}>
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip 
              label="✨ Panel de Administración" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: '0.9rem',
                fontWeight: 600
              }} 
            />
            
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff 30%, #3b82f6 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Bienvenido a SYNCHRON IA
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#94a3b8',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Gestión completa de usuarios, diseños, órdenes y más con tecnología de inteligencia artificial
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                href="/historiales"
                sx={{
                  background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  }
                }}
              >
                Explorar Prompts IA
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper sx={{
                p: 3,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  background: 'rgba(255, 255, 255, 0.08)',
                }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    color: stat.color,
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Analytics Dashboard Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: '#ffffff'
            }}
          >
            Dashboard de Análisis
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: '#94a3b8',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Monitorea el rendimiento de usuarios y tareas en tiempo real
          </Typography>

          <Grid container spacing={4}>
            {/* Gráfico de Barras - Usuarios y Tareas por Mes */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                height: '400px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <People sx={{ color: '#3b82f6', mr: 2, fontSize: 30 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    Usuarios Activos y Tareas
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={userTaskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="mes" 
                      stroke="#94a3b8" 
                      fontSize={12}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="usuarios" fill="#3b82f6" name="Usuarios" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tareas" fill="#10b981" name="Tareas Creadas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completadas" fill="#f59e0b" name="Tareas Completadas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Gráfico de Pastel - Estado de Tareas */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                height: '400px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Assignment sx={{ color: '#10b981', mr: 2, fontSize: 30 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    Estado de Tareas
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {taskStatusData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: item.color, 
                          borderRadius: '50%', 
                          mr: 2 
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        {item.name}: {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Gráfico de Área - Tendencia de Productividad */}
            <Grid item xs={12}>
              <Paper sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                height: '350px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ color: '#8b5cf6', mr: 2, fontSize: 30 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    Tendencia de Productividad
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={userTaskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTareas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="tareas" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorTareas)" 
                      name="Tareas Creadas"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completadas" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorCompletadas)" 
                      name="Tareas Completadas"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: '#ffffff'
            }}
          >
            Características Principales
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: '#94a3b8',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Descubre todas las herramientas que SELTA pone a tu disposición
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} lg={3} key={index}>
                <Card sx={{
                  height: '340px',
                  width: '350px',                  
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: `0 20px 40px rgba(${feature.color === '#3b82f6' ? '59, 130, 246' : 
                                                   feature.color === '#10b981' ? '16, 185, 129' :
                                                   feature.color === '#f59e0b' ? '245, 158, 11' :
                                                   feature.color === '#ef4444' ? '239, 68, 68' :
                                                   feature.color === '#8b5cf6' ? '139, 92, 246' : '6, 182, 212'}, 0.3)`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`,
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                    sx={{ 
                      borderRadius: '16px 16px 0 0',
                      filter: 'brightness(0.9)',
                      transition: 'filter 0.3s ease',
                      '&:hover': {
                        filter: 'brightness(1.1)'
                      }
                    }}
                  />
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        backgroundColor: `${feature.color}20`,
                        color: feature.color,
                        mr: 2,
                        width: 50,
                        height: 50
                      }}>
                        {feature.icon}
                      </Avatar>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#ffffff',
                          flex: 1
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#94a3b8',
                        lineHeight: 1.6,
                        mb: 3
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>

                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why SELTA Section */}
        <Box sx={{ 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          p: 6,
          mt: 5,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: '#ffffff'
            }}
          >
            ¿Por qué elegir SELTA?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#94a3b8',
              mb: 6,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            La plataforma más avanzada para gestión de diseños con inteligencia artificial
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <AutoAwesome sx={{ fontSize: 50, color: '#3b82f6', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                  Tecnología IA
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  Utilizamos inteligencia artificial de última generación para generar diseños únicos y personalizados al instante.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <Speed sx={{ fontSize: 50, color: '#10b981', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                  Gestión Integral
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  Administra usuarios, roles, diseños, pedidos y más desde un solo panel centralizado y eficiente.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <TrendingUp sx={{ fontSize: 50, color: '#f59e0b', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                  Experiencia Ágil
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  Interfaz moderna, intuitiva y fluida que optimiza tu productividad y mejora tu flujo de trabajo.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default Home;