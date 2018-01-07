import React from 'react';
import ReactDOM from 'react-dom';
import Notification from './Notification';

import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import 'react-dates/initialize';

import { Provider } from 'react-redux';
import store from './utils/store';
import { actionAddUser, actionRemoveUser } from './actions/UserAction';

import PrivateRoute from './components/Dashboard/PrivateRoute';
import Homepage from './components/HomePage';
import Dashboard from './components/Dashboard/Dashboard';

import 'semantic-ui-css/semantic.min.css';
import './assets/index.css';
import './assets/transition.css';
import TransitionHOC from './components/TransitionHOC';

const userIsLoggedIn = () => {
    if (window.localStorage.getItem('user') != null) {
        var user = JSON.parse(window.localStorage.getItem('user'));
        store.dispatch(actionAddUser(user.userDetails, user.token));
        return true;
    } else {
        store.dispatch(actionRemoveUser());
        return false;
    }
};

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Notification />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return userIsLoggedIn() ? (
                                <Redirect to="/dashboard" />
                            ) : (
                                <Homepage />
                            );
                        }}
                    />
                    <PrivateRoute
                        path="/dashboard"
                        component={TransitionHOC(Dashboard)}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();
