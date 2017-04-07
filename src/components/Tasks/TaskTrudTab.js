import React from "react";
import Container from "../Container";
import "../styles/TaskTrudTab.css";
import openTrud from "../../Icons/fast-forward.svg";
import moment from "moment";
import helpers from "./taskHelpers";
import 'moment/locale/ru';
import Icon from "../../Icons/Icon";
import ConfirmModalContainer from "../../containers/ModalContainers/ConfirmModalContainer";
import DeclineTrudModalContainer from "../../containers/ModalContainers/DeclineTrudModalContainer";
import ReactTooltip from 'react-tooltip';

const statusDict = {
  "Новая": "new-task",
  "Подтверждена": "accepted-task",
  "Отклонена": "declined-task"
}

const generateLaborsBlock = function(laborGroup,props) {
  let labors = [<div key={laborGroup[0].startDate} className="timeDateCommentLabel">------{moment(laborGroup[0].startDate).format("LL").toString()}------</div>];
  for(var i = 1; i <= laborGroup.length; i++) {
    let labor = laborGroup[i-1];
    let comments = helpers.generateComments(labor.comments);
    labors[i] =  (
      <Container vertical="true" className={`laborBlock ${statusDict[labor.status]}`} key={labor.id}>
        <Container style={{margin: "5px"}} width="auto" flex="8">
          <div flex="8">
            <Container style={{justifyContent: "space-between"}}>
                <div style={{flex:"3"}}>{labor.author.name}</div>
                <div style={{flex:"2", fontWeight:"bold"}}>{labor.value} часов</div>
                <div data-tip={labor.code.label + ", " + labor.code.description} style={{flex:"2", fontWeight:"bold"}}>{labor.code.label}</div>
            </Container>
            <span className="commentButton" onClick={props.openComments.bind(this,labor.id)}>Показать комментарии({labor.comments.length})</span>
            <div className={"trudCommentsBlock " + (labor.commentsOpened ? "opened" : "closed")}>
              {comments}
            </div>
          </div>
          <div flex="1" style={{height:"100%"}}>
            <div style={{height:"100%"}} data-tip={labor.rights.accept ? "Подтвердить" : "Нет прав на подтверждение"} className={`${(labor.status !== "Новая") ? "noDisplay" : ''}`}>
              <Icon name="acceptTrud" className={`clickable-image openTrud ` + (labor.rights.accept ? "" : "disabled")}
                onClick={this.startQuestion.bind(this,"accept", labor)}/>
            </div>
          </div>
          <div flex="1" style={{height:"100%"}} className={((labor.status !== "Отклонена") ? "" : "noDisplay")}>
            <div data-tip={labor.rights.accept ? "Отклонить" : "Нет прав на отклонение"} style={{height:"100%"}}>
              <Icon name="decline" className={`clickable-image openTrud ` + (labor.rights.accept ? "" : "disabled")}
                onClick={this.startQuestion.bind(this,"decline", labor)}/>
            </div>
          </div>
          <div flex="1">
            <div data-tip="Открыть">
              <img className="clickable-image openTrud" src={openTrud} onClick={() => {setTimeout(ReactTooltip.hide,100); props.openTrud.call(this, labor)}} alt="logo" />
            </div>
          </div>
        </Container>
      </Container>
    )
  }
  return labors;
}

export default class TrudTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isModalOpen: false,
        isDeclineModalOpen: false,
        message: "OK",
        selectedLabor: null,
        currentQuestion: () => {}
    }
  }
  startQuestion(type, labor) {
    if(type === "decline") {
      this.setState({
        selectedLabor: labor,
        currentQuestion: this.declineAnswer,
        message: "Уверены, что хотите отклонить трудозатрату?",
        isDeclineModalOpen: true,
      });
    } else {
      this.setState({
        selectedLabor: labor,
        currentQuestion: this.acceptAnswer,
        message: "Уверены, что хотите подтвердить трудозатрату?",
        isModalOpen: true
      });
    }
  }
  acceptAnswer(answer) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.acceptTrud(this.state.selectedLabor);
    }
  }
  declineAnswer(answer, comment) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.declineTrud(this.state.selectedLabor, comment)
    }
  }
  closeConfirm() {
    this.setState({isModalOpen: false, isDeclineModalOpen: false});
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  render() {
    const props = this.props;
    let labors = [];
    const groups = props.type === "table" ? props.groupsTable : props.groups;
    for(var i = 0; i < Object.keys(groups).length; i++) {
      labors[i] = generateLaborsBlock.call(this, groups[Object.keys(groups)[i]],props);
    }
    labors = [].concat.apply([], labors);
    if(labors.length > 0) {
      return (
        <div>
          <div>
            {labors}
          </div>
          <ConfirmModalContainer containerStyle={{maxHeight: '0', maxWidth: '0'}} isModalOpen={this.state.isModalOpen} message={this.state.message}
            answer={this.state.currentQuestion.bind(this)}/>
          <DeclineTrudModalContainer containerStyle={{maxHeight: '0', maxWidth: '0'}} isModalOpen={this.state.isDeclineModalOpen}
              labor={this.state.selectedLabor}
              answer={this.state.currentQuestion.bind(this)}/>
        </div>
      )
    } else {
      return <div/>;
    }
  }
}