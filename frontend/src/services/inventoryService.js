import api from './api';

export const inventoryService = {
  getStockMovements: async (params = {}) => {
    const response = await api.get('/inventory/movements', { params });
    return response.data;
  },

  createStockMovement: async (movementData) => {
    const response = await api.post('/inventory/movements', movementData);
    return response.data;
  },
};
