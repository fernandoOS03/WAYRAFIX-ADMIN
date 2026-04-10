const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No se encontró el token de autenticación. Acceso denegado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // Guardamos los datos del usuario en request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.', error: error.message });
    }
};

module.exports = authMiddleware;
