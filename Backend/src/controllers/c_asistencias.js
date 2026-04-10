const pdfService = require('../services/s_pdf');
const asistenciasService = require('../services/s_asistencias');

const listarHistorial = async (req, res) => {
    try {
        const data = await asistenciasService.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buscarGlobal = async (req, res) => {
    try {
        const { query } = req.query; // P. ej: ?query=1234
        if (!query) {
            return res.status(400).json({ message: "Se requiere parámetro 'query'." });
        }
        const data = await asistenciasService.searchExact(query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const filtrarAsistencias = async (req, res) => {
    try {
        const { fecha, tipoSiniestro, estado } = req.query;
        const data = await asistenciasService.filterAdvanced({ fecha, tipoSiniestro, estado });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const exportarPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const asistencia = await asistenciasService.getById(id);
        
        if (!asistencia) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        // Configurar Headers para retorno de PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=recibo_${id}.pdf`);
        
        // Generar PDF al vuelo sobre el response
        pdfService.generarResumenPDF(asistencia, res);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const enviarRecibo = async (req, res) => {
    try {
        const { id } = req.params;
        const asistencia = await asistenciasService.getById(id);
        
        if (!asistencia) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        // Aquí iría la lógica de envío de correo electrónico o pasarela.
        // Simulamos un retraso
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json({ message: `Recibo de la asistencia ${asistencia.ticket} enviado exitosamente al cliente.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listarHistorial,
    buscarGlobal,
    filtrarAsistencias,
    exportarPDF,
    enviarRecibo
};
