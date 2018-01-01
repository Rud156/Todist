import React, { Component } from 'react';
import moment from 'moment';

import { todayRegex, listsRegex } from './../../utils/constants';
import { getTodoFromCategory } from '../../utils/api';

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: []
        };

        // There is slash at the beginning
        this.onRouteChanged = this.onRouteChanged.bind(this);

        this.onRouteChanged();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        let currentUrl = this.props.match.url;
        if (todayRegex.test(currentUrl)) {
            console.log('Today');
        } else if (listsRegex.test(currentUrl)) {
            let category = this.props.match.params.id;
            getTodoFromCategory(category)
                .then(res => {
                    this.setState({ todos: res });
                });
        }
    }

    render() {
        return (
            <h1> {JSON.stringify(this.state.todos)} </h1>
        );
    }
}

export default TodoList;