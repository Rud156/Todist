import {
    ADD_USER,
    REMOVE_USER,
    REMOVE_CATEGORY
} from './../actions/UserAction';

let defaultState = {
    token: '',
    userDetails: null
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case ADD_USER:
            let token = action.payload.token;
            let userDetails = action.payload.user;

            window.localStorage.setItem(
                'user',
                JSON.stringify({
                    token: token,
                    userDetails: userDetails
                })
            );

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

        case REMOVE_CATEGORY:
            let categories = state.userDetails.categories;
            let name = action.payload;
            categories = categories.filter(element => {
                return element !== name;
            });
            let finalState = {
                token: state.token,
                userDetails: {
                    username: state.userDetails.username,
                    categories: categories
                }
            };
            window.localStorage.setItem('user', JSON.stringify(finalState));
            return finalState;

        default:
            return state;
    }
}
