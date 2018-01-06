import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal, Form, Button } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { numberRegex } from '../../utils/constants';
import { actionDisplayMessage } from '../../actions/NotificationAction';
import { updateTodo } from '../../utils/api';

class EditableModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            dateDisabled: false,
            priority: 0,
            note: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleNoteshange = this.handleNoteshange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            date: moment.utc(nextProps.todoObject.dueDate * 1000).toDate(),
            priority: nextProps.todoObject.priority,
            note: nextProps.todoObject.note
        });
    }

    handleSubmit() {
        if (this.state.dateDisabled) {
            return;
        }


        let priority = this.state.priority;
        let note = this.state.note;
        let date = moment(this.state.date).utc().format('YYYY-MM-DD');
        let id = this.props.todoObject.id;

        updateTodo(id, date, note, priority)
            .then(res => {
                if (res.requireLogin || res.networkDown)
                    this.props.displayNotification(
                        'Unable to process request. Please try again later',
                        Date.now(),
                        'error'
                    );
                else {
                    this.props.displayNotification('Todo Updated', Date.now(), 'success');
                    this.props.handleClose();
                }
            });

    }

    handleDateChange(date, modifiers) {
        this.setState({
            date,
            dateDisabled: modifiers.disabled
        });
    }

    handlePriorityChange(event) {
        let value = event.target.value;
        if (numberRegex.test(value))
            this.setState({ priority: value });
    }

    handleNoteshange(event) {
        this.setState({ note: event.target.value });
    }

    render() {
        return (
            <Modal dimmer='blurring' open={this.props.isOpen} onClose={this.props.handleClose} size='mini'>
                <Modal.Header>{this.props.todoObject.title}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label>Due Date</label>
                            <DayPickerInput
                                value={this.state.date}
                                onDayChange={this.handleDateChange}
                                dayPickerProps={{
                                    disabledDays: [
                                        {
                                            before: new Date()
                                        }
                                    ]
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Priority</label>
                            <input
                                type='number'
                                value={this.state.priority}
                                onChange={this.handlePriorityChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Notes</label>
                            <textarea
                                value={this.state.note}
                                onChange={this.handleNoteshange}
                                rows={3}
                            >
                            </textarea>
                        </Form.Field>
                        <Button
                            type='submit'
                            fluid
                            color='blue'
                        >
                            Update Todo
                        </Button>
                    </Form>
                    <Button
                        fluid
                        color='red'
                        className='margin-top'
                    >
                        Delete Todo
                        </Button>
                </Modal.Content>
            </Modal>
        );
    }
}

EditableModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    todoObject: PropTypes.object.isRequired
};

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        displayNotification: actionDisplayMessage
    }, dispatch);
}

export default connect(null, matchDispatchToProps)(EditableModal);