import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import store from './../../utils/store';
import { actionAddUser, actionRemoveUser } from './../../actions/UserAction';

const userExists = () => {
    if (window.localStorage.getItem('user') != null) {
        var user = JSON.parse(window.localStorage.getItem('user'));
        store.dispatch(actionAddUser(user.userDetails, user.token));
        return true;
    } else {
        store.dispatch(actionRemoveUser());
        return false;
    }
};


const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={(props) => {
            if (!userExists())
                return (<Redirect to='/' />);
            else
                return (<Component {...props} />);
        }} />

    );
};

export default PrivateRoute;