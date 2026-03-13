// src/services/superUserService.jsx

import axios from 'axios';

const API_URL = 'http://localhost:8000/';

const login = async (correo, password) => {
  try {
    const response = await axios.post(`${API_URL}token/`, {
      correo,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error de autenticación: ' + (error.response?.data?.detail || error.message));
  }
};

const createSuperUser = (correo, nombre_usuario, password, token) => {
  return axios.post(`${API_URL}create_super_user/`, {
    correo,
    nombre_usuario,
    password,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const superUserService = {
  login,
  createSuperUser,
};

export default superUserService;
