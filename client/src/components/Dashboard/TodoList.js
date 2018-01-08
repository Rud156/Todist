import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { todayRegex, listsRegex } from './../../utils/constants';
import {
    getTodoFromCategory,
    getTodoDueOn,
    setTodoState,
    addTodo,
    deleteTodo,
    deleteCategory
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

            displayForm: false,
            todoTitle: '',

            openEditableModal: false,
            openDeleteModal: false,
            selectedTodoObject: { title: '', priority: 0, notes: '' },
            deleteLoading: false,
            deleteCategorySelected: false,

            dropDownOptions: [
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
                { key: 5, text: 'Sort Added To My Day', value: 4, icon: 'sun' },
                {
                    key: 6,
                    text: 'Toggle Completed',
                    value: 5,
                    icon: 'check square'
                },
                { key: 7, text: 'Delete List', value: 6, icon: 'trash' }
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
        this.handleDropDownChange = this.handleDropDownChange.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.deleteManager = this.deleteManager.bind(this);
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
        let currentUrl = this.props.match.url;

        if (todayRegex.test(currentUrl)) {
            getTodoDueOn(moment().utc()).then(res => {
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
            openDeleteListModal: false
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
                this.setState({ deleteLoading: false });
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

    handleDropDownChange(event, { value }) {
        switch (value) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                this.setState({
                    deleteCategorySelected: true,
                    openDeleteModal: true
                });
                break;
            default:
                break;
        }
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
                {/* <DeleteListModal
                    open={this.state.openDeleteListModal}
                    handleDelete={this.deleteList}
                    handleClose={this.deleteModalClosed}
                    loading={this.state.deleteLoading}
                /> */}
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
                                        inline
                                        onChange={this.handleDropDownChange}
                                        options={this.state.dropDownOptions}
                                        trigger={<span />}
                                        style={{
                                            float: 'right'
                                        }}
                                    />
                                )}
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

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            removeCategory: actionRemoveCategory
        },
        dispatch
    );
}

export default withRouter(connect(null, matchDispatchToProps)(TodoList));
