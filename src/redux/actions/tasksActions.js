export const LOAD_TASKS = "LOAD_TASKS";
export const SET_TASKS = "SET_TASKS";
export const TOGGLE_OPEN = "TOGGLE_OPEN";
export const SET_TASK_VIEW = "SET_TASK_VIEW";
export const TOGGLE_TASK_OPEN = "TOGGLE_TASK_OPEN";
export const ACTIVATE_TASK = "ACTIVATE_TASK";
export const DEACTIVATE_TASKS = "DEACTIVATE_TASKS";
export const SET_ACTIVE_TASK_TAB = "SET_ACTIVE_TASK_TAB";
export const SET_CURRRENT_LABOR = "SET_CURRRENT_LABOR";
export const OPEN_LABOR_COMMENT = "OPEN_LABOR_COMMENT";
export const SET_GROUPED_LABORS = "SET_GROUPED_LABORS";
export const OPEN_DESCRIPTION = "OPEN_DESCRIPTION";
export const SET_CURRENT_TASK_COMMENT = "SET_CURRENT_TASK_COMMENT";
export const SET_ADDING_TRUD_TASK = "SET_ADDING_TRUD_TASK";
export const SELECT_TABLE_LABORS = "SELECT_TABLE_LABORS";
export const GET_WORK_CODES = "GET_WORK_CODES";
export const SET_CODES = "SET_CODES";
export const SET_FINANCES = "SET_FINANCES";
export const SET_GROUPED_TABLE_LABORS = "SET_GROUPED_TABLE_LABORS";
export const SET_GLOBAL_TASK_TYPE = "SET_GLOBAL_TASK_TYPE";
export const SET_LABOR_VIEW = "SET_LABOR_VIEW";
export const CLOSE_LABOR = "CLOSE_LABOR";
export const SET_TASK_OPEN = "SET_TASK_OPEN";
export const CHANGE_TREE_FILTER = "CHANGE_TREE_FILTER";

import {
    reset
} from 'redux-form';
import Task from "../../Entities/Tasks/Task";
import {TaskTree} from "../../Entities/Tasks/TaskTree";
import moment from "moment";
import _ from "lodash";
import Labor from "../../Entities/Tasks/Labor";
import {
    toggleRightPanel,
    closeTrudModal
} from "./layoutActions";
import {
  loadTableData,
  setGrouped,
  setTableData
} from "./tableActions";
import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "./actionHelper.js";

export const setAddingTrudTask_ = generateActionFunc(SET_ADDING_TRUD_TASK);
export const setTasks = generateActionFunc(SET_TASKS);
export const setLabor = generateActionFunc(SET_CURRRENT_LABOR);
export const setTaskView = generateActionFunc(SET_TASK_VIEW);
export const toggleTaskOpen = generateActionFunc(TOGGLE_TASK_OPEN);
export const activateTaskList = generateActionFunc(ACTIVATE_TASK);
export const setActiveTaskTab = generateActionFunc(SET_ACTIVE_TASK_TAB);
export const openLaborComment = generateActionFunc(OPEN_LABOR_COMMENT);
export const openDescription = generateActionFunc(OPEN_DESCRIPTION);
export const setCurrentTaskComment = generateActionFunc(SET_CURRENT_TASK_COMMENT);
export const setGroupedLabors = generateActionFunc(SET_GROUPED_LABORS);
export const setGroupedTableLabors = generateActionFunc(SET_GROUPED_TABLE_LABORS);
export const setCodes = generateActionFunc(SET_CODES);
export const setFinances = generateActionFunc(SET_FINANCES);
export const setLaborView = generateActionFunc(SET_LABOR_VIEW);
export const closeLabor= generateActionFunc(CLOSE_LABOR);
export const setGlobalTaskType = generateActionFunc(SET_GLOBAL_TASK_TYPE);
export const setTaskOpen = generateActionFunc(SET_TASK_OPEN);

function searchGlobalIndexesTreeByTaskId(id, tree) {
  let globalIndexes = [];
  tree.forEach((x,i) => {
    if(x.children) {
      let openedChildren = searchGlobalIndexesTreeByTaskId(id, x.children);
      if(openedChildren.length !== 0) {
        globalIndexes = globalIndexes.concat(openedChildren);
        globalIndexes.push(x.globalIndex);
      }
    }
    if(x.id == id) {
      globalIndexes.push(x.globalIndex);
    }
  });
  return globalIndexes;
}

