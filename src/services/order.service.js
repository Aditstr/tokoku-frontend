import api from './api';

export async function createOrder(items) {
  const res = await api.post('/orders', { items });
  return res.data;
}

export async function getMyOrders() {
  const res = await api.get('/orders/my-orders');
  return res.data;
}

export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

// ─── Seller functions ─────────────────────────────────────────

export async function getSellerOrders() {
  const res = await api.get('/orders/seller/incoming');
  return res.data;
}

export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/orders/seller/${orderId}/status`, { status });
  return res.data;
}