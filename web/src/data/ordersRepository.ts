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
  deliveryPhotoUri: string | null;
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

function loadOrders(): Order[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Order[];
  }
  const orders = seedOrders();
  saveOrders(orders);
  return orders;
}

function saveOrders(orders: Order[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function findOrFail(orders: Order[], code: string): Order {
  const order = orders.find((o) => o.code === normalizeCode(code));
  if (!order) {
    throw new OrderError(`Pedido ${normalizeCode(code)} não encontrado.`);
  }
  return order;
}

export async function getOrderByCode(code: string): Promise<Order> {
  return findOrFail(loadOrders(), code);
}

export async function getMyActiveOrder(username: string): Promise<Order | null> {
  return loadOrders().find((o) => o.status === 'accepted' && o.assignedTo?.username === username) ?? null;
}

export async function getDeliveredByUser(username: string): Promise<Order[]> {
  return loadOrders()
    .filter((o) => o.status === 'delivered' && o.assignedTo?.username === username)
    .sort((a, b) => (b.deliveredAt ?? '').localeCompare(a.deliveredAt ?? ''));
}

export async function acceptOrder(code: string, username: string): Promise<Order> {
  const orders = loadOrders();
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
  saveOrders(orders);
  return order;
}

export async function cancelOrder(code: string, username: string): Promise<Order> {
  const orders = loadOrders();
  const order = findOrFail(orders, code);

  if (order.assignedTo?.username !== username) {
    throw new OrderError('Só quem aceitou o pedido pode cancelar.');
  }

  order.status = 'available';
  order.assignedTo = null;
  saveOrders(orders);
  return order;
}

export async function completeOrder(
  code: string,
  username: string,
  deliveryPhotoUri: string | null = null
): Promise<Order> {
  const orders = loadOrders();
  const order = findOrFail(orders, code);

  if (order.assignedTo?.username !== username) {
    throw new OrderError('Só quem aceitou o pedido pode concluir a entrega.');
  }

  order.status = 'delivered';
  order.deliveredAt = new Date().toISOString();
  order.deliveryPhotoUri = deliveryPhotoUri;
  saveOrders(orders);
  return order;
}