export function setAddingTrudTask(task) {
  return (dispatch, getState) => {
    const user = getState().User.user;
    dispatch(setAddingTrudTask_({task: task.task, user}));
  }
}

export function activateTask(obj) {
  return function(dispatch, getState) {
    const currentIndexes = getState().activeIndexes;
    if(currentIndexes.taskId === obj.taskId && currentIndexes.globalIndex == obj.globalIndex) {
      dispatch(toggleRightPanel({status: 0}));
      console.log("0")
      dispatch(activateTaskList({taskId: -1, globalIndex: -1}));
    } else {
      dispatch(activateTaskList(obj));
      console.log("1")
      dispatch(toggleRightPanel({status: 1}));
    }
  }
}

export function groupLabors(labors) {
    labors.sort((a, b) => a.startDate < b.startDate ? 1 : -1);
    let groups = _.groupBy(labors, function (labor) {
        return moment(labor.startDate).startOf('day').format();
    });
    return groups;
}

export function loadTask(obj, callback) {
    const handler = function (json, dispatch, getState) {
        const task = new Task(json.data);
        dispatch(setTaskView({task, parent_id: task.parent_id || 0}));
        const labors = json.data.timings.map((x) => new Labor(x));
        const groups = groupLabors(labors);
        dispatch(setGroupedLabors({groups}));
        dispatch(setGrouped(task.id));
        if(callback) {
          callback(task);
        }
    }
    return fetchAsync(`/get/task?id=${obj.id}`, handler);
}


export function createTask(data) {
    const handler = (json,dispatch, getState) => {
      const callback = () => {
        const tasks = getState().tasks;
        if(tasks) {
          const openIds= searchGlobalIndexesTreeByTaskId(json.data.id, tasks.tree);
          const currentOpened = getState().openedTasks;
          let newOpened = mergeArrays(openIds, currentOpened);
          dispatch(setTaskOpen({globalIndexes:newOpened}));
        }
        dispatch(activateTask({taskId: json.data.id}));
      }



      dispatch(loadTasks(callback));
      dispatch(reset('newTaskInfoDialogForm'));
      dispatch(loadTask(json.data));
    }
    data.start_dt = (new Date(data.startDate)).getTime() / 1000;
    return fetchPost(`/create/task`, data, handler);
}

export function deleteTask(data) {
  const handler = (json,dispatch, getState) => {
    dispatch(loadTasks());
    dispatch(reset('newTaskInfoDialogForm'));
  }
  return fetchAsync(`/delete/task?id=${data.id}`, handler);
}

export function deleteTiming(data) {
  const handler = (json,dispatch, getState) => {
    dispatch(loadTask({id: data.task_id}));
    const currentWeek = getState().Table.currentWeek;
    dispatch(loadTableData({day: currentWeek}));
  }
  return fetchAsync(`/delete/time?id=${data.id}`, handler);
}

const statusDict = {
  0: "Новая",
  1: "Завершена",
  2: "Удалена",
  3: "Подтверждена",
  4: "Отклонена"
}

export function editTask(data, task) {
  const handler = (json,dispatch, getState) => {
    let tasks = getState().tasks;
    const t = new Task(json.data);
    if(tasks) {
      let newTasks = tasks.treeNormalized.byId[t.id];
      if(newTasks) {
        for(let i = 0; i< newTasks.length; i++) {
          newTasks[i].name = t.name;
          newTasks[i].executors = t.executors;
          newTasks[i].rawstatus = t.rawstatus;
          newTasks[i].status = statusDict[t.rawstatus];
        }
      }
      tasks.changed = !tasks.changed;
      dispatch(setTasks({tasks}));
    }
    dispatch(setTaskView({task: t, parent_id: t.parent_id || 0}));
  }
  const errorHandler = (dispatch) => {
    dispatch(loadTask(task));
    dispatch(reset("taskInfoDialogForm"));
  }
  data.start_dt = (new Date(data.startDate)).getTime() / 1000;
  return fetchPost(`/edit/task`, data, handler, errorHandler);
}



