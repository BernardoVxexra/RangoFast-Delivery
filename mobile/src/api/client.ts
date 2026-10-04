import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// No React Native, o cookie de sessão é armazenado e reenviado automaticamente
// pela camada nativa de rede (OkHttp no Android, NSURLSession no iOS) durante
// o tempo de vida do app — não existe "withCredentials" equivalente aqui
// porque esse conceito é específico do modelo de segurança de navegadores.
export const apiClient = axios.create({
  baseURL: BASE_URL,
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
