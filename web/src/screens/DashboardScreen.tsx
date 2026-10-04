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
      <h1>Olá, {user?.username}</h1>

      <Button label="Obter localização atual" onClick={requestLocation} loading={isLoading} />
      {coords && (
        <p>
          Lat: {coords.latitude.toFixed(5)} · Lng: {coords.longitude.toFixed(5)}
        </p>
      )}
      {error && <p className="error-text">{error}</p>}

      <Button label="Registrar comprovante de entrega" onClick={() => navigate('/camera')} />
      <Button label="Sair" onClick={handleLogout} variant="secondary" />
    </div>
  );
}
