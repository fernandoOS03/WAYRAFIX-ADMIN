const gruasService = require('../services/s_gruas');

const crearGrua = async (req, res) => {
    try {
        const gruaData = req.body;
        const newDocId = await gruasService.create(gruaData);
        res.status(201).json({ message: "Grúa creada con éxito", id: newDocId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listarDisponibles = async (req, res) => {
    try {
        const data = await gruasService.getAvailables();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const asignarGrua = async (req, res) => {
    try {
        const solicitudId = req.params.id;
        const { gruaId } = req.body; // Se espera el ID de la grúa seleccionada
        
        if (!gruaId) {
            return res.status(400).json({ message: "El gruaId es requerido" });
        }

        const result = await gruasService.assignSolicitud(solicitudId, gruaId);
        res.json({ message: "Grúa asignada y notificada", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rechazarSolicitud = async (req, res) => {
    try {
        const solicitudId = req.params.id;
        // Asume que la solicitud pasa a estado 'Rechazada'
        await gruasService.rejectSolicitud(solicitudId);
        res.json({ message: "Solicitud rechazada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    crearGrua,
    listarDisponibles,
    asignarGrua,
    rechazarSolicitud
};
