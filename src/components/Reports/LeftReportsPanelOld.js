import React from "react";
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Select from 'react-select';
import {Panel} from "../formComponents/ReusableComponents";
import moment from 'moment';
import calendar from "../../Icons/calendar.svg";
import DatePicker from 'react-datepicker';
import right from "../../Icons/right.svg";
import left from "../../Icons/left.svg";
import helpers from "../Table/tableHelpers";
import {debounce} from "../../helperFunctions";

const datepickerStyles = {
  width: "100%",
  display: "flex",
  float: "right",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "white"
}

var CustomInput = React.createClass({
  render () {
    return (
      <div  onClick={this.props.onClick} className="tableWeekContainer">
      <img className="tableCalendar" src={calendar} alt="logo" />
      {this.props.visualized}
      </div>
    )
  }
});



const datePicker = (props, range, isMonth)=> (
  <div style={datepickerStyles}>
    <img className="clickable-image left" onClick={isMonth ? props.handlePrevMonth.bind(this,props.currentWeek) : props.handlePrevWeek.bind(this,props.currentWeek)}  src={left} alt="logo" />
    <div className="dateContainer">
      <DatePicker   customInput={<CustomInput visualized={<span className="weekVisualiser">{
        isMonth ?
        moment(range.first).format("MMMM YYYY").toUpperCase()
        :
        ("Неделя " + helpers.getWeek(props.currentWeek) + " (" + moment(range.first).format("DD MMMM") + " - " + moment(range.last).format("DD MMMM") + ")" )}</span>}/>}
        selected={props.currentWeek ? moment(props.currentWeek) : moment(new Date())}
        onChange={isMonth? props.onDateMonthSelect : props.onDateSelect}
      />
    </div>
    <img className="clickable-image right" onClick={isMonth ? props.handleNextMonth.bind(this,props.currentWeek) : props.handleNextWeek.bind(this,props.currentWeek)}  src={right} alt="logo" />
  </div>
)


export default class Labors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUsers: [],
      selectedTasks: [],
      selectedFinances: [],
      currentRadio: "tasks",
      task_ids: [],
      user_ids: [],
      finance_ids: [],
      currentUser: false,
      user_id: false
    }
  }
  createReport(radio) {
    if(radio==="tasks") {
      this.props.createTaskReport(this.state);
    } else if(radio ==="finance") {
      this.props.createFinanceReport(this.state);
    } else if(radio ==="table"){
      this.props.createUserReport(this.state);
    }
  }

  radiogroupChanged(event, val) {
    if(val === "tasks" ) {
      this.setState({
        currentRadio: val,
        finance_ids: [],
        selectedFinances: [],
        currentUser: false,
        user_id: false
      });
    } else if(val === "finance") {
      this.setState({
        currentRadio: val,
        task_ids: [],
        selectedTasks: [],
        currentUser: false,
        user_id: false
      });
    } else {
      this.setState({
        currentRadio: val,
        task_ids: [],
        selectedTasks: [],
        finance_ids: [],
        selectedFinances: []
      });
    }
    this.props.radioChanged();
  }
  handleSelectChange(vals) {
    const user_ids = vals.map(x => x.value);
    this.props.getTasksForUsers(user_ids);
    this.setState({
      user_ids: user_ids,
      selectedUsers: vals
    })
  }
  handleSingleSelectChange(val) {
    this.setState({
      user_id: val.value,
      currentUser: val
    })
  }
  handleTaskSelectChange(vals) {
    const task_ids = vals.map(x => x.value);
    this.setState({
      task_ids: task_ids,
      selectedTasks: vals
    })
  }
  disableClick(disable) {
    if(!disable) {
      setTimeout(() => this.setState({ disableClick: disable }), 700);
    } else {
      this.setState({ disableClick: disable });
    }
    return true;
  }
  handleFinanceSelectChange(vals) {
    const finance_ids = vals.map(x => x.value);
    this.setState({
      finance_ids: finance_ids,
      selectedFinances: vals
    })
  }
  render () {
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
  const radio = this.state.currentRadio;
  const range = radio === "table" ? helpers.getDateMonthRange(props.currentWeek) : helpers.getDateRange(props.currentWeek);
  let reportSelector = <div/>;
  switch (radio) {
    case "tasks":
      reportSelector = (
        <Select
            multi={true}
            placeholder="Задачи"
            value={this.state.selectedTasks}
            onChange={this.handleTaskSelectChange.bind(this)}
            options={this.props.currentTasks}
        />
      )
      break;
    case "finance":
      reportSelector = (
        <Select  value={this.state.selectedFinances}
            multi={true}
            placeholder="Статьи финансирования"
            value={this.state.selectedFinances}
            onChange={this.handleFinanceSelectChange.bind(this)}
            options={
                this.props.finances
            } // <-- Receive options from the form
            />
      )
      break
    default:
      reportSelector = <div className="noDisplay"/>
  }
  return (
    <Container vertical={true}>
      <h3 className="reports-header"> Сотрудник{radio !== "table" ? "и" : ""} </h3>
      <div className="user-report-select" flex="2">
        <Select.Async multi={true} value={this.state.selectedUsers}
        onChange={this.handleSelectChange.bind(this)}
        searchPromptText="Введите имя пользователя"
          placeholder={"Список выбранных сотрудников"}
          backspaceRemoves={false}
          ignoreCase={true}
          onFocus={this.disableClick.bind(this, true)}
          onBlur={this.disableClick.bind(this, false)}
        loadOptions={debouncedFetch} />
      </div>
      <div className={"elements-report-select"} flex="4">
        <RadioButtonGroup className={"report-type-choose-radio " +  (this.state.disableClick  ? "no-events-tree" : "")} name="user_type" valueSelected={this.state.currentRadio} onChange={this.radiogroupChanged.bind(this)}>
          <RadioButton
            value="tasks"
            label="Задачи"
          />
          <RadioButton
            value="finance"
            label="Статьи финансирования"
          />
          <RadioButton
            value="table"
            label="Табель"
          />
        </RadioButtonGroup>
        {reportSelector}
      </div>
      {datePicker(props,range,radio === "table")}
      <div className="button-report-create" flex="1">
        <FlatButton style={{float:"right"}} onClick={this.createReport.bind(this,radio)} label="Создать отчет" />
      </div>
    </Container>
    )
  }
}