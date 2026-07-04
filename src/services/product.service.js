import api from './api';

export async function getProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

// ─── Seller functions ─────────────────────────────────────────

export async function getMyProducts() {
  const res = await api.get('/products/seller/my-products');
  return res.data;
}

export async function createProduct(data) {
  const res = await api.post('/products', data);
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}