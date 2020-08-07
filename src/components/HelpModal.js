import React from 'react'
import {Button, Modal} from 'react-bootstrap'

/**
 * @summary A modal that displays an error message
 * @prop body body of help information to display
 */
function HelpModal(props) {
    return (
      <>
        <Modal show={props.show} onHide={props.handleClose} size="lg">
          <Modal.Header closeButton>
        <Modal.Title>Help</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.body}</Modal.Body>
          <Modal.Footer>
            <Button onClick={props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default HelpModal;