const { db } = require('../config/firebase');

const collectionName = 'usuarios';

const getAll = async () => {
    const snapshot = await db.collection(collectionName)
        .where('rol', '==', 'cliente')
        .limit(100)
        .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getById = async (id) => {
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const getAggregatedData = async () => {
    // Obtenemos todos los usuarios con rol cliente (límite 100 para rendimiento)
    const clientsSnapshot = await db.collection(collectionName)
        .where('rol', '==', 'cliente')
        .limit(100)
        .get();
    // Obtenemos todos los vehículos
    const vehiclesSnapshot = await db.collection('vehiculos').get();

    const vehiclesMap = {};
    const vehiclesByClientId = {};

    vehiclesSnapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Usamos VIN y Placa como posibles llaves
        if (data.vin) vehiclesMap[data.vin] = data;
        if (data.placa) vehiclesMap[data.placa] = data;

        // Agrupación por clientId si existe
        if (data.clientId) {
            if (!vehiclesByClientId[data.clientId]) vehiclesByClientId[data.clientId] = [];
            vehiclesByClientId[data.clientId].push(data);
        }
    });

    return clientsSnapshot.docs.map(doc => {
        const clientData = doc.data();
        const clientId = doc.id;

        // 1. Intentar por clientId directo
        let userVehicles = vehiclesByClientId[clientId] || [];

        // 2. Fallback por llaves en el doc cliente
        if (userVehicles.length === 0) {
            const key = clientData.vin || clientData.placa;
            if (key && vehiclesMap[key]) {
                userVehicles = [vehiclesMap[key]];
            }
        }

        return {
            id: clientId,
            ...clientData,
            vehiculos: userVehicles
        };
    });
};

const toggleActive = async (id, isActive) => {
    await db.collection(collectionName).doc(id).update({
        is_active: isActive,
        updatedAt: new Date()
    });
    return { success: true, is_active: isActive };
};

module.exports = {
    getAll,
    getById,
    getAggregatedData,
    toggleActive
};
