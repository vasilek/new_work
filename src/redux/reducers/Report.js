import {
    SET_REPORT_TASKS,
    SET_REPORT_TABLE_DATA,
    DELETE_TABLE_DATA
} from "../actions/reportsActions";

export function setReportTableData(state = {data: [], headers: []}, action) {
    switch (action.type) {
        case SET_REPORT_TABLE_DATA:
            return action.table;
        case DELETE_TABLE_DATA:
            return {data: [], headers: []};
        default:
            return state;
    }
}

export function setReportTasks(state = [], action) {
    switch (action.type) {
        case SET_REPORT_TASKS:
            return action.tasks;
        default:
            return state;
    }
}