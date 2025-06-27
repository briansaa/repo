import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Usuario from './components/usuarios/Usuario';
import HistorialIA from './components/historial_ia/HistorialIA';

import Tareas from './components/tareas/Tareas';
import AgregarTarea from './components/tareas/AgregarTarea';
import EditarTarea from './components/tareas/EditarTarea';
import EliminarTarea from './components/tareas/EliminarTarea';

import Login from './components/admin/Login';
import RegisterSuperUser from './components/admin/RegisterSuperUser';
import PrivateRoute from './components/admin/PrivateRoute';
import PublicRoute from './components/admin/PublicRoute';
import ProtectedRoute from './components/admin/ProtectedRoute';

import NavBar from './components/NavBar';

import AgregarUsuario from './components/usuarios/AgregarUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import EliminarUsuario from './components/usuarios/EliminarUsuario';
import EliminarHistorialIA from './components/historial_ia/EliminarHistorialIA';

function App() {
  const drawerWidth = 240;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterSuperUser /></PublicRoute>} />

        {/* Rutas privadas */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <NavBar drawerWidth={drawerWidth}>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="usuarios" element={<Usuario />} />
                  <Route path="historiales" element={<HistorialIA />} />
                  <Route path="tareas" element={<Tareas />} />

                  {/* Usuario */}
                  <Route path="agregar-usuario" element={<AgregarUsuario />} />
                  <Route path="editar-usuario/:id" element={<EditarUsuario />} />
                  <Route path="eliminar-usuario/:id" element={<EliminarUsuario />} />

                  {/* Tareas */}
                  <Route path="agregar-tarea" element={<AgregarTarea />} />
                  <Route path="editar-tarea/:id" element={<EditarTarea />} />
                  <Route path="eliminar-tarea/:id" element={<EliminarTarea />} />

                  {/* Historial IA */}
                  <Route path="eliminar-historial/:id" element={<EliminarHistorialIA />} />
                </Routes>
              </NavBar>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
