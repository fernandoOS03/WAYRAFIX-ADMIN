const PDFDocument = require('pdfkit');

const generarResumenPDF = (asistencia, stream) => {
    const doc = new PDFDocument({ margin: 50 });

    // Enviar el PDF a donde corresponda (en este caso al response en controller)
    doc.pipe(stream);

    // Cabecera
    doc.fontSize(20).text('WayraFix', { align: 'center' });
    doc.fontSize(12).text('Auxilio Mecánico - Recibo de Servicio', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, 110).lineTo(550, 110).stroke();
    doc.moveDown();

    // Detalle general
    doc.fontSize(14).text('Detalles del Servicio');
    doc.fontSize(12).text(`Nro de Ticket: ${asistencia.ticket || 'N/A'}`);
    doc.text(`Fecha: ${asistencia.fechaCorta || new Date().toISOString().split('T')[0]}`);
    doc.text(`Estado: ${asistencia.estado || 'Completado'}`);
    doc.moveDown();

    // Cliente
    doc.fontSize(14).text('Información del Cliente');
    doc.fontSize(12).text(`Nombre: ${asistencia.cliente?.nombre || 'N/A'}`);
    if (asistencia.cliente?.telefono) doc.text(`Teléfono: ${asistencia.cliente.telefono}`);
    doc.moveDown();

    // Vehículo & Siniestro
    doc.fontSize(14).text('Vehículo y Siniestro');
    doc.fontSize(12).text(`Marca / Modelo: ${asistencia.vehiculo?.marca || 'N/A'} ${asistencia.vehiculo?.modelo || ''}`);
    doc.text(`Placa: ${asistencia.vehiculo?.placa || 'N/A'}`);
    doc.text(`Tipo de Siniestro: ${asistencia.tipoSiniestro || 'Falla mecánica'}`);
    doc.moveDown();

    // Precios
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    
    doc.fontSize(14).text('Desglose de Precios');
    const precioBase = asistencia.precios?.base || 0;
    const precioAdicional = asistencia.precios?.adicionales || 0;
    const total = precioBase + precioAdicional;

    doc.fontSize(12).text(`Servicio Base: $${precioBase.toFixed(2)}`);
    doc.text(`Cargos Adicionales: $${precioAdicional.toFixed(2)}`);
    doc.font('Helvetica-Bold').text(`Total a Pagar: $${total.toFixed(2)}`);

    // Pie de página
    doc.moveDown(2);
    doc.font('Helvetica').fontSize(10).text('Gracias por confiar en WayraFix.', { align: 'center' });

    // Finalizamos el documento
    doc.end();
};

module.exports = {
    generarResumenPDF
};
