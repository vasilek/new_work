export const TOGGLE_TOOLBAR = "TOGGLE_TOOLBAR";
export const SET_TABS = "SET_TABS";
export const TOGGLE_RIGHT_PANEL = "TOGGLE_RIGHT_PANEL";
export const OPEN_TRUD_MODAL = "OPEN_TRUD_MODAL";
export const CHANGE_FETCHING_STATUS = "CHANGE_FETCHING_STATUS";
export const CLOSE_TRUD_MODAL = "CLOSE_TRUD_MODAL";
export const SET_CURRENT_TITLE = "SET_CURRENT_TITLE";
export const OPEN_ERRORS_MODAL = "OPEN_ERRORS_MODAL";
export const CLOSE_ERRORS_MODAL = "CLOSE_ERRORS_MODAL";
export const SET_CLIENT_HEIGHT = "SET_CLIENT_HEIGHT";
export const CLEAR_LAYOUT = "CLEAR_LAYOUT";
export const SET_FILTERS = "SET_FILTERS";
export const SET_SEARH_QUERY = "SET_SEARH_QUERY";
export const SET_LOCATION = "SET_LOCATION";
export const SET_QUERY = "SET_QUERY";
import {
    generateActionFunc
} from "./actionHelper.js";
import {
  setTaskOpen
} from "./tasksActions.js";

export const clearLayout = generateActionFunc(CLEAR_LAYOUT);
export const toggleToolbar = generateActionFunc(TOGGLE_TOOLBAR);
export const setTabs = generateActionFunc(SET_TABS);
export const setCurrentTitle = generateActionFunc(SET_CURRENT_TITLE);
export const toggleRightPanel = generateActionFunc(TOGGLE_RIGHT_PANEL);
export const openTrudModal = generateActionFunc(OPEN_TRUD_MODAL);
export const closeTrudModal = generateActionFunc(CLOSE_TRUD_MODAL);
export const openErrorsModal = generateActionFunc(OPEN_ERRORS_MODAL);
export const closeErrorsModal = generateActionFunc(CLOSE_ERRORS_MODAL);
export const setClientHeight = generateActionFunc(SET_CLIENT_HEIGHT);
export const setSearchQuery_ = generateActionFunc(SET_SEARH_QUERY);
export const setFilters = generateActionFunc(SET_FILTERS);
export const setLocation = generateActionFunc(SET_LOCATION);
export const setQuery = generateActionFunc(SET_QUERY);

function searchGlobalIndexesTreeByName(query, tree) {
  let globalIndexes = [];
  tree.forEach((x,i) => {
    if(x.children) {
      let openedChildren = searchGlobalIndexesTreeByName(query, x.children);
      if(openedChildren.length !== 0) {
        globalIndexes = globalIndexes.concat(openedChildren);
        globalIndexes.push(x.globalIndex);
      }
    }
    if(~x.name.indexOf(query)) {
      globalIndexes.push(x.globalIndex);
    }
  });
  return globalIndexes;
}

export function setSearchQuery(obj) {
  return function(dispatch, getState) {
    const query = obj.query;
    const location = getState().currentLocation
    if(~location.indexOf("tasks") && ~location.indexOf("list")) {
      let tasks = getState().tasks;
      let openedTasks = searchGlobalIndexesTreeByName(query, tasks.tree);
      dispatch(setTaskOpen({globalIndexes: openedTasks}));
    }
    dispatch(setSearchQuery_(obj));
  }
}