import React from "react";
import Container from "../Container";
import "../styles/TaskInfo.css";
import calendar from "../../Icons/calendar.svg";
import { Field, reduxForm,change } from 'redux-form';
import {connect} from 'react-redux';
import DPicker from "../formComponents/DatePicker";
import {debounce} from "../../helperFunctions";
import TaskCommentsTabContainer from "../../containers/Task/TaskCommentsTabContainer";
import {WorkCodeField, FinancesField,NameField, Panel, HoursField} from "../formComponents/ReusableComponents";
import Icon from "../../Icons/Icon";
import Select from 'react-select';
import DeclineTrudModalContainer from "../../containers/ModalContainers/DeclineTrudModalContainer";
import ConfirmModalContainer from "../../containers/ModalContainers/ConfirmModalContainer";
import ReactTooltip from 'react-tooltip';


const codeBlockStyle = {
  minHeight: "76px"
}

const headerBlockStyle = {
  minHeight: "56px"
}

const ImagePanel = ({acceptTrud, returnToTask, status, declineTrud,rights, deleteTrud, context}) => (
  <div style={{display: 'flex', justifyContent: "flex-end"}}>
    <div style={{marginRight:"15px", display: "flex", flexDirection:"row"}}>
      <div data-tip="Вернуться">
        <Icon name="cursor" className={`clickable-image comment`} onClick={returnToTask}/>
      </div>
      <div data-tip={rights.accept ? "Подтвердить" : "Нет прав на подтверждение"} className={`${((status !== "Новая")) ? "noDisplay" : ''} `}>
        <div className={(rights.accept ? "" : "disabled")}>
          <Icon name="acceptTrud" className={`clickable-image comment `  + (rights.accept ? "" : "disabled")}
             onClick={context.startQuestion.bind(context,"accept")}/>
        </div>
      </div>
      <div data-tip={rights.accept ? "Отклонить" : "Нет прав на отклонение"} className={((status !== "Отклонена") ? "" : "noDisplay")}>
        <div className={(rights.accept ? "" : "disabled")}>
          <Icon name="decline" className={`clickable-image comment `  + (rights.accept ? "" : "disabled")}
           onClick={context.startQuestion.bind(context,"decline")}/>
        </div>
      </div>
    </div>
    <div style={{width:"1px", borderRight: "1px solid black"}}></div>
    <div data-tip={rights.delete ? "Удалить" : "Нет прав на удаление"}>
      <div style={{marginLeft:"15px"}} className={(rights.delete ? "" : "disabled")}>
        <Icon className={`clickable-image ellipsis ${(rights.delete ? "" : "disabled")}`} onClick={context.startQuestion.bind(context,"delete")}   name="rubbish-bin"  />
      </div>
    </div>
  </div>
);


