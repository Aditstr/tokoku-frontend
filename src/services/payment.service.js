import api from './api';

export async function createInvoice(orderId) {
  const res = await api.post(`/payments/orders/${orderId}/invoice`);
  return res.data;
}