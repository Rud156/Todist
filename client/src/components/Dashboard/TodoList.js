import React, { Component } from 'react';
import moment from 'moment';

import { todayRegex, listsRegex } from './../../utils/constants';

class TodoList extends Component {
    constructor(props) {
        super(props);

        // There is slash at the beginning
        this.onRouteChanged = this.onRouteChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {

    }

    render() {
        return (
            <h1> Hello World </h1>
        );
    }
}

export default TodoList;