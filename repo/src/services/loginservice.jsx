// src/services/loginService.jsx

import { Password } from '@mui/icons-material';
import axios from 'axios';

const baseURL = 'http://localhost:8000';

const loginService = {
  login: async (correo, password) => {
    const response = await axios.post(`${baseURL}/token/`, { correo, password });
    return response;
  },
};

export default loginService;
