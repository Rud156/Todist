export const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

export function actionDisplayMessage(message, time, messageType) {
    return {
        type: DISPLAY_MESSAGE,
        payload: {
            message: message,
            time: time,
            type: messageType
        }
    };
}

export function actionClearMessage(messageId) {
    return {
        type: CLEAR_MESSAGE,
        payload: messageId
    };
}