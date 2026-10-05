import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '../api/auth';
import type { Order } from '../data/ordersRepository';
import { getMyActiveOrder } from '../data/ordersRepository';

export function useMyActiveOrder(user: AuthUser | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(() => {
    if (!user) {
      setOrder(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getMyActiveOrder(user.username)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { order, isLoading, reload };
}
