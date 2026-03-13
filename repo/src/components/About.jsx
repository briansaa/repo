import React from 'react';
import { Box, Typography, Grid, CardMedia, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { GlassBox } from './common/NexusUI';

const teamMembers = [
  {
    name: 'Daniel Quispe',
    role: 'FullStack Developer',
    image: '/src/images/aeterna/daniel.png',
    description: 'Desarrollador FullStack, responsable de la integración de IA generativa y la plataforma web.',
  },
  {
    name: 'Rafael Arce',
    role: 'Diseñador UX/UI',
    image: '/src/images/aeterna/rafael.png',
    description: 'Diseñador UX/UI, asegura que la experiencia del usuario en nuestra plataforma sea intuitiva y funcional.',
  },
];

const About = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 4, backgroundColor: 'var(--background)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Introducción */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 950, letterSpacing: '4px', mb: 3 }}>
              SOBRE_ <span style={{ color: 'var(--primary)', textShadow: 'var(--neon-glow)' }}>NEXUS AI</span>
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '800px', mx: 'auto', fontWeight: 500, fontSize: '1.1rem' }}>
              En <strong>NEXUS AI</strong>, estamos redefiniendo la frontera entre la imaginación humana y la síntesis digital. 
              Nuestra plataforma ofrece un ecosistema de generación avanzada donde la creatividad no tiene límites.
            </Typography>
          </motion.div>
        </Box>

        {/* Misión y Visión */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassBox sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase' }}>
                Nuestra Misión
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                Expandir la capacidad creativa humana mediante herramientas de IA accesibles y potentes, 
                convirtiéndonos en el puente entre la idea y la realidad visual instantánea.
              </Typography>
            </GlassBox>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassBox sx={{ p: 4, border: '1px solid var(--secondary)', height: '100%' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase' }}>
                Nuestra Visión
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                Liderar la revolución de la síntesis digital en Latinoamérica, estableciendo a NEXUS AI como el estándar 
                de oro en interfaces generativas y diseño asistido por inteligencia artificial.
              </Typography>
            </GlassBox>
          </Grid>
        </Grid>

        {/* Equipo */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'var(--text-primary)', fontWeight: 900, mb: 6 }}>
            NÚCLEO_OPERATIVO
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 5 }} key={index}>
                <motion.div whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <GlassBox sx={{ p: 0, overflow: 'hidden', borderRadius: '24px' }}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={member.image}
                      alt={member.name}
                      sx={{ objectFit: 'cover', filter: 'grayscale(0.5)' }}
                    />
                    <Box sx={{ p: 4, textAlign: 'left' }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 900, letterSpacing: 2, display: 'block', mb: 2 }}>
                        {member.role.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                        {member.description}
                      </Typography>
                    </Box>
                  </GlassBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
