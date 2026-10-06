import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleLogin() {
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao entrar.');
    }
  }

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Acesso do entregador</p>
      </header>

      <div className="screen__body">
        <div className="hero">
          <h1 className="hero__title">Aceite. Entregue. Comprove.</h1>
          <p className="hero__subtitle">
            Do pedido disponível até a foto de confirmação — sua rota inteira em um só lugar.
          </p>
        </div>

        <div className="login-form">
          <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

          <Button label="Entrar" onClick={handleLogin} loading={isLoading} />

          <hr className="route-divider" />

          <Link className="link" to="/register">
            Criar conta
          </Link>
        </div>

        <FeedbackModal
          visible={feedback !== null}
          message={feedback ?? ''}
          onClose={() => setFeedback(null)}
        />
      </div>
    </div>
  );
}
