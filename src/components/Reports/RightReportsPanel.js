import React from "react";
import * as helpers from "../../helperFunctions";
import Icon from "../../Icons/Icon";
import Container from "../Container";
import moment from "moment";
import thelpers from "../Table/tableHelpers";
import {getDateMonthRange} from "../../redux/actions/tableActions";




export default class RightTaskPanel extends React.Component {
    getInitialState() {

    }


    componentWillMount() {
        if (this.props.departments.treeNormalized && this.props.Y.user){
            this.props.loadDepartment(this.props.departments.treeNormalized.byId[this.props.Y.user.department][0]);
        }
    }

  render() {
    const props = this.props;
    var chiefName = '';
    var chiefPosition = '';
    console.log("RIGHT PANEL PROPS, ", props)
      // try {
      //     console.log(props.department.chiefs);
      // } catch(ex){
          // console.log(123);
      // }
    // }
    // console.log("(((((((((((");
    const firstDay = props.weekPeriod.first;
    const lastDay = props.weekPeriod.last;
    const currentWeek = props.currentWeek;
    let reportsTable = props.reportsTable;
    const userName = props.name;
    const userPosition = props.position;
    if (props.department){
        chiefName = props.department.chiefs[0].name;
        chiefPosition = props.department.chiefs[0].position;
    }

    if(!reportsTable.users && reportsTable[0] !== "none") {
        const range = thelpers.getDateRange(props.currentWeek);
        console.log("range", range)
        // const dateRangeWords = "c " + moment(range.first).format("DD MMMM") + " по " + moment(range.last).format("DD MMMM");
        const dateRangeWords = "c " + moment(firstDay).format("DD MMMM") + " по " + moment(lastDay).format("DD MMMM");
        if(props.reportsTable.data.length) {
          let table = helpers.getTasksReportTable(reportsTable);
          const exportToExcel = helpers.exportReportToExcel;
          return (
          <Container vertical={true}>
            <div flex="1" className="reportHeaderContainer">
              <h4 className="reports-header"><span>{"Отчет за период " + dateRangeWords}</span> <Icon name="excel" onClick={exportToExcel.bind(this, table.data.data, [""].concat(table.data.headers))} className={`clickable-image excel-download-icon right-float`}/></h4>
            </div>
            <div flex="11">{table.element}</div>
          </Container>
          );
        } else {
          return <div className="noDisplay"/>
        }
    } else {
                const exportHtmlToExcel = helpers.exportHtmlToExcel;
      if(props.reportsTable.users && props.reportsTable.users[0].days.length) {
        let range = getDateMonthRange(currentWeek);
        const dateRangeWords = "c " + moment(range.first).format("DD") + " по " + moment(range.last).format("DD MMMM") + " " +  moment(range.last).format("YYYY") + "г";
        // let table = thelpers.generateUserReportTable(props.reportsTable.users, dateRangeWords);
        let table = thelpers.generateUserReportTable(props.reportsTable.users, dateRangeWords, userName, userPosition, chiefName, chiefPosition);
        return (
          <Container vertical={true}>
            <div flex="1" className="reportHeaderContainer">
                <h4 className="reports-header"><span>{"Отчет за период " + dateRangeWords}</span> <Icon name="excel" onClick={exportHtmlToExcel.bind(this)} className={`clickable-image excel-download-icon right-float`}/></h4>
            </div>
            <div flex="11">
              <table  id="reports-table"  className="tg">
                <tbody>
                  {table}
                </tbody>
              </table>
            </div>
          </Container>
        )
      } else {
        if(reportsTable && reportsTable[0] === "none") {
          return <h2>Нет отчетных данных за период </h2>
        } else {
          return <div className="noDisplay"/>
        }
      }
    }
  }
}