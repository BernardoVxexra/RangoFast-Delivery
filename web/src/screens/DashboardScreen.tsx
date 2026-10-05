import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { Button } from '../components/Button';

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { coords, error, isLoading, requestLocation } = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
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
        <Button label="Sair" onClick={handleLogout} variant="link" />
      </div>
    </div>
  );
}
