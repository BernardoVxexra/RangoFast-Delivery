import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '../api/auth';
import {
  Order,
  OrderError,
  acceptOrder,
  cancelOrder,
  completeOrder,
  getOrderByCode,
} from '../data/ordersRepository';

type ActionResult = { ok: boolean; message: string };

function errorMessage(err: unknown): string {
  return err instanceof OrderError ? err.message : 'Não foi possível acessar os dados do pedido.';
}

export function useOrder(code: string | undefined, user: AuthUser | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!code) {
      setOrder(null);
      setIsLoading(false);
      return;
    }
    try {
      setOrder(await getOrderByCode(code));
      setError(null);
    } catch (err) {
      setOrder(null);
      setError(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    if (!code) {
      setOrder(null);
      setIsLoading(false);
      return;
    }
    let active = true;
    getOrderByCode(code)
      .then((data) => { if (active) { setOrder(data); setError(null); } })
      .catch((err) => { if (active) { setOrder(null); setError(errorMessage(err)); } })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [code]);

  async function runAction(action: () => Promise<Order>, successMessage: string): Promise<ActionResult> {
    setIsSaving(true);
    try {
      setOrder(await action());
      return { ok: true, message: successMessage };
    } catch (err) {
      await reload();
      return { ok: false, message: errorMessage(err) };
    } finally {
      setIsSaving(false);
    }
  }

  const accept = () => {
    if (!user || !code) return Promise.resolve({ ok: false, message: 'Faça login novamente.' });
    return runAction(() => acceptOrder(code, user.username), 'Pedido aceito! Boa entrega.');
  };

  const cancel = () => {
    if (!user || !code) return Promise.resolve({ ok: false, message: 'Faça login novamente.' });
    return runAction(() => cancelOrder(code, user.username), 'Entrega cancelada.');
  };

  const complete = () => {
    if (!user || !code) return Promise.resolve({ ok: false, message: 'Faça login novamente.' });
    return runAction(() => completeOrder(code, user.username), 'Entrega concluída com sucesso!');
  };

  const isMine = !!user && !!order && order.assignedTo?.username === user.username;

  return { order, isLoading, isSaving, isMine, error, accept, cancel, complete, reload };
}
