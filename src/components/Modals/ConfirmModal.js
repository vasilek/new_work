import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";


const errorsModal = (props) => {
  let message = "";
  message = props.message;
  return (
    <Modal
    isOpen={props.isModalOpen}
    contentLabel="Modal"
    style={{overlay: {zIndex: 8}}}
    className="small-modal"
    >
    <Container vertical="true">
      <div className="confirm-text" flex="10">
        {message}
      </div>
      <div flex="1">
        <FlatButton style={{float:"right"}} onClick={props.answer.bind(this, true)} label="Да" />
        <FlatButton style={{float:"left"}} onClick={props.answer.bind(this, false)} label="Нет" />
      </div>
    </Container>
    </Modal>
  )
}

export default errorsModal;