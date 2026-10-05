import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function OrderDetailScreen() {
  const navigate = useNavigate();
  const { code = '' } = useParams<{ code: string }>();
  const { user } = useAuth();
  const { order, isLoading, isSaving, isMine, error, accept, cancel } = useOrder(code, user);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAction(action: () => Promise<{ ok: boolean; message: string }>) {
    const result = await action();
    setFeedback(result.message);
  }

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Detalhe do pedido</p>
      </header>

      <div className="screen__body">
        {isLoading ? (
          <p className="muted-text">Carregando...</p>
        ) : !order ? (
          <p className="error-text">{error ?? 'Pedido não encontrado.'}</p>
        ) : (
          <>
            <h2 className="screen__title">{order.code}</h2>
            <div className="order-card">
              <Info label="Restaurante" value={order.restaurantName} />
              <Info label="Cliente" value={order.customerName} />
              <Info label="Endereço" value={order.customerAddress} />
              <Info label="Itens" value={order.items} />
              <Info label="Valor" value={formatCurrency(order.value)} />
            </div>

            {order.status === 'available' && (
              <Button label="Aceitar entrega" onClick={() => handleAction(accept)} loading={isSaving} />
            )}

            {isMine && order.status === 'accepted' && (
              <>
                <Button
                  label="Concluir entrega"
                  onClick={() => navigate('/camera', { state: { orderCode: order.code } })}
                />
                <Button label="Cancelar" variant="secondary" onClick={() => handleAction(cancel)} loading={isSaving} />
              </>
            )}

            {!isMine && order.status === 'accepted' && (
              <p className="muted-text">Em entrega por {order.assignedTo?.username}.</p>
            )}

            {order.status === 'delivered' && <p className="muted-text">Entrega concluída.</p>}
          </>
        )}

        <hr className="route-divider" />
        <Button label="Voltar" onClick={() => navigate(-1)} variant="link" />

        <FeedbackModal visible={feedback !== null} message={feedback ?? ''} onClose={() => setFeedback(null)} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="order-card__row">
      <span className="order-card__label">{label}</span>
      <span className="order-card__value">{value}</span>
    </div>
  );
}
