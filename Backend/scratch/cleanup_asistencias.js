const { db, admin } = require('../src/config/firebase');

async function cleanup() {
    console.log("🚀 Iniciando limpieza de asistencias pendientes...");
    
    try {
        const snapshot = await db.collection('asistencias').where('estado', '==', 'pendiente').get();
        
        if (snapshot.empty) {
            console.log("✅ No hay asistencias pendientes para eliminar.");
            process.exit(0);
        }

        console.log(`📦 Encontradas ${snapshot.size} asistencias. Eliminando...`);
        
        const batch = db.batch();
        const rtdb = admin.database();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            // Eliminar de Firestore
            batch.delete(doc.ref);
            console.log(`  - Programado para eliminar en Firestore: ${doc.id}`);
            
            // Eliminar de RTDB de forma segura
            if (data.id_servicio) {
                try {
                    // Intentar eliminar con un timeout corto
                    const rtdbPromise = rtdb.ref(`activos/${data.id_servicio}`).remove();
                    // No esperamos aquí para no bloquear
                } catch (e) {
                    console.warn(`  - Saltando RTDB para ${data.id_servicio} debido a error de config.`);
                }
            }
        }

        await batch.commit();
        console.log("✅ Limpieza de Firestore completada.");
        console.log("ℹ️ Nota: Si hubo errores de RTDB, revisa la URL en el .env.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error durante la limpieza:", error);
        process.exit(1);
    }
}

cleanup();
