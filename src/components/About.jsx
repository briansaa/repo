import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Container, Paper } from '@mui/material';

const teamMembers = [
  {
    name: 'Daniel Quispe',
    role: 'FullStack Developer',
    image: '/src/images/daniel.jpg',
    description: 'Desarrollador FullStack, responsable de la integración de IA generativa y la plataforma web.',
  },
  {
    name: 'Rafael Arce',
    role: 'Diseñador UX/UI',
    image: '/src/images/rafael.jpg',
    description: 'Diseñador UX/UI, asegura que la experiencia del usuario en nuestra plataforma sea intuitiva y funcional.',
  },
];

const About = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 4, backgroundColor: '#0f1419', color: '#e2e8f0', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Introducción */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
            Sobre Nosotros
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}>
            En Selta, nuestra misión es ofrecer una plataforma de diseño personalizada mediante inteligencia artificial. 
            Permitiendo a nuestros usuarios crear productos únicos como polos, tazas, y más, con un simple clic. 
            Nuestra visión es democratizar la personalización y facilitar la creación de productos exclusivos de forma accesible para todos.
          </Typography>
        </Box>

        {/* Misión y Visión */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 4,
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                Nuestra Misión
              </Typography>
              <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                Democratizar el acceso al diseño personalizado con IA, permitiendo a cualquiera crear y recibir productos únicos en pocos pasos.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 4,
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#10b981', fontWeight: 'bold' }}>
                Nuestra Visión
              </Typography>
              <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                Ser la plataforma líder en Latinoamérica para la personalización de productos con IA, destacando la innovación y la creatividad individual.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Equipo */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 3 }}>
            Nuestro Equipo
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  borderRadius: '16px',
                  color: '#e2e8f0',
                  maxWidth: '320px',
                  mx: 'auto'
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={member.image}
                    alt={member.name}
                    sx={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
