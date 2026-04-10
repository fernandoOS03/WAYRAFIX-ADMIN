const express = require('express');
const router = express.Router();
const authController = require('../controllers/c_auth');

// Auth: Login
router.post('/login', authController.login);
// Auth: Create User (Admin Only for setting up users)
router.post('/register', authController.register);

module.exports = router;
