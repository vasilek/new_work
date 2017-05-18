import React from "react";
import helpers from "./components/Table/tableHelpers";

export const debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export const rowHeight = 35;


export const testExportData = {
    "Задача 1": {
        "Иваныч": 5,
        "Петрович": 7,
        "Михалыч": 9
    },
    "Задача 2": {
        "Иваныч": 5,
        "Саныч": 7,
    },
    "Задача 3": {
        "Татьяныч": 5,
        "Саныч": 7,
    }
}

export const parseReportTable = (data) => {
    let table = {};
    table.data = [];
    table.headers = [];
    let headersDict = {};
    for (let e in data) {
        table.data.push({name: e, data: data[e]});
        for (let k in data[e]) {
            headersDict[k] = true;
        }
    }
    for (let e in headersDict) {
        table.headers.push(e);
    }
    return table;
}


export const parseUserReportTable = (datas) => {
    let userDicts = [];
    var half = false;
    if (!datas.length) {
        datas = [datas];
    }

    for (var i = 0; i < datas.length; i++) {
        let data = datas[i];
        let table = {};
        table.data = [];
        table.headers = [];
        let daysParsed = [];
        let userDict = {
            name: data.name,
            number: data.number,
            position: data.position,
        }
        let longestPair = -1;
        const days = data.days;
        for (let i = 0; i < days.length; i++) {
            let day = {};
            let financePairs = [];
            const finance = days[i].finance;
            for (let j = 0; j < finance.length; j++) {
                if (finance[j].hours !== 0) {
                    let pair = {
                        hours: finance[j].hours,
                        name: finance[j].value
                    }
                    financePairs.push(pair);
                }
            }
            if (financePairs.length > longestPair) {
                longestPair = financePairs.length;
            }
            day.dayType = days[i].is_work ? "Ф" : "В";
            day.finance = financePairs;
            day.hours = days[i].hours;
            daysParsed.push(day);
        }


        userDict.longestFinance = longestPair;
        userDict.days = daysParsed;
        userDict.totalDays = data.total.days;
        userDict.totalFinance = data.total.finance;
        userDict.totalHours = data.total.hours;
        userDict.halfDays = data.half.days;
        userDict.halfFinance = data.half.finance;
        userDict.halfHours = data.half.hours;
        userDicts.push(userDict);

    }
    return {users: userDicts}
}


export const getTasksReportTable = (table) => {
    const rows = helpers.generateSimpleRows(table);
    const headers = helpers.generateSimpleHeaders(table);
    return {
        data: table, element: (
            <table id="reports-table" className="reports-table" cellSpacing="0">
                <thead>
                {headers}
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }
}

import {downloadExcel, htmlToExcel} from "./filesaver";

export const exportReportToExcel = function (json, headers) {
    downloadExcel(json, headers)
}

export const exportHtmlToExcel = () => {
    htmlToExcel(document.getElementById('reports-table'));
}