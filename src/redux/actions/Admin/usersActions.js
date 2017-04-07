import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "../actionHelper.js";
import {
    reset
} from 'redux-form';
import {UsersTree} from  "../../../Entities/Admin/Users";
import User from  "../../../Entities/Admin/User";
export const SET_USERS = "SET_USERS";
export const SET_USERS_PAGE = "SET_USERS_PAGE";
export const SET_USER_VIEW = "SET_USER_VIEW";

export const setUsers = generateActionFunc(SET_USERS);
export const setUser = generateActionFunc(SET_USER_VIEW);
export const setUsersPage = generateActionFunc(SET_USERS_PAGE);

const limit = 30;

export function getUsers() {
  return (dispatch, getState) => {
    const page = getState().Admin.usersPage;
    const currentOffset = page*limit;
    const handler = (json, dispatch, getState) => {
      const users = new UsersTree(json.data.users);
      dispatch(setUsers(users));
    }
    const query = getState().searchQuery;
    let q = "";
    if(query !== "") {
      q = "&query="+encodeURIComponent(query);
    }
    dispatch(fetchAsync(`/all/users?limit=${limit}&offset=${currentOffset}`+q,handler));
  }
}

export function setPassword(data) {
  const handler = () => {

  }
  return fetchPost(`/account/setpwd`, data, handler);
}

export function promote(user) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadUser(user));
    dispatch(getUsers());
  }
  const errorHandler = (dispatch) => {
    dispatch(loadUser(user));
    dispatch(reset("userInfoDialogForm"));
  }
  return fetchAsync(`/account/promote?id=${user.id}`, handler, errorHandler);
}

export function demote(user) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadUser(user));
    dispatch(getUsers());
  }
  const errorHandler = (dispatch) => {
    dispatch(loadUser(user));
    dispatch(reset("userInfoDialogForm"));
  }
  return fetchAsync(`/account/demote?id=${user.id}`, handler, errorHandler);
}


export function ban(user) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadUser(user));
    dispatch(getUsers());
  }
  const errorHandler = (dispatch) => {
    dispatch(loadUser(user));
    dispatch(reset("userInfoDialogForm"));
  }
  return fetchAsync(`/account/ban?id=${user.id}`, handler, errorHandler);
}

export function unban(user) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadUser(user));
    dispatch(getUsers());
  }
  const errorHandler = (dispatch) => {
    dispatch(loadUser(user));
    dispatch(reset("userInfoDialogForm"));
  }
  return fetchAsync(`/account/unban?id=${user.id}`, handler, errorHandler);
}



export function loadUser(user) {
  const handler = (json, dispatch, getState) => {
    const user = new User(json.data);
    dispatch(setUser({user}));
  }
  return fetchAsync(`/get/user?id=` + user.id, handler);
}

export function deleteUser(user) {
  const handler = (json, dispatch, getState) => {
    dispatch(getUsers());
  }
  return fetchAsync(`/delete/user?id=` + user.id, handler);
}


export function editUser(data) {
  const handler = (json,dispatch, getState) => {
      const page = getState().usersPage;
      if((data.role !== 2 && data.role !== "-22") && data.is_banned === true) {
        dispatch(ban(data));
      } else if((data.role === 2 || data.role === "-22") && !data.is_banned) {
        dispatch(unban(data));
      } else if((data.role !== 1 && data.role !== "-21") && data.is_admin) {
          dispatch(promote(data));
      } else if((data.role === 1 || data.role === "-21") && !data.is_admin) {
          dispatch(demote(data));
      }else {
        dispatch(loadUser(data));
        dispatch(getUsers());
      }
  }
  const errorHandler = (dispatch) => {
    dispatch(loadUser(data));
    dispatch(reset("userInfoDialogForm"));
  }
  return fetchPost(`/edit/user`, data, handler, errorHandler);
}

export function createUser(data) {
    const handler = (json,dispatch, getState) => {
      const page = getState().usersPage;
      if(data.is_banned) {
          dispatch(ban(json.data));
      } else if(data.is_admin) {
          dispatch(promote(json.data));
      } else {
        dispatch(getUsers());
        dispatch(loadUser(json.data));
      }
    }
    return fetchPost(`/create/user`, data, handler);
}