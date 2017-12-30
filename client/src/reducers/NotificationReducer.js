import {
    DISPLAY_MESSAGE,
    CLEAR_MESSAGE
} from './../actions/NotificationAction';

let defaultState = {
    id: 0,
    messages: []
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case DISPLAY_MESSAGE:
            let currentState = { ...state };
            currentState.id += 1;
            currentState.messages.push({
                message: action.payload.message,
                time: action.payload.time,
                type: action.payload.type,
                id: state.id + 1
            });
            return currentState;

        case CLEAR_MESSAGE:
            let messageId = action.payload;
            let filteredMessages = state.messages.filter(element => {
                return element.id !== messageId;
            });
            let filteredState = {
                id: state.id,
                messages: filteredMessages
            };
            return filteredState;

        default:
            return state;
    }
}