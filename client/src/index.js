import React from 'react';
import ReactDOM from 'react-dom';
import Notification from './Notification';
import registerServiceWorker from './registerServiceWorker';

import { Route, BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './utils/store';

import Homepage from './components/HomePage';
import Dashboard from './components/Dashboard/Dashboard';

import 'semantic-ui-css/semantic.min.css';
import './assets/index.css';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Notification />
                <Route exact path='/' component={Homepage} />
                <Route path='/dashboard' component={Dashboard} />
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();
