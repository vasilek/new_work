import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "../actionHelper.js";
import {
    toggleRightPanel,
    closeTrudModal
} from "../layoutActions";
import {
  setTaskOpen
} from "../tasksActions";
import {DepartmentTree} from "../../../Entities/Admin/DepartmentTree";
import Department from  "../../../Entities/Admin/Department";

export const SET_DEPARTMENT = "SET_DEPARTMENT";
export const SET_DEPARTMENT_TREE = "SET_DEPARTMENT_TREE";
export const SET_FLAT_DEPARTMENTS = "SET_FLAT_DEPARTMENTS";

export const setDepartmentTree = generateActionFunc(SET_DEPARTMENT_TREE);
export const setDepartment = generateActionFunc(SET_DEPARTMENT);
export const setFlatDepartments = generateActionFunc(SET_FLAT_DEPARTMENTS);

function getAllIds(tree) {
  let ids = [];
  tree.forEach(x => {
    if(x.children && x.children.length > 0) {
      ids = ids.concat(getAllIds(x.children));
    }
    ids.push(x.globalIndex);
  });
  return ids;
}

export function loadDepTree() {
  const handler = (json, dispatch, getState) => {
    let tree = new DepartmentTree(json.data.tree);
    const ids = getAllIds(tree.tree);
    dispatch(setTaskOpen({globalIndexes: ids}));
    dispatch(setDepartmentTree(tree));
  }
  return fetchAsync(`/data/depttree`, handler);
}

export function loadDepartment(department) {
  const handler = (json, dispatch, getState) => {
    const department = new Department(json.data);
    dispatch(setDepartment({department}));
  }
  return fetchAsync(`/get/department?id=` + department.id, handler);
}

export function loadFlatDepartments() {
  const handler = (json, dispatch, getState) => {
    const mapped = json.data.departments.map(x => ({label: x.name, value: x.id}));
    dispatch(setFlatDepartments({departments: mapped}));
  }
  return fetchAsync(`/all/departments`, handler);
}

export function editDepartment (data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadDepTree());
      dispatch(loadFlatDepartments());
  }
  return fetchPost(`/edit/department`, data, handler);
}

export function deleteDepartment (data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadDepTree());
      dispatch(loadFlatDepartments());
  }
  return fetchPost(`/delete/department?id=${data.id}`, data, handler);
}



export function createDepartment (data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadDepTree());
      dispatch(loadFlatDepartments());
  }
  return fetchPost(`/create/department`, data, handler);
}