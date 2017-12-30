export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';

export function actionAddUser(user, token) {
    return {
        type: ADD_USER,
        payload: {
            user,
            token
        }
    };
}

export function actionRemoveUser() {
    return {
        type: REMOVE_USER
    };
}