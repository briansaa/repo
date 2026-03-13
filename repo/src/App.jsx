import './App.css';
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Core Components
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import AIStudio from './components/AIStudio';
import NetworkMonitor from './components/admin/NetworkMonitor';
import LandingPage from './components/LandingPage';

// User Management Components
import Usuario from './components/usuarios/Usuario';
import AgregarUsuario from './components/usuarios/AgregarUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';

// AI History Components
import HistorialIA from './components/historial_ia/HistorialIA';

// Admin/Auth Components
import Login from './components/admin/Login';
import RegisterSuperUser from './components/admin/RegisterSuperUser';
import UserProfile from './components/admin/UserProfile';
import NexusAccessGuard from './components/admin/NexusAccessGuard';
import NexusDeleteTerminal from './components/common/NexusDeleteTerminal';

// --- Shared Layout Component ---
const AppLayout = ({ children }) => (
  <NavBar drawerWidth={240}>
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </NavBar>
);

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/')[1]}>
          <Route path="/" element={<LandingPage />} />

          {/* Rutas para Invitados (No Autenticados) */}
          <Route path="/login" element={
            <NexusAccessGuard mode="guest"><Login /></NexusAccessGuard>
          } />
          <Route path="/register" element={
            <NexusAccessGuard mode="guest"><RegisterSuperUser /></NexusAccessGuard>
          } />

          {/* Ecosistema NX (Autenticado) */}
          <Route
            path="/*"
            element={
              <NexusAccessGuard mode="authenticated">
                <AppLayout>
                  <Routes>
                    {/* Admin Specific */}
                    <Route path="home" element={<NexusAccessGuard mode="admin"><Home /></NexusAccessGuard>} />
                    <Route path="network-monitor" element={<NexusAccessGuard mode="admin"><NetworkMonitor /></NexusAccessGuard>} />
                    
                    {/* User Management */}
                    <Route path="usuarios" element={<NexusAccessGuard mode="admin"><Usuario /></NexusAccessGuard>} />
                    <Route path="agregar-usuario" element={<NexusAccessGuard mode="admin"><AgregarUsuario /></NexusAccessGuard>} />
                    <Route path="editar-usuario/:id" element={<NexusAccessGuard mode="admin"><EditarUsuario /></NexusAccessGuard>} />
                    <Route path="eliminar-usuario/:id" element={
                      <NexusAccessGuard mode="admin">
                        <NexusDeleteTerminal 
                          apiEndpoint="usuarios"
                          successRedirect="/usuarios"
                          title="ELIMINAR_OPERADOR"
                          getMessage={(user) => `¿Estás seguro de que deseas revocar permanentemente los privilegios de acceso del operador "${user.nombre_usuario}"?`}
                        />
                      </NexusAccessGuard>
                    } />

                    {/* Shared Apps */}
                    <Route path="studio" element={<AIStudio />} />
                    <Route path="about" element={<About />} />
                    <Route path="historiales" element={<HistorialIA />} />
                    <Route path="perfil" element={<UserProfile />} />

                    {/* Historial IA Deletion */}
                    <Route path="eliminar-historial/:id" element={
                      <NexusDeleteTerminal 
                        apiEndpoint="historiales"
                        successRedirect="/historiales"
                        title="DESINTEGRAR_ARTEFACTO"
                        getMessage={(item) => `¿Confirmas la desintegración permanente del artefacto visual ID: ${item.id_historial}?`}
                      />
                    } />
                  </Routes>
                </AppLayout>
              </NexusAccessGuard>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
