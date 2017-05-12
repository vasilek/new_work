export const SET_REPORT_TASKS = "SET_REPORT_TASKS";
export const SET_REPORT_TABLE_DATA = "SET_REPORT_TABLE_DATA";
export const DELETE_TABLE_DATA = "DELETE_TABLE_DATA";
import {
    generateActionFunc
} from "./actionHelper.js";
import {
    fetchAsync,
    fetchPost
} from "./actionHelper.js";
import {
  getDateRange,
  getDateMonthRange
} from "./tableActions";
import {
  testExportData,
  parseReportTable,
  parseUserReportTable
} from "../../helperFunctions";


export const setReportTasks = generateActionFunc(SET_REPORT_TASKS);
export const setReportTableData = generateActionFunc(SET_REPORT_TABLE_DATA);
export const deleteTableData = generateActionFunc(DELETE_TABLE_DATA);


export function getUserTasks(user_ids) {
  const handler = (json, dispatch, getState) => {
    dispatch(setReportTasks({tasks: json.data.tasks.map(x => ({value: x.id, label: x.name}))}));
  }
  return fetchAsync("/data/tasklist", handler);
}

export function createTasksReport(obj) {
  return (dispatch, getState) => {
      const handler = (json, dispatch, getState) => {
        let parsedTable = parseReportTable(json.data.report);
        if(parsedTable.data.length == 0) {
          parsedTable = ["none"];
        }
        dispatch(setReportTableData({table: parsedTable}));
      }
      const day = getState().Table.currentWeek;
      const days = getState().Table.chosenDays;
      // const range = getDateRange(day);
      const range = getDateRange(days);
      const date_from = Math.floor((+range.first)/1000);
      const date_to = Math.floor((+range.last)/1000);
      const user_ids = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : undefined;
      const task_ids = (obj.task_ids && obj.task_ids.length>0) ? obj.task_ids.join(","): undefined;
      let par = {
        date_to,
        date_from,
        user_ids,
        task_ids
      };
      let paramArr = [];
      for(var e in par) {
        if(par[e]) {
          paramArr.push(`${e}=${par[e]}`);
        }
      }
      dispatch(fetchAsync(`/report/task?${paramArr.join("&")}`, handler));
  }
}

export function createFinanceReport(obj) {
  return (dispatch, getState) => {
      const handler = (json, dispatch, getState) => {
        let parsedTable = parseReportTable(json.data.report);
        if(parsedTable.data.length == 0) {
          parsedTable = ["none"];
        }
        dispatch(setReportTableData({table: parsedTable}));
      }
      const day = getState().Table.currentWeek;
      const days = getState().Table.chosenDays;
      console.log("DAY",day);
      console.log("DAYS",days);
      // const range = getDateRange(day);
      const range = getDateRange(days);
      const date_from = Math.floor((+range.first)/1000);
      const date_to = Math.floor((+range.last)/1000);
      const user_ids = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : undefined;
      const finance_ids = (obj.finance_ids && obj.finance_ids.length>0) ? obj.finance_ids.join(","): undefined;
      let par = {
        date_to,
        date_from,
        user_ids,
        finance_ids
      };
      let paramArr = [];
      for(var e in par) {
        if(par[e]) {
          paramArr.push(`${e}=${par[e]}`);
        }
      }
      dispatch(fetchAsync(`/report/finance?${paramArr.join("&")}`, handler));
  }
}

export function createUserReport(obj) {
  return (dispatch, getState) => {
      const handler = (json, dispatch, getState) => {        
        const parsedTable = parseUserReportTable(json.data);
        dispatch(setReportTableData({table: parsedTable}));
      }
      const day = getState().Table.currentWeek;
      const range = getDateMonthRange(day);
      const date_from = Math.floor((+range.first + 5 * 1000 * 60 * 60)/1000);
      const date_to = Math.floor((+range.last+ 5 * 1000 * 60 * 60)/1000);
      const id = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : [getState().User.pingedUser];
      let par = {
        date_to,
        date_from,
        id
      };
      let paramArr = [];
      for(var e in par) {
        if(par[e]) {
          paramArr.push(`${e}=${par[e]}`);
        }
      }
      dispatch(fetchAsync(`/report/user?${paramArr.join("&")}`, handler));
  }
}

