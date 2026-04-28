require('dotenv').config();
const http = require('http');
const express = require('express');
const socketConfig = require('../src/config/socket');
const asistenciasListener = require('../src/services/s_asistenciasListener');

const app = express();
const server = http.createServer(app);

try {
    console.log("Iniciando prueba de inicialización...");
    socketConfig.init(server);
    asistenciasListener.startListener();
    console.log("✅ Inicialización exitosa (Listener iniciado)");
    process.exit(0);
} catch (error) {
    console.error("❌ Fallo en la inicialización:", error);
    process.exit(1);
}
