const express = require('express');
const router = express.Router();
// const checkAuth = require('../middlewares/authMiddleware');
const gruasCtrl = require('../controllers/c_gruas');

// router.use(checkAuth);

// Crear grúa nueva
router.post('/', gruasCtrl.crearGrua);

// Ver grúas disponibles (real-time view api call)
router.get('/availables', gruasCtrl.listarDisponibles);

// Asignar grúa a solicitud
router.post('/solicitudes/:id/assign', gruasCtrl.asignarGrua);

// Rechazar solicitud de la bandeja
router.post('/solicitudes/:id/reject', gruasCtrl.rechazarSolicitud);

module.exports = router;
