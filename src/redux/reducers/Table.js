import {
    SET_TABLE_DATA,
    SET_WEEK,
    SET_DAY,
    SET_MONDAY,
    SET_DAYS,
    SET_HALF,
    SET_FULL,
    SET_FINANCE_REPORT,
    SET_TASKS_REPORT,
    SET_TABLE_REPORT
} from "../actions/tableActions";

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export const monday = getMonday(new Date());

import {copyLaborsCells} from "../../Entities/Table/TableData";

export function setTableData(state = [], action) {
    switch (action.type) {
        case SET_TABLE_DATA:
            let newData = JSON.parse(JSON.stringify(action.tableData));
            const copy = copyLaborsCells(newData);
            newData.laborsCellsByIds = copy.laborsCellsByIds;
            newData.datedLabors = copy.datedLabors;
            return newData;
        default:
            return state
    }
}



export function setCurrentDay(state = false, action) {
    switch (action.type) {
        case SET_DAY:
            return action.day;
        default:
            return state;
    }
}

export function setCurrentWeek(state = monday, action) {
    switch (action.type) {
        case SET_WEEK:
            return getMonday(action.day);
        case SET_MONDAY:
            return monday;
        default:
            return state
    }
}

export function setFullOrHalf(state = 0, action) {
    switch (action.type) {
        case SET_FULL:
            return 0;
        case SET_HALF:
            return 1;
        default:
            return state
    }
}

export function setTypeReport(state = "task", action) {
    switch (action.type) {
        case SET_FINANCE_REPORT:
            return "finance";
        case SET_TASKS_REPORT:
            return "tasks";
        case SET_TABLE_REPORT:
            return "table";
        default:
            return state
    }
}


export function setDays(state = {first: new Date(), last: new Date()}, action) {
    switch (action.type) {
        case SET_DAYS:
            if(action.first) {
                return {first: action.first, last: state.last};
            } else if(action.last) {
                return {first: state.first, last: action.last};
            } else {
                return state;
            }
        default:
            return state;

    }
}
