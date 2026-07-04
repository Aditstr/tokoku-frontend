import api from './api';

export const getDashboard    = ()            => api.get('/admin/dashboard');
export const getAdminUsers   = (params)      => api.get('/admin/users', { params });
export const updateUserRole  = (id, role)    => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser      = (id)          => api.delete(`/admin/users/${id}`);
export const getAdminProducts = (params)     => api.get('/admin/products', { params });
export const toggleProduct   = (id)          => api.patch(`/admin/products/${id}/toggle`);
export const getAdminCategories = ()         => api.get('/admin/categories');
export const createCategory  = (data)        => api.post('/admin/categories', data);
export const updateCategory  = (id, data)    => api.put(`/admin/categories/${id}`, data);
export const deleteCategory  = (id)          => api.delete(`/admin/categories/${id}`);
export const getAdminOrders  = (params)      => api.get('/admin/orders', { params });