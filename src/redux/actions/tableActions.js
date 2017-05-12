import {generateActionFunc, fetchAsync} from "./actionHelper.js";
import {TableData} from "../../Entities/Table/TableData";
import {setGroupedTableLabors, groupLabors} from "./tasksActions";

export const SET_TABLE_DATA = "SET_TABLE_DATA";
export const CHANGE_WEEK = "CHANGE_WEEK";
export const SET_WEEK = "SET_WEEK";
export const SET_MONDAY = "SET_MONDAY";
export const SET_DAY = "SET_DAY";
export const SET_DAYS = "SET_DAYS";



export function getDateRange(day) {
    var curr = new Date(day); // get current date
    var curr2 = new Date(day); // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    firstday.setHours(0, 0, 0, 0);
    var lastday = new Date(curr2.setDate(last));
    lastday.setHours(23, 59, 59, 999);
    return {first: firstday, last: lastday};
}


export function getDateMonthRange(day) {
    var curr_date = new Date(day);

    var first_day = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);

    var last_day = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
    return {first: first_day, last: last_day}

    /*
     var month_end_date =formatted_date(new Date()); // limit current month date range upto current day.
     */

}

export const setTableData = generateActionFunc(SET_TABLE_DATA);
export const setCurrentWeek = generateActionFunc(SET_WEEK);
export const setCurrentDay = generateActionFunc(SET_DAY);
export const setMonday = generateActionFunc(SET_MONDAY);
export const setDays = generateActionFunc(SET_DAYS);

export function changeWeek(obj) {
    return (dispatch, getState) => {
        dispatch(setCurrentWeek({day: obj.day}));
        dispatch(loadTableData());
    }
}

export const generateLaborsFromTableData = (data, task_id, day) => {
    const elements = data.data;
    const headers = data.headers;
    let labors = [];
    let task = {};
    for (var e in elements) {
        if (e.split("|id|")[1] == task_id) {
            task = elements[e];
            break;
        }
    }
    if (task.dates) {
        if (day && task.dates[day]) {
            labors = task.dates[day].timings;
        } else {
            for (var k in task.dates) {
                labors = labors.concat(task.dates[k].timings);
            }
        }
    } else {
        return [];
    }
    return labors;
}

export function setGrouped(task_id) {
    return function (dispatch, getState) {
        let table = getState().Table.tableData;
        const day = getState().Table.currentDay;
        if (table.data && Object.keys(table.data).length) {
            const labors = generateLaborsFromTableData(table, task_id, day);
            const groups = groupLabors(labors);
            dispatch(setGroupedTableLabors({groups}));
        } else {
            dispatch(setGroupedTableLabors({groups: []}));
        }
    }
}

export function loadTableData(obj, task_id) {
    return (dispatch, getState) => {
        let day = -1;
        if (obj) {
            day = obj.day;
        } else {
            day = getState().Table.currentWeek;
        }
        const range = getDateRange(day);
        const params = getState().currentTaskFilters;
        let par = {};
        let paramArr = [];
        par.type = params.type;
        par.user_ids = params.sub_ids ? params.sub_ids.join(",") : "";
        par.all_subs = params.all_subs;
        par.status = params.statuses.join(",");
        par.date_from = Math.floor((+range.first) / 1000);
        par.date_to = Math.floor((+range.last) / 1000);
        for (var e in par) {
            if (par[e]) {
                paramArr.push(`${e}=${par[e]}`);
            }
        }
        dispatch(loadTable({day: day}, task_id, paramArr))
    }
}


export function loadTable(obj, task_id, params) {
    const range = getDateRange(obj.day);
    const handler = function (json, dispatch, getState) {
        const pingedUser = getState().User.pingedUser;
        const globalType = getState().globalTaskType;
        const currentTask = getState().taskView;
        let tableData = new TableData(json, range.first, range.last, pingedUser);
        dispatch(setTableData({tableData}));
        if (currentTask) {
            dispatch(setGrouped(currentTask.id));
        }
    }
    return fetchAsync(`/data/tasks?${params.join("&")}`, handler);
}

