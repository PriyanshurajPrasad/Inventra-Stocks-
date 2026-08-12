import api from './api';

export const challanService = {
  getChallans: async (params = {}) => {
    const response = await api.get('/challans', { params });
    return response.data;
  },

  getChallanById: async (id) => {
    const response = await api.get(`/challans/${id}`);
    return response.data;
  },

  createChallan: async (challanData) => {
    const response = await api.post('/challans', challanData);
    return response.data;
  },

  updateChallan: async (id, challanData) => {
    const response = await api.put(`/challans/${id}`, challanData);
    return response.data;
  },

  confirmChallan: async (id) => {
    const response = await api.post(`/challans/${id}/confirm`);
    return response.data;
  },

  cancelChallan: async (id) => {
    const response = await api.post(`/challans/${id}/cancel`);
    return response.data;
  },

  deleteChallan: async (id) => {
    const response = await api.delete(`/challans/${id}`);
    return response.data;
  },
};
