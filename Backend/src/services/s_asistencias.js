const { db } = require('../config/firebase');
const { Filter } = require('firebase-admin/firestore');

const collectionName = 'asistencias';

const getAll = async () => {
    const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            Filter.where('cliente.nombre', '==', queryTerm),
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
        query = query.where('tipoSiniestro', '==', tipoSiniestro);
    }
    if (estado) {
        query = query.where('estado', '==', estado);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
    getAll,
    getById,
    searchExact,
    filterAdvanced
};
