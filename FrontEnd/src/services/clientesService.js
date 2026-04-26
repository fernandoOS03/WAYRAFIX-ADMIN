import api from '../api';

const clientesService = {
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  toggleActive: async (id, isActive) => {
    const response = await api.patch(`/clientes/${id}/active`, { isActive });
    return response.data;
  }
};

export default clientesService;
