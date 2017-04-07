import {
  SET_PIE,
  SET_BAR,
  SET_PERIOD,
  SET_WEEK_PERIOD,
  SET_DAY_PERIOD,
  SET_MONTH_PERIOD,
  SET_NORMATIVES
} from "../actions/statisticsActions";

export function setPie(state = [], action) {
  switch (action.type) {
    case SET_PIE:
      return action.pie;
    case SET_BAR:
      return [];
    case SET_NORMATIVES:
      return [];
    default:
      return state;
  }
}

export function setBar(state = [], action) {
  switch (action.type) {
    case SET_BAR:
      return action.bar;
    case SET_PIE:
      return [];
    case SET_NORMATIVES:
      return [];
    default:
      return state;
  }
}

export function setNormatives(state = [], action) {
  switch (action.type) {
    case SET_NORMATIVES:
      return {normatives: action.normatives, max_val: action.max_val};
    case SET_BAR:
        return [];
    case SET_PIE:
        return [];
    default:
      return state
  }
}

export function setWeekPeriod(state = {first: new Date(), last: new Date()}, action) {
  switch (action.type) {
    case SET_WEEK_PERIOD:
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

export function setPeriod(state = 2, action) {
  switch (action.type) {
    case SET_PERIOD:
      return action.period;
    default:
      return state;
  }
}