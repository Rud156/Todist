import React from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';

const DeleteModal = ({
    open,
    handleDelete,
    handleClose,
    loading,
    categorySelected
}) => {
    return (
        <Modal dimmer="blurring" open={open} onClose={handleClose} size="tiny">
            <Modal.Content>
                <Header>
                    Do you really want to remove this{' '}
                    {categorySelected ? 'List' : 'Todo'}?
                </Header>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="trash"
                    content="Delete"
                    onClick={handleDelete}
                    loading={loading}
                    disabled={loading}
                    color="red"
                />
                <Button
                    icon="close"
                    content="Close"
                    onClick={handleClose}
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default DeleteModal;
