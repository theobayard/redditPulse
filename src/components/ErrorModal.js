import React, {useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

/**
 * @summary A modal that displays an error message
 * @prop {Error} err Error to display
 */
function ErrorModal(props) {
    const [show, setShow] = useState(true);
  
    const handleClose = () => setShow(false);
  
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>The following error has occured: {props.err.message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default ErrorModal;