export function loadLabor(labor) {
    const handler = function (json, dispatch) {
        let labor = new Labor(json.data);
        dispatch(setLaborView({
            labor
        }));
        dispatch(toggleRightPanel({
            status: 1
        }));

    }
    return fetchAsync(`/get/time?id=${labor.id}`, handler);
}

export function createLabor(data, task) {
    const handler = (json,dispatch, getState) => {
      dispatch(loadTask(task));
      dispatch(closeTrudModal());
      dispatch(reset('trudDialogForm'));
      const currentWeek = getState().Table.currentWeek;
      dispatch(loadTableData({day: currentWeek}));
    }
    const errorHandler = (dispatch) => {

    }
    data.date = (new Date(data.startDate)).getTime() / 1000;
    return fetchPost(`/create/time`, data, handler, errorHandler);
}

export function editLabor(data, fromLabor, fromTable) {
  const handler = (json, dispatch, getState) => {
    const currentLabor = new Labor(json.data);
    const newVal = currentLabor.value;
    if(fromLabor) {
      const currentWeek = getState().Table.currentWeek;
    }
    if(fromTable) {
      let tableData = getState().Table.tableData;
      let currentCell = tableData.laborsCellsByIds[currentLabor.id];
      let timing = currentCell.timings.filter(x => x.id == currentLabor.id)[0];
      const oldVal = timing.value;
      if(timing.date == currentLabor.date) {
        currentCell.myHours += parseInt(newVal) - parseInt(oldVal);
        currentCell.allHours += parseInt(newVal) - parseInt(oldVal);
        tableData.overallDated[currentLabor.date].overallMy +=  parseInt(newVal) - parseInt(oldVal);
        tableData.overallDated[currentLabor.date].overallTotal +=  parseInt(newVal) - parseInt(oldVal);
        timing.value = newVal;
        timing.code = currentLabor.code;
        timing.status = currentLabor.status;
        dispatch(setTableData({tableData}));
      } else {
        const currentWeek = getState().Table.currentWeek;
        dispatch(loadTableData({day: currentWeek}));
      }
    }
  }
  const errorHandler = (dispatch) => {
    dispatch(loadTask({id: data.task_id}));
    dispatch(reset("taskInfoDialogForm"));
  }
  data.date = (new Date(data.startDate)).getTime() / 1000;
  return fetchPost('/edit/time', data, handler,errorHandler);
}

export function loadWorkCodes() {
    const handler = (data, dispatch) => {
        let codes = data.data.codes.map(x => ({value: x.id, label: x.value + ", " + x.description}));
        dispatch(setCodes({
            codes
        }));
    }
    return fetchAsync(`/all/codes`, handler);
}


export function loadFinances() {
    const handler = (data, dispatch) => {
        let finances =  data.data.finances.map(x => ({value: x.id, label:  x.value + ", " + x.description}));
        dispatch(setFinances({
            finances
        }));
    }
    return fetchAsync(`/all/finances`, handler);
}

const typeDict = {
  "nonDistributed": "Нераспределённые задачи",
  "my": "Мои задачи",
  "subordinate": "Задачи подчинённых",
  "all" : "Все задачи"
}



export function loadTasks(callback) {
    return (dispatch, getState) => {
      const params = getState().currentTaskFilters;
      let par = {};
      let paramArr = [];
      par.type = params.type;
      par.user_ids  = params.sub_ids ? params.sub_ids.join(",") : "";
      par.all_subs = params.all_subs;
      par.status = params.statuses.join(",");
      for(var e in par) {
        if(par[e]) {
          paramArr.push(`${e}=${par[e]}`);
        }
      }
      dispatch(loadTree(paramArr, callback))
    }
}

function mergeArrays(arr1, arr2) {
  let newArr = [];
  for(let i = 0; i < arr2.length; i++) {
    newArr.push(arr2[i]);
  }
  for(let i = 0; i < arr1.length; i++) {
    if(!~arr2.indexOf(arr1[i])) {
      newArr.push(arr1[i]);
    }
  }
  return newArr;
}

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

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


