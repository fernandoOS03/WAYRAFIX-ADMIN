const express = require('express');
const router = express.Router();
// const checkAuth = require('../middlewares/authMiddleware');
const clientesCtrl = require('../controllers/c_clientes');

// router.use(checkAuth);

// Listar clientes
router.get('/', clientesCtrl.listarClientes);

// Detalle del cliente
router.get('/:id', clientesCtrl.detalleCliente);

module.exports = router;
