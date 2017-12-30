import {
    createStore,
    combineReducers
} from 'redux';

import NotificationReducer from './../reducers/NotificationReducer';
import UserReducer from './../reducers/UserReducer';

const combinedReducers = combineReducers({
    notification: NotificationReducer,
    user: UserReducer
});

const store = createStore(
    combinedReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;