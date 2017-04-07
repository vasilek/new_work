import {
    CHANGE_FETCHING_STATUS,
    TOGGLE_TOOLBAR,
    SET_TABS,
    TOGGLE_RIGHT_PANEL,
    OPEN_TRUD_MODAL,
    CLOSE_TRUD_MODAL,
    SET_CURRENT_TITLE,
    OPEN_ERRORS_MODAL,
    SET_LOCATION,
    CLOSE_ERRORS_MODAL,
    SET_CLIENT_HEIGHT,
    CLEAR_LAYOUT,
    SET_SEARH_QUERY,
    SET_FILTERS,
    SET_QUERY
} from "../actions/layoutActions";

import {
  LOGOUT
} from "../actions/userActions"

import {
  SET_GLOBAL_TASK_TYPE
} from "../actions/tasksActions";

export function fetchStatusChange(state = false, action) {
    switch (action.type) {
    case CHANGE_FETCHING_STATUS:
        return action.status
    default:
        return state;
    }
}

export function setQuery(state = "", action) {
  switch (action.type) {
    case SET_QUERY:
      return action.query;
    case LOGOUT:
      return "";
    default:
      return state;
  }
}

const defaultAllFilters = {
  type: 0
};

const defaultMyFilters = {
  type: 1
}

const defaultNonDistFilter = {
  type: 2
}

const defaultSubsFilters = {
  type: 3
}

const defaultFilters = {
  statuses: ["3"],
  all_subs: 0,
  sub_ids: [],
  type: 3
}

const filtersDict = {
  "all" : defaultAllFilters,
  "my": defaultMyFilters,
  "nonDistributed": defaultNonDistFilter,
  "subordinate": defaultSubsFilters
}

export function setFilters(state = {}, action) {
  switch (action.type) {
    case SET_GLOBAL_TASK_TYPE:
    if(state.type === undefined) {
      const defFilters = Object.assign({},JSON.parse(JSON.stringify(defaultFilters)),{type: filtersDict[action.routeType].type});
      return defFilters;
    } else if(state.type !== filtersDict[action.routeType].type) {
        const defFilters = Object.assign({},state,{type: filtersDict[action.routeType].type});
        return defFilters;
      }else {
        return state;
      }
    case SET_FILTERS:
      return Object.assign({}, state, action.filters);
    case LOGOUT:
      return defaultFilters;
    default:
      return state;
  }
}

export function setLocation(state = "/", action) {
  switch (action.type) {
    case SET_LOCATION:
      return action.location;
    default:
      return state;
  }
}


export function setClientHeight(state = 100, action) {
  switch (action.type) {
    case SET_CLIENT_HEIGHT:
      return action.height;
    default:
      return state;
  }
}

export function setTabs(state = [], action) {
    switch (action.type) {
    case SET_TABS:
        return action.tabs
    case CLEAR_LAYOUT:
        return [];
    default:
        return state
    }
}

export function openTrudModal(state = false, action) {
    switch (action.type) {
    case OPEN_TRUD_MODAL:
        return true;
    case CLOSE_TRUD_MODAL:
        return false;
    case CLEAR_LAYOUT:
        return false;
    default:
        return state;
    }
}

export function isErrorsModalOpened(state = false, action) {
  switch (action.type) {
  case OPEN_ERRORS_MODAL:
      return true;
  case CLOSE_ERRORS_MODAL:
      return false;
  case CLEAR_LAYOUT:
      return false;
  default:
      return state;
  }
}

export function setSearchQuery(state = "", action) {
  switch (action.type) {
    case SET_SEARH_QUERY:
      return action.query;
    case CLEAR_LAYOUT:
      return "";
    default:
      return state
  }
}

export function toggleRightPanel(state = 0, action) {
    switch (action.type) {
    case TOGGLE_RIGHT_PANEL:
        return action.status
    case CLEAR_LAYOUT:
        return 0;
    default:
        return state
    }
}

export function setGlobalTaskType(state = "all", action) {
  switch (action.type) {
    case SET_GLOBAL_TASK_TYPE:
        return action.routeType;
    case CLEAR_LAYOUT:
        return "all";
    default:
        return state;
  }
}

const typeDict = {
  "nonDistributed": "Нераспределенные задачи",
  "my": "Мои задачи",
  "subordinate": "Задачи подчинённых",
  "all" : "Все задачи"
}

export function setCurrentTitle(state = "", action) {
    switch (action.type) {
      case SET_CURRENT_TITLE:
          return action.title;
      case SET_GLOBAL_TASK_TYPE:
          return typeDict[action.routeType];
      default:
          return state;
    }
}

export function toggleToolbar(state = true, action) {
    switch (action.type) {
    case TOGGLE_TOOLBAR:
        return !state;
    default:
        return state;
    }
}
