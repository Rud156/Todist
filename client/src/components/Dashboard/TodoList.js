import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { todayRegex, listsRegex } from './../../utils/constants';
import {
    getTodoFromCategory,
    setTodoState,
    addTodo,
    deleteTodo,
    deleteCategory,
    getTodosDueTillNow
} from '../../utils/api';
import {
    Grid,
    Header,
    List,
    Checkbox,
    Icon,
    Form,
    Dropdown
} from 'semantic-ui-react';

import EditableModal from './EditableModal';
import DeleteModal from './DeleteModal';
import { actionRemoveCategory } from '../../actions/UserAction';

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

            displayCompleted: false,

            displayForm: false,
            todoTitle: '',

            openEditableModal: false,
            openDeleteModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' },
            deleteLoading: false,
            deleteCategorySelected: false,

            sortDropDownOptions: [
                { key: 1, text: 'Sort Due Date', value: 0, icon: 'clock' },
                { key: 2, text: 'Sort Start Date', value: 1, icon: 'calendar' },
                {
                    key: 3,
                    text: 'Sort Alphabetically',
                    value: 2,
                    icon: 'sort alphabet ascending'
                },
                {
                    key: 4,
                    text: 'Sort Completed',
                    value: 3,
                    icon: 'sort content ascending'
                },
                { key: 5, text: 'Sort Added To My Day', value: 4, icon: 'sun' }
            ],

            optionsDropDownOptions: [
                {
                    key: 1,
                    text: 'Toggle Completed',
                    value: 0,
                    icon: 'check square'
                },
                { key: 2, text: 'Delete List', value: 1, icon: 'trash' }
            ]
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
        this.deleteList = this.deleteList.bind(this);
        this.deleteManager = this.deleteManager.bind(this);
        this.sortTrigger = this.sortTrigger.bind(this);
        this.optionsTrigger = this.optionsTrigger.bind(this);
        this.handleSortDropDownChange = this.handleSortDropDownChange.bind(
            this
        );
        this.handleOptionsDropDownChange = this.handleOptionsDropDownChange.bind(
            this
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            let currentUrl = this.props.match.url;
            let today = todayRegex.test(currentUrl);
            let loading =
                todayRegex.test(currentUrl) || listsRegex.test(currentUrl);

            this.setState({ today: today, loading: loading, todos: [] });
            this.onRouteChanged();
        }
    }

    componentWillMount() {
        this.onRouteChanged();
    }

    onRouteChanged() {
        this.setState({ displayCompleted: false });
        let currentUrl = this.props.match.url;

        if (todayRegex.test(currentUrl)) {
            getTodosDueTillNow(moment().utc()).then(res => {
                if (res.requireLogin) this.logoutUser();
                else if (res.networkDown || res.error)
                    console.log('Network Down');
                else {
                    this.setState({ todos: res.todos, loading: false });
                }
            });
        } else if (listsRegex.test(currentUrl)) {
            let category = this.props.match.params.id;

            getTodoFromCategory(category).then(res => {
                if (res.requireLogin) this.logoutUser();
                else if (res.networkDown || res.error)
                    console.log('Network Down');
                else {
                    this.setState({ todos: res.todos, loading: false });
                }

                console.log(res.todos);
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
            else if (res.networkDown || res.error) console.log('Network Down');
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
            else if (res.networkDown || res.error) console.log('Network Down');
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
            selectedTodoObject: { title: '', priority: 0, notes: '' },
            deleteCategorySelected: false
        });
    }

    handleTodoDelete() {
        let id = this.state.selectedTodoObject.id;
        this.setState({ deleteLoading: true });

        deleteTodo(id).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown || res.error) {
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

    deleteList() {
        let categoryName = this.props.match.params.id;
        this.setState({ deleteLoading: true });

        deleteCategory(categoryName).then(res => {
            if (res.requireLogin) this.logoutUser();
            else if (res.networkDown || res.error) {
                console.log('Network Down');
                this.setState({
                    deleteLoading: false,
                    openDeleteModal: false,
                    deleteCategorySelected: false
                });
            } else {
                this.setState({
                    deleteLoading: false,
                    openDeleteModal: false,
                    deleteCategorySelected: false
                });
                this.props.removeCategory(categoryName);
                this.props.history.push('/dashboard/today');
            }
        });
    }

    deleteManager() {
        if (this.state.deleteCategorySelected) this.deleteList();
        else this.handleTodoDelete();
    }

    handleSortDropDownChange(event, { value }) {
        switch (value) {
            case 0:
                // Sort Due Date
                let dueTodos = this.state.todos.sort(
                    (a, b) =>
                        new Date(a.dueDate * 1000) - new Date(b.dueDate * 1000)
                );
                this.setState({ todos: dueTodos });
                break;
            case 1:
                // Sort Start Date
                let startTodos = this.state.todos.sort(
                    (a, b) =>
                        new Date(a.startDate * 1000) -
                        new Date(b.startDate * 1000)
                );
                this.setState({ todos: startTodos });
                break;
            case 2:
                // Sort Alphabetically
                let alphaTodos = this.state.todos.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                this.setState({ todos: alphaTodos });
                break;
            case 3:
                // Sort Completed
                let sortCompletedTodos = this.state.todos.sort(
                    (a, b) =>
                        a.completed === b.completed ? 0 : a.completed ? -1 : 1
                );
                this.setState({
                    todos: sortCompletedTodos,
                    displayCompleted: true
                });
                break;
            case 4:
                // Sort Added To My Day
                let dayTodos = this.state.todos.sort((a, b) => {
                    let date_1 = moment(a.dueDate * 1000);
                    let date_2 = moment(b.dueDate * 1000);

                    if (date_1.isBefore(date_2) && !a.completed) return 1;
                    if (date_2.isBefore(date_1) && !b.completed) return -1;
                    else return 0;
                });
                this.setState({ todos: dayTodos, displayCompleted: false });
                break;
            default:
                break;
        }
    }

    handleOptionsDropDownChange(event, { value }) {
        switch (value) {
            case 0:
                // Toggle Completed
                let completed = this.state.displayCompleted;
                this.setState({ displayCompleted: !completed });
                break;
            case 1:
                // Delete List
                this.setState({
                    deleteCategorySelected: true,
                    openDeleteModal: true,
                    displayCompleted: true
                });
                break;
            default:
                break;
        }
    }

    sortTrigger() {
        return (
            <span className="options-button">
                <Icon size="small" name="filter" />
                <span style={{ fontSize: '0.7em' }}>Sort</span>
            </span>
        );
    }

    optionsTrigger() {
        return (
            <span className="options-button">
                <Icon
                    name="ellipsis horizontal"
                    size="small"
                    style={{ marginRight: 0 }}
                />
            </span>
        );
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
                    handleDelete={this.deleteManager}
                    handleClose={this.deleteModalClosed}
                    loading={this.state.deleteLoading}
                    categorySelected={this.state.deleteCategorySelected}
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

                                {!this.state.today && (
                                    <Dropdown
                                        onChange={
                                            this.handleOptionsDropDownChange
                                        }
                                        options={
                                            this.state.optionsDropDownOptions
                                        }
                                        trigger={this.optionsTrigger()}
                                        icon={null}
                                        className="align-screen"
                                        header="List Options"
                                    />
                                )}
                                {!this.state.today && (
                                    <Dropdown
                                        trigger={this.sortTrigger()}
                                        onChange={this.handleSortDropDownChange}
                                        options={this.state.sortDropDownOptions}
                                        icon={null}
                                        className="align-screen"
                                        header="Sort"
                                    />
                                )}
                            </Header>
                        </Grid.Column>
                        <Grid.Column stretched className="padding-top">
                            <List divided verticalAlign="middle" relaxed>
                                {this.state.todos.map(element => {
                                    if (
                                        !this.state.displayCompleted &&
                                        element.completed
                                    )
                                        return null;

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

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            removeCategory: actionRemoveCategory
        },
        dispatch
    );
}

export default withRouter(connect(null, matchDispatchToProps)(TodoList));