export function loadTree(params, callback) {
  const handler = function (json, dispatch, getState) {
      const type = getState().globalTaskType;
      let tasks = new TaskTree(json.data.tree);
      const currentOpened = getState().openedTasks;
      const searchQuery = getState().searchQuery;
      let openedBySearch = [];
      if(searchQuery !== "") {
        openedBySearch = searchGlobalIndexesTreeByName(searchQuery, tasks.tree);
      }
      if(type!== "all") {
        const name = typeDict[type];
        const chosenTasks = tasks.tree.filter(x => x.name === name);
        const opened =  [chosenTasks[0].globalIndex];
        let newOpened = mergeArrays(opened,currentOpened);
        if(openedBySearch.length !== 0) {
          newOpened = mergeArrays(newOpened,openedBySearch);
        }
        if(chosenTasks[0]) {
          dispatch(setTaskOpen({globalIndexes:newOpened}));
        }
        dispatch(setTasks({
            tasks: {tree: chosenTasks, treeNormalized: tasks.treeNormalized}
        }));
      } else {
        const opened =  tasks.tree.map(x=>x.globalIndex);
        let newOpened = mergeArrays(opened,currentOpened);
        if(openedBySearch.length !== 0) {
          newOpened = mergeArrays(newOpened,openedBySearch);
        }
        dispatch(setTaskOpen({globalIndexes: newOpened}));
        dispatch(setTasks({
            tasks: tasks,
            treeNormalized: tasks.treeNormalized
        }));
      }
      if(callback && isFunction(callback)) {
        callback();
      }
  }
 return fetchAsync(`/data/tree?${params.join("&")}`, handler);
}

export function createComment(data, task, fromLabor) {
  const handler = (json,dispatch, getState) => {
    if(fromLabor) {
      const currentWeek = getState().Table.currentWeek;
      dispatch(loadLabor({id: data.time_id}));
      dispatch(loadTableData({day: currentWeek}));
    } else {
      dispatch(loadTask({id: data.task_id}));
    }
  }
  const errorHandler = (dispatch) => {
    if(fromLabor) {
      dispatch(loadLabor({id: data.time_id}));
    } else {
      dispatch(loadTask({id: data.task_id}));
    }
  }
  return fetchPost(`/create/comment`, data, handler, errorHandler);
}


export function acceptAllTimings(ids, task, fromTable) {
  const handler = (json, dispatch, getState) => {
      const currentWeek = getState().Table.currentWeek;
      dispatch(loadTableData({day: currentWeek}));
      if(task) {
        dispatch(loadTask({id: task.id}));
      }
  }
  if(ids.length > 0) {
    return fetchAsync(`/data/accepttime?ids=${ids.join(",")}`, handler);
  }
}

export function acceptTask(task) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadTask({id: task.id}));
    dispatch(loadTasks());
  }
  return fetchAsync("/data/accepttask?id="+task.id, handler);
}

export function declineTask(task) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadTask({id: task.id}));
    dispatch(loadTasks());
  }
  return fetchAsync("/data/declinetask?id="+task.id, handler);
}

export function acceptTiming(labor, fromLabor) {
  const handler = (json, dispatch, getState) => {
    const currentWeek = getState().Table.currentWeek;
    dispatch(loadTableData({day: currentWeek}))
    if(fromLabor) {
      dispatch(loadLabor({id: labor.id}));
    } else {
      dispatch(loadTask({id: labor.task_id}));
    }
  }
  return fetchAsync("/data/accepttime?ids=" + labor.id, handler);
}

export function declineTiming(labor, fromLabor, comment) {
  const handler = (json, dispatch, getState) => {
    const currentWeek = getState().Table.currentWeek;
    dispatch(loadTableData({day: currentWeek}))
    if(fromLabor) {
      dispatch(loadLabor({id: labor.id}));
    } else {
      dispatch(loadTask({id: labor.task_id}));
    }
  }
  return fetchAsync("/data/declinetime?ids=" + labor.id + (comment ? ("&comment="+ comment) : ""), handler);
}

export function completeTask(task) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadTask({id: task.id}));
    dispatch(loadTasks());
  }
  return fetchAsync("/data/completetask?id=" + task.id, handler);
}

export function reopenTask(task) {
  const handler = (json, dispatch, getState) => {
    dispatch(loadTask({id: task.id}));
    dispatch(loadTasks());
  }
  return fetchAsync("/data/reopentask?id=" + task.id, handler);
}