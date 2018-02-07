import { createStore, combineReducers } from 'redux';

import NotificationReducer from './../reducers/NotificationReducer';
import UserReducer from './../reducers/UserReducer';

const combinedReducers = combineReducers({
    notification: NotificationReducer,
    user: UserReducer,
});

let store;
if (process.env.NODE_ENV === 'development')
    store = createStore(
        combinedReducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
else store = createStore(combinedReducers);

export default store;
