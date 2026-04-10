const { messaging } = require('../config/firebase');

/**
 * Enviar notificación Push (FCM) a un dispositivo específico.
 * @param {string} token 
 * @param {object} payload - { title: "hola", body: "mundo", data: {} }
 */
const enviarPush = async (token, payload) => {
    try {
        const message = {
            token: token,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
        };

        const response = await messaging.send(message);
        console.log('Notificación enviada exitosamente:', response);
        return response;
    } catch (error) {
        console.error('Error enviando notificación Push:', error);
        throw error;
    }
};

module.exports = {
    enviarPush
};
