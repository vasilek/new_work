import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import close from "../../Icons/delete.svg";
import {Panel} from "../formComponents/ReusableComponents";

const changePwd = class passwordChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      newPassword: ""
    }
  }
  handlePassChange(e) {
    this.setState({
      password: e.target.value
    })
  }
  handleNewPassChange(e) {
    this.setState({
      newPassword: e.target.value
    })
  }
  savePwd() {
    this.props.savePassword.call(this, this.state.newPassword);
    this.setState({
      password: "",
      newPassword: ""
    });
  }
  render() {
    let message = "";
    const props = this.props;
    message = props.message;
    const passwordsEqual = (this.state.password === this.state.newPassword);
    const passwordLongEnough = (this.state.password.length >= 6);
    return (
      <Modal
      isOpen={props.isModalOpen}
      contentLabel="Modal"
      style={{overlay: {zIndex: 8}}}
      className="small-modal"
      >
      <img role="presentation"  className="clickable-image close-modal" onClick={props.closeModal.bind(this)}  src={close}/>
      <Container vertical="true">
        <Panel label="Новый пароль">
          <input className="passwordField" value={this.state.password} onChange={this.handlePassChange.bind(this)}/>
        </Panel>
         <Panel label="Повторите новый пароль">
          <input className="passwordField" value={this.state.newPassword} onChange={this.handleNewPassChange.bind(this)}/>
         </Panel>
         <span className={"warning-password " + ((passwordsEqual) ? " noDisplay " : "")}>Введённые пароли не совпадают</span>
      </Container>
      <FlatButton disabled={(passwordLongEnough && passwordsEqual ? false : true)} style={{float:"right"}} onClick={this.savePwd.bind(this)} label="Сохранить" />
      </Modal>
    )
  }
}

export default changePwd;