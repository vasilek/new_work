import {
  SET_DEPARTMENT_TREE,
  SET_DEPARTMENT,
  SET_FLAT_DEPARTMENTS
} from "../../actions/Admin/departmentActions";

import {    CLEAR_LAYOUT
} from "../../actions/layoutActions";

import {normalizeTree} from "../../../Entities/Admin/DepartmentTree";

export function setDepartmentTree(state = [], action) {
    switch (action.type) {
    case SET_DEPARTMENT_TREE:
    let deps = {
      byId: {},
      byGlobalId: {}
    };
        let newTasks = {};
        newTasks.tree = JSON.parse(JSON.stringify(action.tree));
        normalizeTree(newTasks.tree, 0,0, deps);
        newTasks.treeNormalized = deps;
        return newTasks;
    default:
        return state;
    }
}

export function setDepartment(state = false, action) {
  switch (action.type) {
    case SET_DEPARTMENT:
      return action.department;
    case CLEAR_LAYOUT:
      return false;
    default:
      return state;
  }
}

export function setFlatDepartments(state = [], action) {
  switch (action.type) {
    case SET_FLAT_DEPARTMENTS:
      return action.departments;
    default:
      return state;
  }
}


