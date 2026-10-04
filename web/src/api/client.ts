import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// No navegador, withCredentials: true é suficiente: o próprio browser
// armazena e reenvia o cookie de sessão nas próximas requisições.
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Erros nunca chegam à UI com o payload bruto do servidor.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      status === 401 || status === 400
        ? 'Usuário ou senha inválidos.'
        : 'Não foi possível completar a operação. Tente novamente.';
    return Promise.reject(new Error(message));
  }
);
