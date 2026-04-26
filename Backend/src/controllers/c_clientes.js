const clientesService = require('../services/s_clientes');

const listarClientes = async (req, res) => {
    try {
        const data = await clientesService.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const detalleCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clientesService.getById(id);
        
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listarClientesAgregados = async (req, res) => {
    try {
        const data = await clientesService.getAggregatedData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const result = await clientesService.toggleActive(id, is_active);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listarClientes,
    detalleCliente,
    listarClientesAgregados,
    cambiarEstado
};
