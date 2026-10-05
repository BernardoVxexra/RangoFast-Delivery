import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { AuthUser } from '../api/auth';
import { Order, getMyActiveOrder } from '../data/ordersRepository';

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

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { order, isLoading, reload };
}
