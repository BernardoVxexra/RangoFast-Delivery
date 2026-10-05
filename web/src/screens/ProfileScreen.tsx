import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDeliveredByUser } from '../data/ordersRepository';
import { Button } from '../components/Button';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getDeliveredByUser(user.username).then((orders) => setDeliveredCount(orders.length));
  }, [user]);

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
        <p className="app-header__subtitle">Perfil</p>
      </header>

      <div className="screen__body">
        <div className="order-card">
          <p className="order-card__label">Usuário</p>
          <p className="order-card__value">{user?.username}</p>
        </div>

        <div className="order-card">
          <p className="order-card__label">Entregas concluídas</p>
          <p className="order-card__value">{deliveredCount}</p>
        </div>

        <hr className="route-divider" />
        <Button label="Sair" onClick={handleLogout} variant="secondary" />
        <Button label="Voltar" onClick={() => navigate(-1)} variant="link" />
      </div>
    </div>
  );
}
