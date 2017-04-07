import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";

const errorsModal = (props) => {
  let errorMessages = [];
  for(var i = 0; i < props.errors.length; i++) {
    errorMessages.push(<li key={i}> {props.errors[i]} </li>);
  }
  return (
    <Modal
    isOpen={props.isModalOpen}
    contentLabel="Modal"
    style={{overlay: {zIndex: 10}}}
    className="large-modal"
    >
    <Container vertical="true">
      <h2 flex="2"> Внимание! </h2>
      <ul flex="10">
        {errorMessages}
      </ul>
      <div flex="1">
        <FlatButton style={{float:"right"}} onClick={props.closeModal} label="ОК" />
      </div>
    </Container>
    </Modal>
  )
}

export default errorsModal;