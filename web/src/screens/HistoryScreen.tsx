import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDeliveredByUser } from '../data/ordersRepository';
import type { Order } from '../data/ordersRepository';
import { Button } from '../components/Button';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDeliveredByUser(user.username).then(setOrders).finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Histórico de entregas</p>
      </header>

      <div className="screen__body">
        {isLoading ? (
          <p className="muted-text">Carregando...</p>
        ) : orders.length === 0 ? (
          <p className="muted-text">Nenhuma entrega concluída ainda.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.code}>
              <p className="order-card__value">{order.code} · {order.restaurantName}</p>
              <p className="muted-text">
                {formatCurrency(order.value)} · {formatDateTime(order.deliveredAt!)}
              </p>
            </div>
          ))
        )}

        <hr className="route-divider" />
        <Button label="Voltar" onClick={() => navigate(-1)} variant="link" />
      </div>
    </div>
  );
}
