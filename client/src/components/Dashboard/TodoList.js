import React, { Component } from 'react';

class TodoList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    render() {
        return (
            <h1> Hello World </h1>
        );
    }
}

export default TodoList;