import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';

class Notification extends Component {
    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.notification.id !== nextProps.notification.id) {
            let length = nextProps.notification.messages.length;
            this.notificationSystem.addNotification({
                message: nextProps.notification.messages[length - 1].message,
                level: nextProps.notification.messages[length - 1].type,
                autoDismiss: 0
            });
        }
    }

    render() {
        return (
            <div>
                <NotificationSystem ref='notificationSystem' />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        notification: state.notification
    };
}

export default connect(mapStateToProps)(Notification);