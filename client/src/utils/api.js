import { ERROR_MESSAGE, BASE_URL } from './constants';
import { actionDisplayMessage } from './../actions/NotificationAction';

import store from './store';
import axios from 'axios';

const handleError = (error, message) => {
    console.log(error);
    console.log(error.response);

    if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
            store.dispatch(
                actionDisplayMessage(
                    error.response.data ? error.response.data.message : 'Token Invalidated. Please login to continue',
                    Date.now(),
                    'error'));
            return {
                requireLogin: true
            };
        }
    } else {
        store.dispatch(actionDisplayMessage(message, Date.now(), 'error'));
    }

    return {
        requireLogin: false
    };
};

const getAuthHeader = () => {
    return {
        headers: {
            'Authorization': 'Bearer ' + store.getState().user.token
        }
    };
};

export const loginUser = (username, password) => {
    return axios.post(`${BASE_URL}/auth/login`, {
        username,
        password
    })
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const registerUser = (username, password) => {
    return axios.post(`${BASE_URL}/auth/register`, {
        username,
        password
    })
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const addCategory = (name) => {
    let header = getAuthHeader();
    return axios.post(`${BASE_URL}/todo/add_category`, {}, header)
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const addTodo = (title, category) => {
    return axios.post(`${BASE_URL}/todo/add_todo`, {
        title,
        category
    }, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const getTodoFromCategory = (category) => {
    return axios.get(`${BASE_URL}/todo/category?category=${category}`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};