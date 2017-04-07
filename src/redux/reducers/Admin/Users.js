import {
  SET_USERS,
  SET_USERS_PAGE,
  SET_USER_VIEW
} from "../../actions/Admin/usersActions";

import {normalizeTree} from "../../../Entities/Admin/Users";

export function setUsers(state = [], action) {
  switch (action.type) {
    case SET_USERS:
    let deps = {
      byId: {},
      byGlobalId: {}
    };
        let newTasks = {};
        newTasks.tree = JSON.parse(JSON.stringify(action.tree));
        normalizeTree(newTasks.tree, deps);
        newTasks.treeNormalized = deps;
        return newTasks;
    default:
      return state;
  }
}

export function setUser(state = false, action) {
  switch (action.type) {
    case SET_USER_VIEW:
      return action.user;
    default:
      return state;
  }
}

export function setUsersPage(state = 0, action) {
  switch (action.type) {
    case SET_USERS_PAGE:
      return action.page;
    default:
      return state;
  }
}