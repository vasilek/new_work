import React from "react";
import "../styles/taskTable.css";
import AddTrudModal from "../Modals/AddTrudModal";
import Container from "../Container";
import right from "../../Icons/right.svg";
import left from "../../Icons/left.svg";
import moment from 'moment';
import calendar from "../../Icons/calendar.svg";
import DatePicker from 'react-datepicker';
import helpers from "../Table/tableHelpers";
import taskHelpers from "../Tasks/taskHelpers";
import tableGenerator from "../utils/tableGenerator";
import {RightPanelContainer} from "../../containers/Containers";
import LaborInfoContainer from "../../containers/LaborInfoContainer";
import ConfirmModalContainer from "../../containers/ModalContainers/ConfirmModalContainer";
import RightTablePanelContainer from "../../containers/Table/RightTablePanelContainer";


const datepickerStyles = {
  width: "100%",
  display: "flex",
  float: "right",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "white"
}

const fullSize = {
  width:"100%",
  height: "100%"
}

const datePicker = (props, range)=> (
  <div style={datepickerStyles}>
    <img className="clickable-image left" onClick={props.handlePrevWeek.bind(this,props.currentWeek)}  src={left} alt="logo" />
    <div className="dateContainer">
      <span className="weekVisualiser">{"Неделя " + helpers.getWeek(props.currentWeek) + " (" + moment(range.first).format("DD MMMM") + " - " + moment(range.last).format("DD MMMM") + ")" }</span>
      <img className="tableCalendar" src={calendar} alt="logo" />
      <DatePicker
        selected={props.currentWeek ? moment(props.currentWeek) : moment(new Date())}
        onChange={props.onDateSelect}
      />
    </div>
    <img className="clickable-image right" onClick={props.handleNextWeek.bind(this,props.currentWeek)}  src={right} alt="logo" />
  </div>
)

function createTable (tableData, props) {
  let config = {};
  let tdWidth = 1;
  if(!tableData.headers) return <div className="noDisplay"/>;
  config.renderRow = (td,name, elem) => {
    const executors = taskHelpers.createExecutors(elem.executors);
    return (
      <tr key={elem.id} className={elem.status===0 ? "unaccepted-task" : "" }>
        <td width="30%" className={`tableCell ${elem.id === props.activeIndexes.taskId? " active" : ''}`}
          onClick={props.rowClickHandler.bind(this, elem.timings, elem.id)}>
          {name} {executors} </td>
        {td}
      </tr>
    )
  }
  config.renderCell = (val, day, width) => {
    tdWidth = width;
    let comments = <div className="noDisplay"/>;
    if(val.commentsNumber > 0) {
      comments = <div className="comments-number">{val.commentsNumber}</div>
    }
    return (
      <td key={val.id+day} className={`tableCell ${val.hasUnaccepted ? ' has-unaccepted' : ''}` +
      `${val.id === props.activeIndexes.taskId && (day === props.currentDay || props.currentDay === false)? " active" : ''}`} width={width+"%"}
        onClick={props.cellClickHandler.bind(this, val.timings, val.id, day)}>{val.allHours ? (val.myHours + "/" + val.allHours) : 0}
      {comments}</td>
    )
  };
  const rowsObj = tableGenerator.generateRows(tableData, props, config, "dates");
  const rows = rowsObj.rows;
  const message = "Принять все трудозатраты за " + this.state.date + "?";
  const headers = helpers.generateHeaders(tableData.headers, tableData.datedLabors, this.openConfirm.bind(this));
  const range = helpers.getDateRange(props.currentWeek);
  const rightPanelContainerStyle = this.props.rightPanelStatus ? {} : {maxWidth: "0"};
  const rightPanelClass = this.props.rightPanelStatus  ? "" : "right-closed";
  let finalcells = [];
  for(let j = 0; j < tableData.headers.length; j++) {
    const valMy = tableData.overallDated[tableData.headers[j]].overallMy;
    const valTotal = tableData.overallDated[tableData.headers[j]].overallTotal;
    finalcells[j] = (
      <td key={98765+j} className="tableCell" width={tdWidth+"%"}>{valTotal ? (valMy + "/" + valTotal) : 0}</td>
    )
  }
  let finalRow = (
    <tr key={1234567} className="overall-row">
      <td width="30%" className="tableCell"> Итого </td>
      {finalcells}
    </tr>
  )
  return (
    <Container>
      <div className="tableContainer">
        {datePicker(props,range)}
        <div className="taskTable">
          <table className="taskTable" cellSpacing="0">
            <thead>
              <tr>
                {headers}
              </tr>
            </thead>
            <tbody>
              {rows}
              {finalRow}
            </tbody>
          </table>
          <AddTrudModal isModalOpen={props.isTrudModalOpen} closeModal={props.closeModal.bind(this)} onSubmit={props.handleTrudSubmit} containerStyle={{maxHeight: '0'}}/>
        </div>
      </div>
      <div className={`splitter ${(props.rightPanelStatus ? "" : "noDisplay")}`}/>
     <RightTablePanelContainer containerStyle={rightPanelContainerStyle} className={rightPanelClass}/>
     <ConfirmModalContainer containerStyle={{maxWidth: '0'}} isModalOpen={this.state.isModalOpen} message={message} answer={this.acceptAnswer.bind(this)}/>
    </Container>
  )
}



export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      date: "null",
      labors: []
    }
  }
  openConfirm(date, labors) {
    this.setState({
      date: date,
      labors: labors
    });
    this.setState({isModalOpen: true});
  }
  closeConfirm() {
    this.setState({isModalOpen: false});
  }
  acceptAnswer(answer) {
    this.closeConfirm.bind(this)();
    if(answer) {
      this.props.acceptAll(this.state.labors);
    }
  }
  render() {
    const props = this.props;
    const searchQuery = props.searchQuery;
    if(this.props.tableData.data) {
      for(let e in this.props.tableData.data) {
        this.props.tableData.data[e].ignored = ~e.toUpperCase().indexOf(searchQuery.toUpperCase()) ? false : true;
      }
    }
    return createTable.call(this,props.tableData, props);
  }
}