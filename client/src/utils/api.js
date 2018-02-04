import { ERROR_MESSAGE, BASE_URL } from './constants';
import { actionDisplayMessage } from './../actions/NotificationAction';

import store from './store';
import axios from 'axios';

const handleError = (error, message) => {
    console.log(error);
    console.log(error.response);

    if (error.response) {
        if (error.response.status) {
            store.dispatch(
                actionDisplayMessage(
                    error.response.data
                        ? error.response.data.message
                        : 'Token Invalidated. Please login to continue',
                    Date.now(),
                    'error'
                )
            );
            if (error.response.status === 401)
                return {
                    requireLogin: true
                };
        }
    } else if (!error.status) {
        store.dispatch(
            actionDisplayMessage(
                'Unable to connect to network. Please check your connection',
                Date.now(),
                'warning'
            )
        );
        return {
            networkDown: true
        };
    } else {
        store.dispatch(actionDisplayMessage(message, Date.now(), 'error'));
    }

    return {
        requireLogin: false,
        error: true
    };
};

const getAuthHeader = () => {
    return {
        headers: {
            Authorization: 'Bearer ' + store.getState().user.token
        }
    };
};

export const loginUser = (username, password) => {
    return axios
        .post(`${BASE_URL}/auth/login`, {
            username,
            password
        })
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const registerUser = (username, password) => {
    return axios
        .post(`${BASE_URL}/auth/register`, {
            username,
            password
        })
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const getUserDetails = () => {
    return axios
        .get(`${BASE_URL}/user/get_user`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const addCategory = name => {
    let header = getAuthHeader();
    return axios
        .post(`${BASE_URL}/todo/add_category?category=${name}`, {}, header)
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const addTodo = (title, category) => {
    return axios
        .post(
            `${BASE_URL}/todo/add_todo`,
            {
                title,
                category
            },
            getAuthHeader()
        )
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const deleteTodo = id => {
    return axios
        .delete(`${BASE_URL}/todo?id=${id}`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const getTodoFromCategory = category => {
    return axios
        .get(`${BASE_URL}/todo/category?category=${category}`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const getTodoDueOn = date => {
    return axios
        .get(`${BASE_URL}/todo/due?datetime=${date}`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const getTodosDueTillNow = date => {
    return axios
        .get(`${BASE_URL}/todo/due_till_now?datetime=${date}`, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const setTodoState = (todoId, finalState) => {
    let url = `${BASE_URL}/todo/${
        finalState ? 'complete_todo' : 'mark_incomplete_todo'
    }?id=${todoId}`;
    return axios
        .patch(url, {}, getAuthHeader())
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const updateTodo = (id, dueDate, note, priority) => {
    return axios
        .put(
            `${BASE_URL}/todo/update_todo`,
            { id, dueDate, note, priority },
            getAuthHeader()
        )
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};

export const deleteCategory = categoryName => {
    return axios
        .delete(
            `${BASE_URL}/todo/category?category=${categoryName}`,
            getAuthHeader()
        )
        .then(response => response.data)
        .catch(error => handleError(error, ERROR_MESSAGE));
};
