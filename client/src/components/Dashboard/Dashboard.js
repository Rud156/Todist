import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Sidebar, Segment, Menu, Icon } from 'semantic-ui-react';

import { titleCase } from './../../utils/constants';
import TodoList from './TodoList';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            visible: true
        };
    }

    render() {
        return (
            <BrowserRouter>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation='push' width='wide' visible={this.state.visible} vertical>
                        <Menu.Item name='User'>
                            <h2 className='text-center'>
                                <Icon name='user' />
                                {titleCase(this.props.user.userDetails.username)}
                            </h2>
                        </Menu.Item>
                        <Menu.Item name='New List'>
                            <h3>
                                <Icon name='add' />
                                New List
                            </h3>
                        </Menu.Item>
                        <Menu.Item
                            name='New List'
                            as={NavLink}
                            to={`${this.props.match.url}/today`}
                        >
                            <h3>
                                <Icon name='sun' />
                                My Day
                        </h3>
                        </Menu.Item>
                        {
                            this.props.user.userDetails.categories.map(element => {
                                return (
                                    <Menu.Item
                                        to={`${this.props.match.url}/lists/${element}`}
                                        className='heading-font'
                                        as={NavLink}
                                        name='New List'
                                        key={element}
                                    >
                                        {element}
                                    </Menu.Item>
                                );
                            })
                        }
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic>
                            <Switch>
                                <Route
                                    exact
                                    path={`${this.props.match.url}/today`}
                                    component={TodoList}
                                />
                                <Route path={`${this.props.match.url}/lists/:id`}
                                    component={TodoList}
                                />
                                <Redirect from={`${this.props.match.url}`} to={`${this.props.match.url}/today`} />
                            </Switch>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
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