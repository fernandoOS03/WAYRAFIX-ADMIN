const asistenciasService = require('../src/services/s_asistencias');

async function testSOS() {
    console.log("--- Test Case 1: Succesful Assignment (Lima Centro) ---");
    const mockDataOk = {
        uid_usuario: "test-user-123",
        latitud: -12.046374, // Centro de Lima
        longitud: -77.042793,
        nombre_cliente: "Test User OK",
        celular: "999888777",
        vehiculo_id: { id: "VEH-001", placa: "ABC-123", modelo: "Toyota Corolla" },
        tipo_siniestro: "Bateria"
    };

    const resOk = await asistenciasService.crearSOS(mockDataOk);
    console.log("Result OK:", JSON.stringify(resOk, null, 2));

    console.log("\n--- Test Case 2: No Crane Available (Far Away) ---");
    const mockDataFar = {
        uid_usuario: "test-user-456",
        latitud: -15.000, // Lejos (ej: Nazca)
        longitud: -75.000,
        nombre_cliente: "Test User Far",
        celular: "999888666",
        vehiculo_id: { id: "VEH-002", placa: "XYZ-999", modelo: "Nissan Sentra" },
        tipo_siniestro: "Accidente"
    };

    const resFar = await asistenciasService.crearSOS(mockDataFar);
    console.log("Result Far:", JSON.stringify(resFar, null, 2));
}

testSOS().catch(console.error);
