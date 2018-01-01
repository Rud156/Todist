import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1> Hello {this.props.user.userDetails.username} </h1>
                </div>
            </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Dashboard);