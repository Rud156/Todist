import React, { Component } from 'react';

class SearchList extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);
    }

    render() {
        return <h1>{this.props.match.params.query}</h1>;
    }
}

export default SearchList;
