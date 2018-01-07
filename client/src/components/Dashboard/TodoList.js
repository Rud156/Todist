import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { todayRegex, listsRegex } from './../../utils/constants';
import {
    getTodoFromCategory,
    getTodoDueOn,
    setTodoState,
    addTodo,
    deleteTodo
} from '../../utils/api';
import {
    Grid,
    Header,
    List,
    Checkbox,
    Icon,
    Form,
    Button
} from 'semantic-ui-react';

import EditableModal from './EditableModal';
import DeleteModal from './DeleteModal';

class TodoList extends Component {
    constructor(props) {
        super(props);

        let currentUrl = props.match.url;
        let today = todayRegex.test(currentUrl);
        let loading =
            todayRegex.test(currentUrl) || listsRegex.test(currentUrl);

        this.state = {
            todos: [],
            loading: loading,
            today: today,

            displayForm: false,
            todoTitle: '',

            openEditableModal: false,
            openDeleteModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' },
            deleteLoading: false
        };

        // There is slash at the beginning
        this.onRouteChanged = this.onRouteChanged.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.displayNewTodoForm = this.displayNewTodoForm.bind(this);
        this.closeEditableModal = this.closeEditableModal.bind(this);
        this.handleTodoSelected = this.handleTodoSelected.bind(this);
        this.potentialDeleteSelected = this.potentialDeleteSelected.bind(this);
        this.deleteModalClosed = this.deleteModalClosed.bind(this);
        this.handleTodoDelete = this.handleTodoDelete.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            this.onRouteChanged();
        }
    }

    componentWillMount() {
        this.onRouteChanged();
    }

    onRouteChanged() {
        let currentUrl = this.props.match.url;

        if (todayRegex.test(currentUrl)) {
            getTodoDueOn(
                moment()
                    .utc()
                    .format('YYYY-MM-DD')
            ).then(res => {
                if (res.requireLogin) this.logoutUser();
                else if (res.networkDown) console.log('Network Down');
                else {
                    this.setState({ todos: res.todos, loading: false });
                }
            });
        } else if (listsRegex.test(currentUrl)) {
            let category = this.props.match.params.id;

            getTodoFromCategory(category).then(res => {
                if (res.requireLogin) this.logoutUser();
                else if (res.networkDown) console.log('Network Down');
                else {
                    this.setState({ todos: res.todos, loading: false });
                }
            });
        }
    }

    logoutUser() {
        this.props.removeUser();
        this.props.history.push('/');
    }

    handleCheckboxChange(todoId, currentState) {
        setTodoState(todoId, !currentState).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown) console.log('Network Down');
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

        let category = todayRegex.test(url)
            ? 'Todo'
            : this.props.match.params.id;

        addTodo(title, category).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown) console.log('Network Down');
            else {
                if (res.success) {
                    let todos = this.state.todos;
                    todos.push(res.todoItem);
                    this.setState({
                        todos: todos,
                        displayForm: false,
                        todoTitle: ''
                    });
                }
            }
        });
    }

    handleTodoSelected(todo) {
        this.setState({ openEditableModal: true, selectedTodoObject: todo });
    }

    closeEditableModal(todoItem) {
        if (!todoItem.id)
            this.setState({
                openEditableModal: false,
                selectedTodoObject: { title: '', priority: 0, notes: '' }
            });
        else {
            let { todos } = this.state;
            todos = todos.map(element => {
                if (element.id !== todoItem.id) return element;
                else return todoItem;
            });
            this.setState({
                openEditableModal: false,
                selectedTodoObject: { title: '', priority: 0, notes: '' },
                todos: todos
            });
        }
    }

    potentialDeleteSelected() {
        this.setState({ openEditableModal: false, openDeleteModal: true });
    }

    deleteModalClosed() {
        this.setState({
            openDeleteModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' }
        });
    }

    handleTodoDelete() {
        let id = this.state.selectedTodoObject.id;
        this.setState({ deleteLoading: true });

        deleteTodo(id).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown) {
                console.log('Network Down');
                this.setState({ deleteLoading: false });
            } else {
                let { todos } = this.state;
                todos = todos.filter(element => {
                    return element.id !== id;
                });
                this.setState({
                    openDeleteModal: false,
                    selectedTodoObject: { title: '', priority: 0, notes: '' },
                    deleteLoading: false,
                    todos: todos
                });
            }
        });
    }

    render() {
        return (
            <div className="container">
                <EditableModal
                    isOpen={this.state.openEditableModal}
                    handleClose={this.closeEditableModal}
                    todoObject={this.state.selectedTodoObject}
                    potentialDeleteSelected={this.potentialDeleteSelected}
                />
                <DeleteModal
                    open={this.state.openDeleteModal}
                    handleDelete={this.handleTodoDelete}
                    handleClose={this.deleteModalClosed}
                    loading={this.state.deleteLoading}
                />
                <Grid columns="one">
                    <Grid.Row className="no-padding-margin">
                        <Grid.Column stretched className="fixed-height">
                            <Header
                                as="h2"
                                className="position-bottom white-text full-width-100"
                            >
                                {this.state.today
                                    ? `My Day - ${moment().format(
                                          'dddd, MMMM D'
                                      )}`
                                    : this.props.match.params.id}
                                <Button
                                    icon="ellipsis horizontal"
                                    circular
                                    style={{
                                        marginRight: '35px',
                                        background: 'transparent',
                                        float: 'right'
                                    }}
                                />
                            </Header>
                        </Grid.Column>
                        <Grid.Column stretched className="padding-top">
                            <List divided verticalAlign="middle" relaxed>
                                {this.state.todos.map(element => {
                                    return (
                                        <List.Item key={element.id}>
                                            <List.Content floated="left">
                                                <Checkbox
                                                    checked={element.completed}
                                                    onChange={() => {
                                                        this.handleCheckboxChange(
                                                            element.id,
                                                            element.completed
                                                        );
                                                    }}
                                                />
                                            </List.Content>
                                            <List.Content floated="left">
                                                <Header as="h4">
                                                    {element.title}
                                                </Header>
                                            </List.Content>
                                            <List.Content floated="right">
                                                <Icon
                                                    name="ellipsis horizontal"
                                                    size="large"
                                                    className="pointer-cursor"
                                                    onClick={() => {
                                                        this.handleTodoSelected(
                                                            element
                                                        );
                                                    }}
                                                />
                                            </List.Content>
                                        </List.Item>
                                    );
                                })}
                                {this.state.displayForm && (
                                    <List.Item>
                                        <List.Content>
                                            <Form onSubmit={this.handleSubmit}>
                                                <Form.Field className="text-left">
                                                    <input
                                                        placeholder="Todo title..."
                                                        onChange={
                                                            this
                                                                .handleTitleChange
                                                        }
                                                        value={
                                                            this.state.todoTitle
                                                        }
                                                    />
                                                </Form.Field>
                                            </Form>
                                        </List.Content>
                                    </List.Item>
                                )}
                                <List.Item>
                                    <Icon
                                        name="plus"
                                        size="large"
                                        className="pointer-cursor"
                                        onClick={this.displayNewTodoForm}
                                    />
                                    <List.Content>
                                        <Header as="h4">Add New Todo</Header>
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
