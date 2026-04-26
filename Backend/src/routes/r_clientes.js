const express = require('express');
const router = express.Router();
// const checkAuth = require('../middlewares/authMiddleware');
const clientesCtrl = require('../controllers/c_clientes');

// router.use(checkAuth);

// Listar clientes
router.get('/', clientesCtrl.listarClientes);

// Listar clientes con sus vehículos agregados
router.get('/aggregated', clientesCtrl.listarClientesAgregados);

// Cambiar estado is_active
router.patch('/:id/active', clientesCtrl.cambiarEstado);

// Detalle del cliente
router.get('/:id', clientesCtrl.detalleCliente);

module.exports = router;
