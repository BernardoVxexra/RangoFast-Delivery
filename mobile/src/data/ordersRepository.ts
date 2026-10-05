import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersSeed } from './ordersSeed';

export type OrderStatus = 'available' | 'accepted' | 'delivered';

export interface Order {
  code: string;
  restaurantName: string;
  customerName: string;
  customerAddress: string;
  items: string;
  value: number;
  status: OrderStatus;
  assignedTo: { username: string } | null;
  deliveredAt: string | null;
}

const STORAGE_KEY = '@RangoFast:orders';

export const ORDER_CODE_PATTERN = /^RF-\d{3}$/;

export class OrderError extends Error {}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function seedOrders(): Order[] {
  return ordersSeed.map((order) => ({ ...order }));
}

async function loadOrders(): Promise<Order[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Order[];
  }
  const orders = seedOrders();
  await saveOrders(orders);
  return orders;
}

async function saveOrders(orders: Order[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function findOrFail(orders: Order[], code: string): Order {
  const order = orders.find((o) => o.code === normalizeCode(code));
  if (!order) {
    throw new OrderError(`Pedido ${normalizeCode(code)} não encontrado.`);
  }
  return order;
}

export const getOrderByCode = async (code: string): Promise<Order> => {
  const orders = await loadOrders();
  return findOrFail(orders, code);
};

export const getMyActiveOrder = async (username: string): Promise<Order | null> => {
  const orders = await loadOrders();
  return orders.find((o) => o.status === 'accepted' && o.assignedTo?.username === username) ?? null;
};

export const getDeliveredByUser = async (username: string): Promise<Order[]> => {
  const orders = await loadOrders();
  return orders
    .filter((o) => o.status === 'delivered' && o.assignedTo?.username === username)
    .sort((a, b) => (b.deliveredAt ?? '').localeCompare(a.deliveredAt ?? ''));
};

export const acceptOrder = async (code: string, username: string): Promise<Order> => {
  const orders = await loadOrders();
  const order = findOrFail(orders, code);

  if (order.status !== 'available') {
    throw new OrderError(`O pedido ${order.code} já está em entrega.`);
  }

  const current = orders.find((o) => o.status === 'accepted' && o.assignedTo?.username === username);
  if (current) {
    throw new OrderError(
      `Você já está entregando o pedido ${current.code}. Conclua ou cancele antes de aceitar outro.`
    );
  }

  order.status = 'accepted';
  order.assignedTo = { username };

  await saveOrders(orders);
  return order;
};

export const cancelOrder = async (code: string, username: string): Promise<Order> => {
  const orders = await loadOrders();
  const order = findOrFail(orders, code);

  if (order.assignedTo?.username !== username) {
    throw new OrderError('Só quem aceitou o pedido pode cancelar.');
  }

  order.status = 'available';
  order.assignedTo = null;

  await saveOrders(orders);
  return order;
};

export const completeOrder = async (code: string, username: string): Promise<Order> => {
  const orders = await loadOrders();
  const order = findOrFail(orders, code);

  if (order.assignedTo?.username !== username) {
    throw new OrderError('Só quem aceitou o pedido pode concluir a entrega.');
  }

  order.status = 'delivered';
  order.deliveredAt = new Date().toISOString();

  await saveOrders(orders);
  return order;
};
