const { Server } = require("socket.io");

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado:", socket.id);

      // El repartidor/grúa enviará su ubicación
      socket.on("updateLocation", (data) => {
        // data esperada: { solicitudeId: "123", lat: -12.0464, lng: -77.0428, gruaId: "abc" }
        console.log("Ubicación actualizada:", data);
        
        // Reenviar a la sala específica de la solicitud (para que la app iOS lo consuma)
        if (data.solicitudeId) {
          io.to(`tracking_${data.solicitudeId}`).emit("locationUpdated", data);
        }
      });

      // Cliente (iOS app) se suscribe a una sala específica de seguimiento
      socket.on("subscribeTracking", (solicitudeId) => {
        socket.join(`tracking_${solicitudeId}`);
        console.log(`Cliente suscrito a tracking_${solicitudeId}`);
      });

      // Cliente (iOS app) o grúa se desuscribe
      socket.on("unsubscribeTracking", (solicitudeId) => {
        socket.leave(`tracking_${solicitudeId}`);
        console.log(`Cliente/Grúa desuscrito de tracking_${solicitudeId}`);
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io no está inicializado.");
    }
    return io;
  }
};
