import axios from 'axios';

// Remove custom ImportMetaEnv and ImportMeta interfaces, Vite provides types automatically.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor de Requisição (Adiciona o token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- NOVO INTERCEPTOR DE RESPOSTA (Trata 401) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for um erro de autorização (401), limpa o token e redireciona
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Usamos window.location para redirecionar pois estamos fora do contexto de um componente React.
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  },
);
// ---------------------------------------------------

export default api;