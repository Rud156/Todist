import React, { Component } from 'react';

import { Modal } from 'semantic-ui-react';

class EditableModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true
        };

        this.handleClose = this.handleClose.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ open: nextProps.open });
    // }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        return (
            <Modal dimmer='blurring' open={this.state.open} onClose={this.handleClose}>
                <Modal.Header>Hello World</Modal.Header>
            </Modal>
        );
    }
}

export default EditableModal;