import {
  SET_CALENDAR,
  SET_CALENDAR_DAY
} from "../../actions/Admin/calendarActions";
import moment from "moment";

function copyDay(day) {
  let obj = {};
  obj.date = day.date;
  obj.classNames = day.classNames;
  obj.status =  day.status;
  obj.component =  day.component;
  return obj;
}

export function setCalendar(state = {}, action) {
  switch (action.type) {
    case SET_CALENDAR:
      return action.calendar;
    case SET_CALENDAR_DAY:
      let newStatus = action.status;
      let newClassNames = " day-type-"+action.status;
      let newState = {};
      for(let e in state) {
        let savedDate = state[e].date.toDate();
        newState[e] = JSON.parse(JSON.stringify(copyDay(state[e])));
        newState[e].date = moment(savedDate);
      }
      newState[action.day].status = newStatus;
      newState[action.day].classNames[0] = newClassNames;
      return newState;
    default:
      return state;
  }
}

