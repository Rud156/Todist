export const ERROR_MESSAGE = 'Sorry about that. But it looks like we made a mistake.';
export const BASE_URL = 'http://asp-net-todo.azurewebsites.net/api';

export const usernameRegex = /^[a-zA-Z0-9-]{5,20}$/;
export const passwordRegex = /^[a-zA-Z0-9 +-/*]{5,20}$/;

export const titleCase = (data) => {
    data = data.trim();
    return data.toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
};