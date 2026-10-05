import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { useMyActiveOrder } from '../hooks/useMyActiveOrder';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { isValidOrderCode } from '../utils/validators';
import { normalizeCode } from '../data/ordersRepository';

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { coords, error, isLoading, requestLocation } = useLocation();
  const { order: activeOrder, isLoading: isLoadingOrder } = useMyActiveOrder(user);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleSearch() {
    if (!isValidOrderCode(code)) {
      setFeedback('Código inválido. Use o formato RF-000.');
      return;
    }
    navigate(`/pedido/${normalizeCode(code)}`);
  }

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Olá, {user?.username}</p>
      </header>

      <div className="screen__body">
        <span className="status-chip">Disponível para entregas</span>

        <h2 className="screen__title">Minha entrega atual</h2>
        {isLoadingOrder ? (
          <p className="muted-text">Carregando...</p>
        ) : activeOrder ? (
          <div className="telemetry-card">
            <p className="telemetry-card__label">{activeOrder.code}</p>
            <p className="telemetry-card__value">{activeOrder.restaurantName}</p>
            <Button
              label="Ver pedido"
              variant="secondary"
              onClick={() => navigate(`/pedido/${activeOrder.code}`)}
            />
          </div>
        ) : (
          <p className="muted-text">Você não está entregando nenhum pedido no momento.</p>
        )}

        <hr className="route-divider" />

        <h2 className="screen__title">Buscar pedido</h2>
        <Input
          label="Código do pedido"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="RF-001"
        />
        <Button label="Buscar" onClick={handleSearch} variant="secondary" />

        <hr className="route-divider" />

        <h2 className="screen__title">Localização atual</h2>
        {coords ? (
          <div className="telemetry-card">
            <p className="telemetry-card__label">Coordenadas</p>
            <p className="telemetry-card__value">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <p className="muted-text">Localização ainda não obtida.</p>
        )}
        <Button
          label="Obter localização atual"
          onClick={requestLocation}
          loading={isLoading}
          variant="secondary"
        />

        <hr className="route-divider" />

        <Button label="Registrar comprovante de entrega" onClick={() => navigate('/camera')} />
        <Button label="Histórico de entregas" onClick={() => navigate('/historico')} variant="secondary" />
        <Button label="Perfil" onClick={() => navigate('/perfil')} variant="secondary" />
        <Button label="Sair" onClick={handleLogout} variant="link" />

        <FeedbackModal visible={feedback !== null} message={feedback ?? ''} onClose={() => setFeedback(null)} />
      </div>
    </div>
  );
}
