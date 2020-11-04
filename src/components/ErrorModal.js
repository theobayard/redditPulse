import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useAPIError} from './ErrorContextProvider'

/**
 * @summary A modal that displays an error message
 * @prop {Error} err Error to display
 */
function ErrorModal(props) {
  const { errorMessage, removeError } = useAPIError();

  const handleClose = () => {
    removeError();
  };
  
  return (
    <>
      <Modal show={!!errorMessage} onHide={handleClose}>
        <Modal.Header closeButton>
      <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>The following error has occured: {errorMessage}</Modal.Body>
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