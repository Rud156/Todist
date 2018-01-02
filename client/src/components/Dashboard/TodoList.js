import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { todayRegex, listsRegex } from './../../utils/constants';
import { getTodoFromCategory, getTodoDueOn, setTodoState } from '../../utils/api';
import { Grid, Header, List, Checkbox } from 'semantic-ui-react';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: [],
            loading: false,
            today: false
        };

        // There is slash at the beginning
        this.onRouteChanged = this.onRouteChanged.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            this.onRouteChanged();
        }
    }

    componentDidMount() {
        this.onRouteChanged();
    }

    onRouteChanged() {
        let currentUrl = this.props.match.url;
        this.setState({ loading: true, todos: [] });

        if (todayRegex.test(currentUrl)) {
            this.setState({ today: true });

            getTodoDueOn(moment().utc().format('YYYY-MM-DD'))
                .then(res => {
                    if (res.requireLogin) {
                        this.logoutUser();
                    } else {
                        this.setState({ todos: res.todos });
                        this.setState({ loading: false });
                    }
                });

        } else if (listsRegex.test(currentUrl)) {
            this.setState({ today: false });
            let category = this.props.match.params.id;
            getTodoFromCategory(category)
                .then(res => {
                    if (res.requireLogin)
                        this.logoutUser();
                    else {
                        this.setState({ todos: res.todos });
                        this.setState({ loading: false });
                    }
                });

        } else {
            this.setState({ loading: false, today: false });
        }
    }

    logoutUser() {
        this.props.removeUser();
        this.props.history.push('/');
    }

    handleCheckboxChange(todoId, currentState) {
        setTodoState(todoId, !currentState)
            .then(res => {
                if (res.requireLogin)
                    this.logoutUser();
                else {
                    let todos = this.state.todos.map(element => {
                        if (element.id === todoId)
                            element.completed = !currentState;
                        return element;
                    });
                    this.setState({ todos: todos });
                }
            });
    }

    render() {
        return (
            <div className='container'>
                <Grid columns='one'>
                    <Grid.Row className='no-padding-margin'>
                        <Grid.Column stretched className='fixed-height'>
                            <Header as='h2' className='position-bottom'>
                                {
                                    this.state.today ?
                                        `My Day - ${moment().format('dddd, MMMM D')}` :
                                        this.props.match.params.id
                                }
                            </Header>
                        </Grid.Column>
                        <Grid.Column stretched className='padding-top'>
                            <List divided verticalAlign='middle' relaxed>
                                {
                                    this.state.todos.map((element, index) => {
                                        return (
                                            <List.Item key={element.id}>
                                                <List.Content floated='left'>
                                                    <Checkbox
                                                        checked={element.completed}
                                                        onChange={() => {
                                                            this.handleCheckboxChange(element.id, element.completed);
                                                        }}
                                                    />
                                                </List.Content>
                                                <List.Content floated='left'>
                                                    <Header as='h4'>{element.title}</Header>
                                                </List.Content>
                                            </List.Item>
                                        )
                                    })
                                }
                                <List.Item>
                                    <Icon name='plus' size='large' />
                                    <List.Content>
                                        <Header as='h4'>Add New Todo</Header>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(TodoList);