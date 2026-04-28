const { db } = require('../config/firebase');
const socketConfig = require('../config/socket');

/**
 * Escucha cambios en la colección de asistencias en tiempo real
 * y emite eventos a través de Socket.io.
 */
const startListener = () => {
    console.log('[Listener] Iniciando Firestore Listener para Asistencias...');

    db.collection('asistencias')
        .where('estado', '==', 'pendiente')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const asistencia = { 
                        id: change.doc.id, 
                        ...data,
                        // Mapeo de compatibilidad para evitar "Anónimo" en el Dashboard
                        cliente: { nombre: data.nombre_cliente || 'Jose Fernando' },
                        tipoSiniestro: data.tipo_siniestro || 'Incidente'
                    };
                    console.log(`[Listener] Nueva asistencia detectada: ${asistencia.ticket}`);
                    
                    try {
                        const io = socketConfig.getIO();
                        io.emit('newAsistencia', asistencia);
                    } catch (error) {
                        console.error('[Listener] Error emitiendo via Socket.io:', error.message);
                    }
                }
            });
        }, error => {
            console.error('[Listener] Error en Firestore Snapshot:', error);
        });
};

module.exports = { startListener };
