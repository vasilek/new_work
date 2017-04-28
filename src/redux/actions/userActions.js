import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "./actionHelper.js";
import {loadTasks,loadWorkCodes, loadFinances, setGlobalTaskType} from "./tasksActions";
import {loadFlatDepartments} from "./Admin/departmentActions";
import { browserHistory } from 'react-router';

export const SET_USER = "SET_USER";
export const SET_SUBORDINATES = "SET_SUBORDINATES";
export const SET_PINGED_USER = "SET_PINGED_USER";
export const SET_USER_TYPE = "SET_USER_TYPE";
export const LOGOUT = "LOGOUT";

export const setLoggedUser = generateActionFunc(SET_USER);
export const setPingedUser = generateActionFunc(SET_PINGED_USER);
export const setSubordinates = generateActionFunc(SET_SUBORDINATES);
export const setUserType = generateActionFunc(SET_USER_TYPE);
export const logout_ = generateActionFunc(LOGOUT);

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function logout () {
  const handler =  function (json, dispatch, getState) {
      dispatch(pingLogin());
      dispatch(logout_());
  }
  return fetchAsync(`/account/logout`, handler);
}

export function pingLogin(renderFunc) {
  const handler =  function (json, dispatch, getState) {
    dispatch(setPingedUser({
        id: json.data.id
    }));
    if(isFunction(renderFunc)) {
        renderFunc();
    };
    if(!json.data.id) {
      browserHistory.push('/login');
    } else {
      dispatch(getCurrentUser({}));
      let location = browserHistory.getCurrentLocation();
      if(location.pathname == "/login" || location.pathname == "/") {
        location = "/tasks/my/table";
      }
      browserHistory.push(location);
    }
  }
  return fetchAsync(`/account/ping`, handler);
}

export function validateLoginData(obj) {
  const handler = (json,dispatch) => {
    dispatch(pingLogin());
  }
  const errorHandler = (dispatch) => {

  }
  return fetchPost(`/account/auth`, obj, handler, errorHandler);
}

export function getSubordinates() {
    const handler = (json, dispatch) => {
        const data = json.data.subordinates.map(x => ({
            label: x.name,
            value: x.id
        }));
        dispatch(setSubordinates({
            subordinates: data
        }));
    };
    return fetchAsync('/data/subordinates', handler);
}

export function getCurrentUser() {
    const handler = function (json, dispatch) {
        const data = json.data.user;
        // console.log("123")
        const user = {
            name: data.name,
            position: data.position,
            id: data.id,
            department: data.department_id
        };
        dispatch(setLoggedUser({
            user
        }));
        let userType = 0;
        if(data.departments.length > 0) {
          userType = 1;
        }
        if(data.role == 1) {
          userType = 2;
        }
        dispatch(setUserType({userType: userType}))
    }
    return fetchAsync(`/account/me`, handler);
}
