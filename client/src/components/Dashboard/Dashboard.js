import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, NavLink, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Sidebar, Segment, Menu, Icon, Header, Grid, Button } from 'semantic-ui-react';

import { titleCase } from './../../utils/constants';
import TodoList from './TodoList';
import { actionRemoveUser } from '../../actions/UserAction';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };

        this.logoutUser = this.logoutUser.bind(this);
    }

    logoutUser() {
        this.props.removeUser();
        this.props.history.push('/');
    }

    render() {
        return (
            <BrowserRouter>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation='push' width='wide' visible={this.state.visible} vertical>
                        <Menu.Item name='User'>
                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column width='twelve' textAlign='center'>
                                        <h3>
                                            <Icon name='user' />
                                            {titleCase(this.props.user.userDetails.username)}
                                        </h3>
                                    </Grid.Column>
                                    <Grid.Column width='four' textAlign='center'>
                                        <h3 onClick={this.logoutUser} className='pointer-cursor'>
                                            <Icon name='power' />
                                        </h3>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Menu.Item>
                        <Menu.Item name='New List'>
                            <Header as='h3' color='blue' className='heading-font'>
                                <Icon name='add' color='blue' />
                                New List
                            </Header>
                        </Menu.Item>
                        <Menu.Item
                            name='New List'
                            as={NavLink}
                            to={`${this.props.match.url}/today`}
                            activeClassName='link-active'
                        >
                            <h3>
                                <Icon name='sun' color='orange' />
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
                                        activeClassName='link-active'
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

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        removeUser: actionRemoveUser
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Dashboard));