import React from "react"
import Modal from 'react-modal';
import Container from "../Container";
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import close from "../../Icons/delete.svg";
import 'react-datepicker/dist/react-datepicker.css';
import {debounce} from "../../helperFunctions";
import { Field, reduxForm ,change} from 'redux-form'
import "../styles/Modal.css";
import DPicker from "../formComponents/DatePicker";
import calendar from "../../Icons/calendar.svg";
import moment from 'moment';
import Select from 'react-select';
import {
    connect
} from 'react-redux';
import {WorkCodeField, FinancesField, HoursField, Panel,StandardField} from "../formComponents/ReusableComponents";

const commentField = ({ input, label, meta: { touched, error } }) => {
  return (
    <TextField
     hintText="Написать комментарий"
     multiLine={true}
     rows={2}
     rowsMax={6}
     fullWidth={true}
     {...input}/>
  );
}


const dialog = class addTrudModalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author_val: props.author_val
    }
  }
  handleSelectChange(val) {
    const user = val;
    this.props.changeFieldValue('author_val', val)
    this.setState({
      author_val: user
    })
  }
  closeModal() {
    this.setState({
      author_val: {id: 0, name:0}
    });
    this.props.closeModal.bind(this)();
  }
  submitForm() {
    this.setState({
      author_val: {id: 0, name:0}
    });
    setTimeout(() => {this.refs.sbmt.click()});
  }
  render() {
  const props = this.props;
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
  const { handleSubmit } = props;
  let author_val = null;
  if(!this.state.author_val.value) {
    author_val = props.author_val;
  } else {
    author_val = this.state.author_val;
  }
  return (
      <Modal
      isOpen={props.isModalOpen}
      contentLabel="Modal"
      className="medium-modal long"
    >
    <img role="presentation"  className="clickable-image close-modal" onClick={this.closeModal.bind(this)}  src={close}/>
    <form className="modalForm" onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column"}}>
    <Container vertical="true" >
         <h2>{props.trudTask ? props.trudTask.title : ""}</h2>
         <Container flex="2" className="responsive-vertical">
           <Panel label="Количество часов">
             <Field name="hours"  component={HoursField} />
           </Panel>
            <Panel label="Код работ">
              <WorkCodeField codes={props.codes}/>
            </Panel>
        </Container>
        <Panel label="Исполнитель">
          <Select.Async multi={false} value={author_val}
          onChange={this.handleSelectChange.bind(this)}
          searchPromptText="Введите имя пользователя"
            placeholder="Список выбранных сотрудников"
            backspaceRemoves={false}
            ignoreCase={true}
          loadOptions={debouncedFetch} />
        </Panel>
        <div className="taskDate">
          <span> Дата: </span>
          <Field name="startLaborDate" component={DPicker}/>
          <img className="rightCalendar" src={calendar} alt="logo" />
        </div>
        <div flex="5" className="comment-field">
          <Field name="comment" component={commentField}/>
         </div>
        <FlatButton className="save-task-button" onClick={this.submitForm.bind(this)} label="Сохранить" />
        <input type="submit" ref="sbmt" style={{display:"none"}}/>
    </Container>
    </form>
    </Modal>
    )
  }
}

let dialogForm = reduxForm({
  form: "trudDialogForm",
  enableReinitialize: true
})(dialog);

function swapDate(d) {
  const a = d.split('.');
  return a[1] + "." + a[0];
}

dialogForm = connect(
  state => {
    const date = state.Table.currentDay ? (`${swapDate(state.Table.currentDay)}.${state.Table.currentWeek.getFullYear()}`).split(".").join("/") : new Date();
    const currentDate = moment(date);
    let currentUser = state.currentAddingTrudTask.user;
    if(!currentUser) {
      currentUser = {id: 0, name:0};
    }

    return ({
    initialValues: Object.assign(state.currentAddingTrudTask, {startLaborDate: currentDate}, {author_val : {value: currentUser.id, label: currentUser.name}}),
    author_val: {value: currentUser.id, label: currentUser.name}
  })},
  function(dispatch) {
    return {
        // This will be passed as a property to the presentational component
        changeFieldValue: function(field, value) {
            dispatch(change('trudDialogForm', field, value))
        }
    }
  }
)(dialogForm);

export default dialogForm;