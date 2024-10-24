import axios from 'axios';
import { getEnv } from '../helpers/getEnv';

const { VITE_API_URL } = getEnv()

const calendarApi = axios.create({
  baseURL: VITE_API_URL,
})

// TODO: configurar interceptors
calendarApi.interceptors.request.use( config => {
  
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return config;
})

export default calendarApi;