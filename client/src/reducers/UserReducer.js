import {
    ADD_USER,
    REMOVE_USER
} from './../actions/UserAction';

let defaultState = {
    token: '',
    userDetails: null
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case ADD_USER:
            let token = action.payload.token;
            let userDetails = action.payload.user;

            window.localStorage.setItem('user', JSON.stringify({
                token: token,
                userDetails: userDetails
            }));

            return {
                token,
                userDetails
            };

        case REMOVE_USER:
            window.localStorage.removeItem('user');

            return {
                token: '',
                userDetails: null
            };

        default:
            return state;
    }
}