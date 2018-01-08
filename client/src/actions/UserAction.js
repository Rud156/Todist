export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';

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

export function actionRemoveCategory(category) {
    return {
        type: REMOVE_CATEGORY,
        payload: category
    };
}
