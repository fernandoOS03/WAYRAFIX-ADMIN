const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/authMiddleware');
const asistenciasCtrl = require('../controllers/c_asistencias');

// router.use(checkAuth); // Podríamos activarlo descomentando esta línea

// Listar historial de asistencias
router.get('/', asistenciasCtrl.listarHistorial);

// Búsqueda global exacta
router.get('/search', asistenciasCtrl.buscarGlobal);

// Filtros avanzados
router.get('/filter', asistenciasCtrl.filtrarAsistencias);

// Exportar a PDF
router.get('/:id/export', asistenciasCtrl.exportarPDF);

// Enviar recibo
router.post('/:id/send-receipt', asistenciasCtrl.enviarRecibo);

// SOS Alerta
router.post('/sos', asistenciasCtrl.crearAlertaSOS);

// Rechazar solicitud
router.post('/:id/reject', asistenciasCtrl.rechazarSolicitud);

// Actualizar estado (pendiente, en_camino, finalizado, rechazado)
router.patch('/:id/status', asistenciasCtrl.actualizarEstado);

module.exports = router;
