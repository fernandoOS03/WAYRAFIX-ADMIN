const { db, messaging, admin } = require('../config/firebase');
const { Filter, Timestamp } = require('firebase-admin/firestore');
const { getDistance } = require('../utils/geo');
const { BASES_GRUAS } = require('../config/bases');
const socketConfig = require('../config/socket');
const notificacionesService = require('./s_notificaciones');

const collectionName = 'asistencias';

const getAll = async () => {
    const snapshot = await db.collection(collectionName)
        .orderBy('fecha_creacion', 'desc')
        .limit(50)
        .get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            // Compatibilidad con Dashboard (Frontend)
            cliente: { nombre: data.nombre_cliente || 'Anónimo' },
            tipoSiniestro: data.tipo_siniestro || 'Otros'
        };
    });
};

const getById = async (id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const searchExact = async (queryTerm) => {
    // Buscará coincidencia exacta en Cliente(Nombre), Vehículo(placa) o Ticket
    // Requiere Firestore admin Filter para OR query
    const ref = db.collection(collectionName);
    
    // Asumiremos las propiedades: cliente.nombre, vehiculo.placa, ticket
    const snapshot = await ref.where(
        Filter.or(
            Filter.where('nombre_cliente', '==', queryTerm),
            Filter.where('vehiculo.placa', '==', queryTerm),
            Filter.where('ticket', '==', queryTerm)
        )
    ).get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const filterAdvanced = async ({ fecha, tipoSiniestro, estado }) => {
    let query = db.collection(collectionName);

    if (fecha) {
        // Asumiendo formato YYYY-MM-DD
        query = query.where('fechaCorta', '==', fecha);
    }
    if (tipoSiniestro) {
        query = query.where('tipo_siniestro', '==', tipoSiniestro);
    }
    if (estado) {
        query = query.where('estado', '==', estado);
    }

    const snapshot = await query.limit(50).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const crearSOS = async (sosData) => {
    const { uid_usuario, latitud, longitud, nombre_cliente, celular, vehiculo_id, tipo_siniestro } = sosData;

    // 1. Algoritmo de Asignación (Cercanía)
    let masCercana = null;
    let distanciaMinima = Infinity;

    BASES_GRUAS.forEach(base => {
        const dist = getDistance(latitud, longitud, base.latitud, base.longitud);
        if (dist < distanciaMinima) {
            distanciaMinima = dist;
            masCercana = base;
        }
    });

    const id_servicio = `SERV-${Date.now()}`;
    const ticket = Math.floor(100000 + Math.random() * 900000).toString();

    const nuevaAsistencia = {
        id_servicio,
        ticket,
        uid_usuario,
        nombre_cliente,
        celular,
        vehiculo: vehiculo_id, // Objeto completo: { marca, modelo, placa, color, vin, transmision }
        ubicacion: {
            latitud,
            longitud
        },
        tipo_siniestro: tipo_siniestro,
        estado: 'pendiente',
        fecha_creacion: Timestamp.now(),
        fechaCorta: new Date().toISOString().split('T')[0],
        asignacion: {
            id_grua: masCercana.grua_id,
            nombre_grua: masCercana.nombre,
            base_asignada: masCercana.id,
            distancia_km: distanciaMinima.toFixed(2)
        },
        // Compatibilidad con Dashboard (Frontend)
        cliente: { nombre: nombre_cliente },
        tipoSiniestro: tipo_siniestro
    };

    // Medición de rendimiento
    const start = Date.now();

    // Persistencia concurrente en Firestore y Realtime Database
    console.log(`[SOS] Iniciando guardado para servicio: ${id_servicio}`);
    
    const firestorePromise = db.collection(collectionName).add(nuevaAsistencia);
    const rtdbRef = admin.database().ref(`activos/${id_servicio}`);
    const rtdbPromise = rtdbRef.set({
        estado: 'pendiente',
        ubicacion_grua: {
            lat: masCercana.latitud,
            lng: masCercana.longitud
        },
        cliente: nombre_cliente,
        tipo: tipo_siniestro
    });

    const [docRef] = await Promise.all([firestorePromise, rtdbPromise]);
    
    console.log(`[SOS] Guardado completado en ${Date.now() - start}ms`);

    // Notificar al Panel Admin via Socket.IO (No bloqueante para la respuesta al app)
        io.emit('newAsistencia', {
            id: docRef.id,
            ...nuevaAsistencia
        });
        console.log(`[SOS] Alerta emitida vía Socket.IO (newAsistencia)`);
    } catch (e) {
        console.error("[SOS] Socket.io no disponible para emitir nuevaAlerta");
    }

    return {
        id: docRef.id,
        id_servicio,
        nombre_grua: masCercana.nombre,
        ubicacion_tiempo_real_grua: {
            lat: masCercana.latitud,
            lng: masCercana.longitud
        }
    };
};

const rechazarSolicitud = async (id, motivo) => {
    const asistencia = await getById(id);
    if (!asistencia) throw new Error("Asistencia no encontrada");

    // Actualizar estado en Firestore
    await db.collection(collectionName).doc(id).update({
        estado: 'rechazado',
        motivo_rechazo: motivo,
        updatedAt: Timestamp.now()
    });

    // Actualizar en RTDB
    await admin.database().ref(`activos/${asistencia.id_servicio}`).update({
        estado: 'rechazado',
        motivo_rechazo: motivo
    });

    // Disparar Notificación Push
    if (asistencia.fcmToken) {
        try {
            await notificacionesService.enviarPush(asistencia.fcmToken, {
                title: 'Solicitud Rechazada',
                body: `Tu solicitud de asistencia fue rechazada: ${motivo}`
            });
        } catch (error) {
            console.error("Error enviando push:", error);
        }
    }

    return { success: true, message: "Solicitud rechazada y notificación enviada" };
};

const actualizarEstado = async (id, nuevoEstado) => {
    const asistencia = await getById(id);
    if (!asistencia) throw new Error("Asistencia no encontrada");

    await db.collection(collectionName).doc(id).update({
        estado: nuevoEstado,
        updatedAt: Timestamp.now()
    });

    await admin.database().ref(`activos/${asistencia.id_servicio}`).update({
        estado: nuevoEstado
    });

    return { success: true };
};

module.exports = {
    getAll,
    getById,
    searchExact,
    filterAdvanced,
    crearSOS,
    rechazarSolicitud,
    actualizarEstado
};
