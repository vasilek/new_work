import React from "react";
import * as helpers from "../../helperFunctions";
import Icon from "../../Icons/Icon";
import Container from "../Container";
import moment from "moment";
import thelpers from "../Table/tableHelpers";
import {getDateMonthRange} from "../../redux/actions/tableActions";


export default class RightTaskPanel extends React.Component {
  render() {
    const props = this.props;
    const currentWeek = props.currentWeek;
    let reportsTable = props.reportsTable;
    if(!reportsTable.users && reportsTable[0] !== "none") {
        const range = thelpers.getDateRange(props.currentWeek);
        const dateRangeWords = "c " + moment(range.first).format("DD MMMM") + " по " + moment(range.last).format("DD MMMM");
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
        let table = thelpers.generateUserReportTable(props.reportsTable.users, dateRangeWords);
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