import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { todayRegex, listsRegex } from './../../utils/constants';
import { getTodoFromCategory, getTodoDueOn, setTodoState, addTodo } from '../../utils/api';
import { Grid, Header, List, Checkbox, Icon, Form } from 'semantic-ui-react';

import EditableModal from './EditableModal';

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: [],
            loading: false,
            today: false,

            displayForm: false,
            todoTitle: '',

            openEditableModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' }
        };

        // There is slash at the beginning
        this.onRouteChanged = this.onRouteChanged.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.displayNewTodoForm = this.displayNewTodoForm.bind(this);
        this.closeEditableModal = this.closeEditableModal.bind(this);
        this.handleTodoSelected = this.handleTodoSelected.bind(this);
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
        this.setState({ loading: true, todos: [], displayForm: false, todoTitle: '' });

        if (todayRegex.test(currentUrl)) {
            this.setState({ today: true });

            getTodoDueOn(moment().utc().format('YYYY-MM-DD'))
                .then(res => {
                    if (res.requireLogin)
                        this.logoutUser();
                    else if (res.networkDown)
                        console.log('Network Down');
                    else {
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
                    else if (res.networkDown)
                        console.log('Network Down');
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
                else if (res.networkDown)
                    console.log('Network Down');
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

    displayNewTodoForm() {
        this.setState({ displayForm: true });
    }

    handleTitleChange(event) {
        this.setState({ todoTitle: event.target.value });
    }

    handleSubmit() {
        let title = this.state.todoTitle;
        let url = this.props.match.url;

        let category = todayRegex.test(url) ? 'Todo' : this.props.match.params.id;

        addTodo(title, category)
            .then(res => {
                if (res.requireLogin)
                    this.logoutUser();
                else if (res.networkDown)
                    console.log('Network Down');
                else {
                    if (res.success) {
                        let todos = this.state.todos;
                        todos.push(res.todoItem);
                        this.setState({ todos: todos, displayForm: false, todoTitle: '' });
                    }
                }
            });
    }

    handleTodoSelected(todo) {
        this.setState({ openEditableModal: true, selectedTodoObject: todo });
    }

    closeEditableModal() {
        this.setState({
            openEditableModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' }
        });
    }

    render() {
        return (
            <div className='container'>
                <EditableModal
                    isOpen={this.state.openEditableModal}
                    handleClose={this.closeEditableModal}
                    todoObject={this.state.selectedTodoObject}
                />
                <Grid columns='one'>
                    <Grid.Row className='no-padding-margin'>
                        <Grid.Column stretched className='fixed-height'>
                            <Header as='h2' className='position-bottom white-text'>
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
                                    this.state.todos.map(element => {
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
                                                <List.Content floated='right'>
                                                    <Icon
                                                        name='ellipsis horizontal'
                                                        size='large'
                                                        className='pointer-cursor'
                                                        onClick={() => {
                                                            this.handleTodoSelected(element)
                                                        }}
                                                    />
                                                </List.Content>
                                            </List.Item>
                                        )
                                    })
                                }
                                {
                                    this.state.displayForm &&
                                    <List.Item>
                                        <List.Content>
                                            <Form onSubmit={this.handleSubmit}>
                                                <Form.Field className='text-left'>
                                                    <input
                                                        placeholder='Todo title...'
                                                        onChange={this.handleTitleChange}
                                                        value={this.state.todoTitle}
                                                    />
                                                </Form.Field>
                                            </Form>
                                        </List.Content>
                                    </List.Item>
                                }
                                <List.Item>
                                    <Icon
                                        name='plus'
                                        size='large'
                                        className='pointer-cursor'
                                        onClick={this.displayNewTodoForm}
                                    />
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