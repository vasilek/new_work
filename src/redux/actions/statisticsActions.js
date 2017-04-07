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

export const SET_PIE = "SET_PIE";
export const SET_BAR = "SET_BAR";
export const SET_PERIOD = "SET_PERIOD";
export const SET_WEEK_PERIOD = "SET_WEEK_PERIOD";
export const SET_DAY_PERIOD = "SET_DAY_PERIOD";
export const SET_MONTH_PERIOD = "SET_MONTH_PERIOD";
export const SET_NORMATIVES = "SET_NORMATIVES";


export const setPie = generateActionFunc(SET_PIE);
export const setBar = generateActionFunc(SET_BAR);
export const setPeriod = generateActionFunc(SET_PERIOD);
export const setWeekPeriod = generateActionFunc(SET_WEEK_PERIOD);
export const setNormatives = generateActionFunc(SET_NORMATIVES);

function parseNormatives(data) {
  let normatives = [];
  let max_val = 0;
  for(let i = 0; i < data.length; i++) {
    let obj = {};
    let left = data[i].max_hours - data[i].done_hours;
    let overwork = 0;
    let underwork = 0;
    if(left <= 0) {
      overwork = 0 - left;
      obj.overwork = 0 - left;
    } else if(left > 0) {
      underwork = left;
      obj.underwork = left;
    }
    if((data[i].max_hours + overwork) > max_val) {
      max_val = data[i].max_hours + overwork;
    }
    if((data[i].done_hours + underwork) > max_val ) {
      max_val = (data[i].done_hours + underwork);
    }
    obj.max_hours = data[i].max_hours;
    obj.done_hours = data[i].done_hours;
    obj.name = data[i].name;
    obj.status = data[i].status;
    normatives.push(obj);
  }
  return {normatives, max_val}
}

export function loadNormatives(obj) {
  return (dispatch, getState) => {
    const handler = (json, dispatch, getState) => {
      let normObj = parseNormatives(json.data);
      let normatives = normObj.normatives;
      let max_val = normObj.max_val;
      dispatch(setNormatives({normatives: normatives, max_val}));
    }
    let day1 = 0;
    let day2 = 1;
    let date_from = 0;
    let date_to = 1;
    day1 = getDateRange(getState().Statistics.weekPeriod.first).first;
    day2 = getDateRange(getState().Statistics.weekPeriod.last).last;
    date_from = Math.floor((+day1)/1000);
    date_to = Math.floor((+day2)/1000);
    const user_ids = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : undefined;
    const task_ids = (obj.task_ids && obj.task_ids.length>0) ? obj.task_ids.join(","): undefined;
    let par = {
      date_to,
      date_from,
      user_ids,
      task_ids,
    };
    let paramArr = [];
    for(var e in par) {
      if(par[e]) {
        paramArr.push(`${e}=${par[e]}`);
      }
    }
    dispatch(fetchAsync(`/stat/workchart?${paramArr.join("&")}`, handler));
  }
}

export function loadHisto(obj) {
  return (dispatch, getState) => {

    const handler = (json, dispatch, getState) => {
      dispatch(setBar({bar: json.data}));
    }
    let day1 = 0;
    let day2 = 1;
    let date_from = 0;
    let date_to = 1;
    const period = getState().Statistics.period;
    day1 = getDateRange(getState().Statistics.weekPeriod.first).first;
    day2 = getDateRange(getState().Statistics.weekPeriod.last).last;
      date_from = Math.floor((+day1)/1000);
      date_to = Math.floor((+day2)/1000);
    const user_ids = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : undefined;
    const code_ids = (obj.code_ids && obj.code_ids.length>0) ? obj.code_ids.join(","): undefined;
    const task_ids = (obj.task_ids && obj.task_ids.length>0) ? obj.task_ids.join(","): undefined;
    const type = obj.type;
    let par = {
      date_to,
      date_from,
      user_ids,
      code_ids,
      task_ids,
      type,
      period
    };
    let paramArr = [];
    for(var e in par) {
      if(par[e]) {
        paramArr.push(`${e}=${par[e]}`);
      }
    }
    dispatch(fetchAsync(`/stat/bar?${paramArr.join("&")}`, handler));
  }
}

export function loadPie(obj) {
  return (dispatch, getState) => {

    const handler = (json, dispatch, getState) => {
      dispatch(setPie({pie: json.data}));
    }
    const day1 = getDateRange(getState().Statistics.weekPeriod.first).first;
    const day2 = getDateRange(getState().Statistics.weekPeriod.last).last;
    const date_from = Math.floor((+day1)/1000);
    const date_to = Math.floor((+day2)/1000);
    const user_ids = (obj.user_ids && obj.user_ids.length>0) ? obj.user_ids.join(",") : undefined;
    const code_ids = (obj.code_ids && obj.code_ids.length>0) ? obj.code_ids.join(","): undefined;
    const task_ids = (obj.task_ids && obj.task_ids.length>0) ? obj.task_ids.join(","): undefined;
    const type = obj.type;
    let par = {
      date_to,
      date_from,
      user_ids,
      code_ids,
      task_ids,
      type
    };
    let paramArr = [];
    for(var e in par) {
      if(par[e]) {
        paramArr.push(`${e}=${par[e]}`);
      }
    }
    dispatch(fetchAsync(`/stat/pie?${paramArr.join("&")}`, handler));
  }
}