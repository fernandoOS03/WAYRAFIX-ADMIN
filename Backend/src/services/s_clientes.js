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
    
    const clientData = doc.data();
    
    // Fetch vehicles from subcollection
    const vehiclesSnapshot = await db.collection(collectionName)
        .doc(id)
        .collection('vehiculos')
        .get();
        
    const userVehicles = vehiclesSnapshot.docs.map(vDoc => ({ 
        id: vDoc.id, 
        ...vDoc.data() 
    }));

    return { 
        id: doc.id, 
        ...clientData, 
        vehiculos: userVehicles,
        vehicles: userVehicles, // Compatibilidad si el Dashboard busca en inglés
        vehiculos_count: userVehicles.length
    };
};

const getAggregatedData = async () => {
    // Obtenemos todos los usuarios con rol cliente (límite 100 para rendimiento)
    const clientsSnapshot = await db.collection(collectionName)
        .where('rol', '==', 'cliente')
        .limit(100)
        .get();

    // Fetch vehicles for each user in parallel from their subcollection
    const clientsWithVehicles = await Promise.all(clientsSnapshot.docs.map(async (doc) => {
        const clientData = doc.data();
        const clientId = doc.id;
        
        const vehiclesSnapshot = await db.collection(collectionName)
            .doc(clientId)
            .collection('vehiculos')
            .get();
            
        const userVehicles = vehiclesSnapshot.docs.map(vDoc => ({ 
            id: vDoc.id, 
            ...vDoc.data() 
        }));

        return {
            id: clientId,
            ...clientData,
            vehiculos: userVehicles,
            vehicles: userVehicles, // Compatibilidad si el Dashboard busca en inglés
            vehiculos_count: userVehicles.length
        };
    }));

    return clientsWithVehicles;
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
