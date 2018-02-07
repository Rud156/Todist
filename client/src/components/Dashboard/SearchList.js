import React, { Component } from 'react';

class SearchList extends Component {
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }

    render() {
        return <h1>{this.props.match.params.query}</h1>;
    }
}

export default SearchList;
