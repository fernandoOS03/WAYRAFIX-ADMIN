const { db } = require('../config/firebase');
const notificacionesService = require('./s_notificaciones');

const gruasCollection = 'gruas';
const asistenciasCollection = 'asistencias'; // Equivale a "solicitudes"

const create = async (data) => {
    const docRef = await db.collection(gruasCollection).add({
        ...data,
        estado: 'Disponible', // Valores: Disponible, Ocupado, Inactivo
        createdAt: new Date()
    });
    return docRef.id;
};

const getAvailables = async () => {
    const snapshot = await db.collection(gruasCollection).where('estado', '==', 'Disponible').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const assignSolicitud = async (solicitudId, gruaId) => {
    // Usamos Firestore Transaction para asegurar consistencia
    return await db.runTransaction(async (transaction) => {
        const gruaRef = db.collection(gruasCollection).doc(gruaId);
        const solicitudRef = db.collection(asistenciasCollection).doc(solicitudId);

        const gruaDoc = await transaction.get(gruaRef);
        const solicitudDoc = await transaction.get(solicitudRef);

        if (!gruaDoc.exists) throw new Error("La grúa especificada no existe.");
        if (!solicitudDoc.exists) throw new Error("La solicitud no existe.");

        if (gruaDoc.data().estado !== 'Disponible') {
            throw new Error("La grúa ya no está disponible.");
        }

        // 1. Cambiar estado de la grúa y reducir disponibilidad abstracta
        transaction.update(gruaRef, { estado: 'Ocupado' });

        // 2. Marcar la solicitud como asignada (En Curso)
        transaction.update(solicitudRef, { 
            estado: 'En Curso',
            gruaAsignada: gruaId 
        });

        // Simulación: Obtener cliente FCM token (esto asume que se guardó en la asistencia)
        const tokenFCM = solicitudDoc.data()?.cliente?.fcmToken;

        // Si tenemos un token, disparamos la notificación push
        if (tokenFCM) {
             // Es asíncrono pero no dependemos de él para la transacción DB 
             // Ojo: En un transacction puros no debe haber efectos secundarios, se suele correr después
             // Lo ejecutaremos sin await y catcheamos silencioso, o usamos hooks
             notificacionesService.enviarPush(tokenFCM, {
                 title: "¡Grúa asignada!",
                 body: "Tu conductor está en camino. Puedes seguirlo en tiempo real en la app.",
                 data: { solicitudId, lat: "-12.0431800", lng: "-77.0282400" } // Coordenadas iniciales simuladas
             }).catch(e => console.log("Push failed:", e.message));
        }

        return { status: "Success" };
    });
};

const rejectSolicitud = async (solicitudId) => {
    await db.collection(asistenciasCollection).doc(solicitudId).update({
        estado: 'Rechazada',
        rechazadaEn: new Date()
    });
};

module.exports = {
    create,
    getAvailables,
    assignSolicitud,
    rejectSolicitud
};