const  LaborInfoComponent =  class newLaborInfo extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
     open: false,
     executorsFieldActive: false,
    author_val: props.author_val,
    isModalOpen: false,
    isDeclineModalOpen: false,
    message: "OK",
    currentQuestion: () => {}
    };
    this.handleDebounce = debounce(this.handleEdit, 400);
  }
  handleEdit(e) {
    setTimeout(() => {this.refs.sbmt.click()});
  }
  handleSelectChange(val) {
    const user = val;
    this.props.changeFieldValue('author_val', val)
    this.setState({
      author_val: user
    })
    this.handleDebounce();
  }
  startQuestion(type) {
    if(type === "decline") {
      this.setState({
        currentQuestion: this.declineAnswer,
        message: "Уверены, что хотите отклонить трудозатрату?",
        isDeclineModalOpen: true,
      });
    } else {
      this.setState({
        currentQuestion: this.acceptAnswer,
        message: "Уверены, что хотите подтвердить трудозатрату?",
        isModalOpen: true
      });
    } if(type==="delete") {
      this.setState({
        currentQuestion: this.deleteAnswer,
        message: "Уверены, что хотите удалить трудозатрату?",
        isModalOpen: true
      });
    }
  }
  acceptAnswer(answer) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.acceptTrud(this.props.labor);
    }
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  componentDidMount() {
    ReactTooltip.rebuild();
  }
  deleteAnswer(answer) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.deleteTrud.call(this, this.props.labor);
    }
  }
  declineAnswer(answer, comment) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.declineTrud(this.props.labor, comment)
    }
  }
  closeConfirm() {
    this.setState({isModalOpen: false, isDeclineModalOpen: false});
  }
  render () {
    const props=this.props;
    const labor = props.labor;
    const {handleSubmit} = props;
    const debouncedFetch = debounce((query, callback) => {
      if(!query) {
        callback(null,{options: []});
      }
      fetch(`/data/searchusers?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: 'include'
        })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if(!json.data) {
            callback(null,{options: []});
            return;
          }
          callback(null,{ options: json.data.users.map(x => ({value: x.id, label: x.name})) });
        });
    }, 500);
    if(!labor.id && (labor.id!== 0)) {
      return <div/>;
    } else {
      return (
        <form onSubmit={handleSubmit} className={labor.rights.update ? "" : "no-update"} style={{display:"flex", flexDirection:"column", height: "100%"}}>
          <Container vertical={true} className="labor-info-container">
            <div className="infoHeader" flex="1">
              <Container style={{justifyContent: "space-between"}}>
                <div ref="executorsSelect" className="infoHeaderBlock" style={{display: 'flex', justifyContent: "flex-begin"}}>
                  <div>
                    <img className="user" src={calendar} alt="logo" />
                    <Field name="startDate" newOnChange={this.handleDebounce.bind(this)}   component={DPicker}/>
                  </div>
                </div>
                <div>
                  <ImagePanel rights={labor.rights}
                  declineTrud={this.props.declineTrud.bind(this, labor)}
                  acceptTrud={this.props.acceptTrud.bind(this, labor)} returnToTask={props.returnToTask.bind(this, labor)}
                  context={this}
                  status={labor.status} />
                </div>
              </Container>
            </div>
            <Container className="labor-main-container" vertical={true} flex="11" height="auto" containerStyle={{overflowY: "auto", overflowX: 'hidden', paddingTop: "25px"}}>
                <h2 flex="1" containerStyle={headerBlockStyle} style={{margin:"5px", marginBottom: "20px"}}>
                    {labor.task_name}
                </h2>
                <Container flex="3" containerStyle={codeBlockStyle}>
                  <Panel label="Количество часов">
                    <Field name="hours" handleChange={this.handleDebounce.bind(this)}  component={HoursField} />
                  </Panel>
                  <Panel label="Код работ">
                    <WorkCodeField codes={this.props.codes} debouncedUpdate={this.handleDebounce.bind(this)}/>
                  </Panel>
                </Container>
                <Panel label="Исполнитель">
                  <Select.Async multi={false} value={this.state.author_val}
                  onChange={this.handleSelectChange.bind(this)}
                  searchPromptText="Введите имя пользователя"
                    placeholder="Список выбранных сотрудников"
                    backspaceRemoves={false}
                    ignoreCase={true}
                  loadOptions={debouncedFetch} />
                </Panel>
                <Panel label="Комментарий к трудозатрате">
                  <Field name="comment"  handleChange={this.handleDebounce.bind(this)} placeholder="Комментарий к трудозатрате"  component={NameField} />
                </Panel>
                <div>
                  <TaskCommentsTabContainer sendComment={props.sendComment.bind(this, labor)} task={labor}/>
                </div>
            </Container>
          </Container>
          <input type="submit"  ref="sbmt" style={{display:"none"}}/>
            <DeclineTrudModalContainer containerStyle={{maxHeight: '0', maxWidth: '0'}} isModalOpen={this.state.isDeclineModalOpen}
                labor={this.props.labor}
                answer={this.state.currentQuestion.bind(this)}/>
                <ConfirmModalContainer containerStyle={{maxHeight: '0', maxWidth: '0'}} isModalOpen={this.state.isModalOpen} message={this.state.message}
                  answer={this.state.currentQuestion.bind(this)}/>
        </form>
        )
      }
    }
}

let laborForm = reduxForm({
  form: "laborInfoDialogForm",
  enableReinitialize: true
})(LaborInfoComponent);

laborForm = connect(
  state => {
    let authorVal = false;
    if(state.laborView) {
      authorVal = {value: state.laborView.author.id, label: state.laborView.author.name};
    }
    return ({
    initialValues: Object.assign(state.laborView,{author_val :authorVal} ),
    author_val : authorVal
  })},
  function(dispatch) {
    return {
        // This will be passed as a property to the presentational component
        changeFieldValue: function(field, value) {
            dispatch(change('laborInfoDialogForm', field, value))
        }
    }
  }
)(laborForm);

export default laborForm;