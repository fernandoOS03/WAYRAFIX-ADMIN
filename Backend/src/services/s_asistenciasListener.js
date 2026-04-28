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
                    const asistencia = { id: change.doc.id, ...change.doc.data() };
                    console.log(`[Listener] Nueva asistencia detectada: ${asistencia.ticket}`);
                    
                    try {
                        const io = socketConfig.getIO();
                        // Emitimos el evento 'newAsistencia' como se menciona en el resumen
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
