const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Proporcione email y contraseña.' });
        }

        // Buscar el admin en firestore
        const usersRef = db.collection('admins');
        const q = usersRef.where('email', '==', email).limit(1);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Validar contraseña
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: userDoc.id, email: userData.email, role: 'admin' }, 
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                id: userDoc.id,
                email: userData.email,
                name: userData.name
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Proporcione nombre, email y contraseña.' });
        }

        // Check ya existe
        const usersRef = db.collection('admins');
        const q = usersRef.where('email', '==', email).limit(1);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const docRef = await db.collection('admins').add(newAdmin);

        res.status(201).json({ 
            message: 'Admin creado correctamente', 
            id: docRef.id 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

module.exports = {
    login,
    register
};
