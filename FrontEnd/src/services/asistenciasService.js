import api from '../api';

const asistenciasService = {
  getAll: async () => {
    const response = await api.get('/asistencias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/asistencias/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/asistencias/${id}/status`, { status });
    return response.data;
  },

  reject: async (id, motivo) => {
    const response = await api.post(`/asistencias/${id}/reject`, { motivo });
    return response.data;
  }
};

export default asistenciasService;
