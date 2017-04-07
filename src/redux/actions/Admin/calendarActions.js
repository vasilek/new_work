import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "../actionHelper.js";
import moment from "moment";
export const SET_CALENDAR = "SET_CALENDAR";
export const SET_CALENDAR_DAY = "SET_CALENDAR_DAY";

export const setCalendar = generateActionFunc(SET_CALENDAR);
export const setCalendarDay = generateActionFunc(SET_CALENDAR_DAY);


function createMods(calendar) {
  let mods = [];
  let modsDict = {};
  let i = 0;
  for(let e in calendar) {
    modsDict[e] =       {
                   date: moment(e),
                   classNames: [ " day-type-" + calendar[e]],
                   component: ['day'],
                   status: calendar[e]                   
                 };
    i++;
  }
  return modsDict;
}

export function loadCalendar(year) {
  const handler = (json, dispatch, getState) => {
    let dat = json.data.calendar;
    let calendar = createMods(dat);
    dispatch(setCalendar({calendar}));
  }
  return fetchAsync(`/data/calendar?year=${year}`, handler);
}

export function setDay(date, status) {
  const handler = (json, dispatch, getState) => {
    dispatch(setCalendarDay({day: date, status: status}));
  }
  return fetchAsync(`/data/setday?date=${date}&status=${status}`, handler);
}