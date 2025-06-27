// src/services/authService.js
import AxiosInstance from "../components/Axios";





const login = async (correo, password) => {
  const res = await AxiosInstance.post("token/", { correo, password });
  const { access, refresh, rol, nombre_usuario } = res.data;

  const user = {
    access,
    refresh,
    correo,
    rol: typeof rol === 'object' ? rol.rol : rol,
    nombre_usuario,
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const fetchUserData = async () => {
  const res = await AxiosInstance.get("me/");
  const data = res.data;
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const updated = { ...user, ...data };
  localStorage.setItem("user", JSON.stringify(updated));
  return updated;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  fetchUserData
};

export default authService;
