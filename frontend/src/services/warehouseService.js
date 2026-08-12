import api from './api';

export const warehouseService = {
  getWarehouses: async (params = {}) => {
    const response = await api.get('/warehouses', { params });
    return response.data;
  },

  getWarehouseById: async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },

  createWarehouse: async (warehouseData) => {
    const response = await api.post('/warehouses', warehouseData);
    return response.data;
  },

  updateWarehouse: async (id, warehouseData) => {
    const response = await api.put(`/warehouses/${id}`, warehouseData);
    return response.data;
  },

  deleteWarehouse: async (id) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },
};
