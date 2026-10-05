import { useAuthContext } from '../contexts/AuthContext';
import { isValidEmail, isValidCEP, isStrongPassword, isRequired } from '../utils/validators';

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, register, logout } = useAuthContext();

  function validateLogin(username: string, password: string): string | null {
    if (!isRequired(username) || !isRequired(password)) return 'Preencha usuário e senha.';
    return null;
  }

  function validateRegister(
    username: string,
    password: string,
    email: string,
    cep: string
  ): string | null {
    if (!isRequired(username)) return 'Informe um usuário.';
    if (!isValidEmail(email)) return 'E-mail inválido.';
    if (!isValidCEP(cep)) return 'CEP inválido.';
    if (!isStrongPassword(password)) return 'Senha deve ter ao menos 6 caracteres.';
    return null;
  }

  // Validação roda antes de qualquer chamada de rede: evita requisição
  // desnecessária e garante que o servidor nunca recebe entrada malformada.
  async function loginWithValidation(username: string, password: string) {
    const validationError = validateLogin(username, password);
    if (validationError) throw new Error(validationError);
    await login({ username, password });
  }

  async function registerWithValidation(
    username: string,
    password: string,
    email: string,
    cep: string
  ) {
    const validationError = validateRegister(username, password, email, cep);
    if (validationError) throw new Error(validationError);
    await register({ username, password, email, cep });
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginWithValidation,
    register: registerWithValidation,
    logout,
  };
}
