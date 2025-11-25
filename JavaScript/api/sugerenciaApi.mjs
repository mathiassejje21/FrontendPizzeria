import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/sugerencia`;

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const getSuggestion = async () => {
  const res = await API.get('/');
  return res.data;
};
