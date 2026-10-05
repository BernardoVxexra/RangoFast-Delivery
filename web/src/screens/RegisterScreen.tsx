import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleRegister() {
    try {
      await register(username, password, email, cep);
      navigate('/dashboard');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    }
  }

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Criar conta de entregador</p>
      </header>

      <div className="screen__body screen__body--center">
        <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button label="Cadastrar" onClick={handleRegister} loading={isLoading} />

        <hr className="route-divider" />

        <Link className="link" to="/login">
          Voltar
        </Link>

        <FeedbackModal
          visible={feedback !== null}
          message={feedback ?? ''}
          onClose={() => setFeedback(null)}
        />
      </div>
    </div>
  );
}
