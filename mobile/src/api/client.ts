import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// cookie de sessão é armazenado e reenviado automaticamente
// pela camada nativa de rede (OkHttp no Android, NSURLSession no iOS) 
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Erros nunca chegam à Ui com o payload bruto do servidor.
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
