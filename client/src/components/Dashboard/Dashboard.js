import React, { Component } from 'react';
import {
    Route,
    BrowserRouter,
    Switch,
    NavLink,
    Redirect
} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    Sidebar,
    Segment,
    Menu,
    Icon,
    Header,
    Grid,
    Responsive,
    Button,
    Form
} from 'semantic-ui-react';

import { titleCase } from './../../utils/constants';
import { actionRemoveUser, actionAddUser } from '../../actions/UserAction';
import { getUserDetails, addCategory } from '../../utils/api';
import TodoList from './TodoList';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true,
            mobileViewActive: false,

            displayForm: false,
            categoryName: ''
        };

        this.logoutUser = this.logoutUser.bind(this);
        this.handleOnUpdate = this.handleOnUpdate.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleNewCategoryForm = this.toggleNewCategoryForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCategoryNameChange = this.handleCategoryNameChange.bind(
            this
        );
    }

    componentWillMount() {
        this.getUser();
    }

    componentDidMount() {
        this.handleOnUpdate(null, { width: window.innerWidth });
    }

    getUser() {
        getUserDetails().then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown || res.error) {
                console.log('Network Down');
            } else this.props.addUser(res.user, res.token);
        });
    }

    logoutUser() {
        this.props.removeUser();
        this.props.history.push('/');
    }

    handleOnUpdate(event, callee) {
        if (callee.width <= 767) {
            this.setState({ visible: false, mobileViewActive: true });
        } else {
            this.setState({ visible: true, mobileViewActive: false });
        }
    }

    toggleSidebar() {
        let visible = this.state.visible;
        this.setState({ visible: !visible });
    }

    toggleNewCategoryForm() {
        let display = this.state.displayForm;
        this.setState({ displayForm: !display });
    }

    handleCategoryNameChange(event) {
        this.setState({ categoryName: event.target.value });
    }

    handleSubmit() {
        addCategory(this.state.categoryName).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown || res.error) console.log('Network Down');
            else {
                this.getUser();
                this.setState({ displayForm: false, categoryName: '' });
            }
        });
    }

    render() {
        return (
            <BrowserRouter>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation="push"
                        width="wide"
                        visible={this.state.visible}
                        vertical
                    >
                        <Menu.Item name="User">
                            <Grid
                                columns={this.state.mobileViewActive ? 3 : 2}
                                divided
                            >
                                <Grid.Row>
                                    <Grid.Column
                                        width="four"
                                        textAlign="center"
                                    >
                                        <h3
                                            onClick={this.logoutUser}
                                            className="pointer-cursor"
                                        >
                                            <Icon name="power" />
                                        </h3>
                                    </Grid.Column>
                                    <Grid.Column
                                        width="eight"
                                        textAlign="center"
                                    >
                                        <h3>
                                            <Icon name="user" />
                                            {titleCase(
                                                this.props.user.userDetails
                                                    .username
                                            )}
                                        </h3>
                                    </Grid.Column>
                                    {this.state.mobileViewActive && (
                                        <Grid.Column
                                            width="four"
                                            textAlign="center"
                                        >
                                            <h3
                                                onClick={this.toggleSidebar}
                                                className="pointer-cursor"
                                            >
                                                <Icon name="close" />
                                            </h3>
                                        </Grid.Column>
                                    )}
                                </Grid.Row>
                            </Grid>
                        </Menu.Item>
                        <Menu.Item
                            name="New List"
                            as={NavLink}
                            to={`${this.props.match.url}/today`}
                            activeClassName="link-active"
                        >
                            <h3>
                                <Icon name="sun" color="orange" />
                                My Day
                            </h3>
                        </Menu.Item>
                        {this.props.user.userDetails.categories.map(element => {
                            return (
                                <Menu.Item
                                    to={`${
                                        this.props.match.url
                                    }/lists/${element}`}
                                    className="heading-font"
                                    as={NavLink}
                                    name="New List"
                                    key={element}
                                    activeClassName="link-active"
                                >
                                    {element}
                                </Menu.Item>
                            );
                        })}
                        {this.state.displayForm && (
                            <Menu.Item name="Category Form">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field className="text-left">
                                        <input
                                            placeholder="Todo title..."
                                            onChange={
                                                this.handleCategoryNameChange
                                            }
                                            value={this.state.categoryName}
                                        />
                                    </Form.Field>
                                </Form>
                            </Menu.Item>
                        )}
                        <Menu.Item
                            name="New List"
                            onClick={this.toggleNewCategoryForm}
                        >
                            <Header
                                as="h3"
                                color="blue"
                                className="heading-font"
                            >
                                <Icon
                                    name={
                                        this.state.displayForm ? 'close' : 'add'
                                    }
                                    color="blue"
                                />
                                {this.state.displayForm ? 'Close' : 'New List'}
                            </Header>
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment
                            basic
                            className="positon-relative"
                            style={{
                                width: this.state.visible
                                    ? window.innerWidth - 350
                                    : window.innerWidth
                            }}
                        >
                            <Responsive {...Responsive.onlyMobile}>
                                <Button
                                    circular
                                    icon="sidebar"
                                    size="large"
                                    className="position-icon"
                                    onClick={this.toggleSidebar}
                                />
                            </Responsive>
                            <Responsive onUpdate={this.handleOnUpdate}>
                                <Switch>
                                    <Route
                                        exact
                                        path={`${this.props.match.url}/today`}
                                        component={TodoList}
                                    />
                                    <Route
                                        path={`${
                                            this.props.match.url
                                        }/lists/:id`}
                                        component={TodoList}
                                    />
                                    <Redirect
                                        from={`${this.props.match.url}`}
                                        to={`${this.props.match.url}/today`}
                                    />
                                </Switch>
                            </Responsive>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </BrowserRouter>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            removeUser: actionRemoveUser,
            addUser: actionAddUser
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, matchDispatchToProps)(Dashboard)
);
