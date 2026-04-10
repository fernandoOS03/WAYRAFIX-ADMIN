const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const socketConfig = require('./src/config/socket');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/r_auth');
const asistenciasRoutes = require('./src/routes/r_asistencias');
const clientesRoutes = require('./src/routes/r_clientes');
const gruasRoutes = require('./src/routes/r_gruas');

app.use('/api/auth', authRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/gruas', gruasRoutes);

// Server start
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Inicializar Socket.IO
socketConfig.init(server);

server.listen(PORT, () => {
    console.log(`WayraFix corriendo en el puerto: ${PORT}`);
});
