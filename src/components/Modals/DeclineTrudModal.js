import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";
import {Panel} from "../formComponents/ReusableComponents";
import {debounce} from "../../helperFunctions";
import TextField from 'material-ui/TextField';


const errorsModal = class errorsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    }
  }
  handleChange(e) {
    this.changeComment.call(this, e.target.value)
  }
  changeComment(val) {
    this.setState({
      comment: val
    })
  }
  answer(func) {
    this.setState({
      comment: ""
    });
    func();
  }
  render() {
    const props = this.props;
    if(!props.task || !props.labor) {
      return <div/>
    }
    let message = "Уверены, что хотите отклонить запись о трудозатрате?"
    let task = props.task;
    let labor = props.labor;
    return (
      <Modal
      isOpen={props.isModalOpen}
      contentLabel="Modal"
      style={{overlay: {zIndex: 8}}}
        className="medium-modal"
      >
      <Container vertical="true">
        <h4>
          {message}
        </h4>
        <Panel label="Задача">
          <span>{task.name}</span>
        </Panel>
        <Panel label="Количество часов">
          <span>{labor.value || labor.hours}</span>
        </Panel>
        <Panel label="Сотрудник">
          <span>{labor.author.name}</span>
        </Panel>
        <Panel label="Комментарий">
          <TextField
           hintText="Написать комментарий"
           multiLine={true}
           rows={2}
           rowsMax={6}
           onChange={this.handleChange.bind(this)}
           fullWidth={true}
           value={this.state.comment}
           />
        </Panel>
        <div flex="1">
          <FlatButton style={{float:"right"}} onClick={this.answer.bind(this, props.answer.bind(this, true, this.state.comment))} label="Да" />
          <FlatButton style={{float:"left"}} onClick={this.answer.bind(this, props.answer.bind(this, false))} label="Нет" />
        </div>
      </Container>
      </Modal>
    )
  }
}

export default errorsModal;