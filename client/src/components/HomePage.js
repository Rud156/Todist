import React, { Component } from 'react';
import { Grid, Header, Card, Button, Form, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { usernameRegex, passwordRegex } from './../utils/constants';
import { loginUser, registerUser } from './../utils/api';
import { actionAddUser } from './../actions/UserAction';
import { actionDisplayMessage } from '../actions/NotificationAction';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLogin: false,
            user: {
                username: '',
                password: ''
            },
            errorMessages: [],
            loading: false
        };

        this.toggleLogin = this.toggleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    toggleLogin() {
        let login = this.state.showLogin;
        this.setState({ showLogin: !login });
    }

    handleErrors() {
        let errors = [];
        let errorExists = false;
        if (!usernameRegex.test(this.state.user.username)) {
            errors.push(
                'Use only alphabets, numbers and dashes for your username'
            );
            errorExists = true;
        }
        if (!passwordRegex.test(this.state.user.password)) {
            errors.push(
                'Use only alphabets, numbers, dashes and slashes for your password'
            );
            errorExists = true;
        }
        if (errorExists)
            errors.push('Both must be between 5 and 20 characters in length');

        this.setState({ errorMessages: errors });
        return errorExists;
    }

    handleSubmit() {
        if (this.handleErrors()) return;
        this.setState({ loading: true });

        if (this.state.showLogin) {
            registerUser(
                this.state.user.username,
                this.state.user.password
            ).then(res => {
                if (res.success)
                    this.props.displayNotification(
                        res.message,
                        Date.now(),
                        'success'
                    );
                else if (res.networkDown) console.log('Network Down');

                this.setState({ loading: false });
            });
        } else {
            loginUser(this.state.user.username, this.state.user.password).then(
                res => {
                    if (res.success) {
                        this.props.addUser(res.user, res.token);
                        this.props.history.push('/dashboard');
                        this.props.displayNotification(
                            'Login Successful',
                            Date.now(),
                            'success'
                        );
                    } else this.setState({ loading: false });
                }
            );
        }
    }

    handleUsernameChange(event) {
        let user = { ...this.state.user };
        let username = event.target.value;

        user.username = username;
        this.setState({ user: user }, () => {
            this.handleErrors();
        });
    }

    handlePasswordChange(event) {
        let user = { ...this.state.user };
        let password = event.target.value;

        user.password = password;
        this.setState({ user: user }, () => {
            this.handleErrors();
        });
    }

    render() {
        return (
            <Grid columns={1} textAlign="center">
                <Grid.Row>
                    <Grid.Column>
                        <div className="padding-top">
                            <Header as="h1" color="orange">
                                Todist
                            </Header>
                            <Header as="h3" color="blue">
                                Application for all your todos
                            </Header>
                        </div>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid columns="two" divided stackable>
                        <Grid.Column>
                            <Card
                                className="text-center float-right"
                                centered
                                raised
                            >
                                <Card.Content>
                                    <Header as="h3" color="orange">
                                        What is it?
                                    </Header>
                                </Card.Content>
                                <Card.Content>
                                    A simple todo application for managing all
                                    your needs. Most use cases should be
                                    satisfied. If not open an
                                    <a href=""> issue on Github</a>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button
                                        fluid
                                        content={
                                            this.state.showLogin
                                                ? 'Go To Login'
                                                : 'Go To Register'
                                        }
                                        onClick={this.toggleLogin}
                                        color="blue"
                                    />
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card className="float-left" centered raised>
                                <Card.Content className="text-center">
                                    <Header as="h3" color="orange">
                                        {this.state.showLogin
                                            ? 'Register'
                                            : 'Login'}
                                    </Header>
                                </Card.Content>
                                <Card.Content>
                                    <Form onSubmit={this.handleSubmit} warning>
                                        <Form.Field className="text-left">
                                            <label>Username</label>
                                            <input
                                                placeholder="Awesome name here..."
                                                onChange={
                                                    this.handleUsernameChange
                                                }
                                                onFocus={
                                                    this.handleUsernameChange
                                                }
                                                value={this.state.user.username}
                                            />
                                        </Form.Field>
                                        <Form.Field className="text-left">
                                            <label>Password</label>
                                            <input
                                                placeholder="Super secret password..."
                                                type="password"
                                                onChange={
                                                    this.handlePasswordChange
                                                }
                                                onFocus={
                                                    this.handlePasswordChange
                                                }
                                                value={this.state.user.password}
                                            />
                                        </Form.Field>

                                        {this.state.errorMessages.length ? (
                                            <Message
                                                warning
                                                header="Could you check something!"
                                                list={this.state.errorMessages}
                                            />
                                        ) : (
                                            ''
                                        )}

                                        <Button
                                            type="submit"
                                            fluid
                                            color="blue"
                                            loading={this.state.loading}
                                            disabled={this.state.loading}
                                        >
                                            {this.state.showLogin
                                                ? `I'm All In`
                                                : `Let's Go`}
                                        </Button>
                                    </Form>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
            </Grid>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            addUser: actionAddUser,
            displayNotification: actionDisplayMessage
        },
        dispatch
    );
}

export default withRouter(connect(null, matchDispatchToProps)(HomePage));
