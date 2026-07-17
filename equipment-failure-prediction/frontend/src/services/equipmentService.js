import api from './api';

export const equipmentService = {
  getAll: async () => {
    const response = await api.get('/equipment');
    return response.data; // ApiResponse<List<EquipmentResponse>>
  },

  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data; // ApiResponse<EquipmentResponse>
  },

  create: async (data) => {
    const response = await api.post('/equipment', data);
    return response.data; // ApiResponse<EquipmentResponse>
  },

  update: async (id, data) => {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data; // ApiResponse<EquipmentResponse>
  },

  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data; // ApiResponse<String>
  },
};

export default equipmentService;
