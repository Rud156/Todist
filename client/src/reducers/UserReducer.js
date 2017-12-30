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

            window.localStorage.setItem('userDetails', JSON.stringify(userDetails));
            window.localStorage.setItem('userToken', token);

            return {
                token,
                userDetails
            };

        case REMOVE_USER:
            window.localStorage.removeItem('userDetails');
            window.localStorage.removeItem('userToken');

            return {
                token: '',
                userDetails: null
            };

        default:
            return state;
    }
}