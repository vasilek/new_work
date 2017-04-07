import {
    SET_TASKS,
    TOGGLE_TASK_OPEN,
    ACTIVATE_TASK,
    SET_TASK_VIEW,
    SET_ACTIVE_TASK_TAB,
    OPEN_LABOR_COMMENT,
    SET_CURRRENT_LABOR,
    OPEN_DESCRIPTION,
    SET_GROUPED_LABORS,
    SET_CURRENT_TASK_COMMENT,
    SET_ADDING_TRUD_TASK,
    SET_CODES,
    SET_FINANCES,
    SET_LABOR_VIEW,
    SET_TASK_OPEN,
    CLOSE_LABOR,
    SET_GLOBAL_TASK_TYPE,
    SET_GROUPED_TABLE_LABORS
} from "../actions/tasksActions";
import {
  TOGGLE_RIGHT_PANEL,
  CLEAR_LAYOUT,
  CLOSE_TRUD_MODAL
} from "../actions/layoutActions";
import {
  LOGOUT
} from "../actions/userActions";


function findLaborById(labors, id) {
    let elem = -1;
    for (var i = 0; i < labors.length; i++) {
        if (labors[i].id === id) {
            elem = labors[i];
            break;
        }
    }
    return elem;
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
  sub_ids: []
}

const filtersDict = {
  "all" : defaultAllFilters,
  "my": defaultMyFilters,
  "nonDistributed": defaultNonDistFilter,
  "subordinate": defaultSubsFilters
}

export function setDefaultFilters(state = defaultFilters, action) {
  switch (action.type) {
    case SET_GLOBAL_TASK_TYPE:
      const defFilters = Object.assign({},{type: filtersDict[action.routeType].type},JSON.parse(JSON.stringify(defaultFilters)));
      return defFilters;
    case CLEAR_LAYOUT:
      return defaultFilters;
    default:
      return state;
  }
}

export function addingTrudTask(state = {}, action) {
    switch (action.type) {
    case SET_ADDING_TRUD_TASK:
        action.task.user = action.user;
        return action.task;
    case LOGOUT:
        return {};
    default:
        return state;
    }
}

export function setCodes(state = [], action) {
    switch (action.type) {
    case SET_CODES:
        return action.codes;
    default:
        return state;
    }
}

export function setFinances(state = [], action) {
    switch (action.type) {
    case SET_FINANCES:
        return action.finances;
    default:
        return state;
    }
}

export function setCurrentTaskComment(state = "", action) {
    switch (action.type) {
    case SET_CURRENT_TASK_COMMENT:
        return action.text
    default:
        return state;
    }

}

export function setTaskView(state = false, action) {
    switch (action.type) {
    case SET_TASK_VIEW:
        action.task.parent_id = action.parent_id || 0;
        action.task.parent_task = action.parent_task || null;
        return action.task;
    case OPEN_DESCRIPTION:
        action.task.descriptionOpen = true;
        return JSON.parse(JSON.stringify(state));
    default:
        return state;
    }
}

export function setLaborView(state = false, action) {
    switch (action.type) {
    case SET_TASK_VIEW:
        return false;
    case CLOSE_LABOR:
        return false;
    case SET_LABOR_VIEW:
        return action.labor;
    default:
        return state;
    }
}


export function setActiveTaskTab(state = "trud", action) {
    switch (action.type) {
    case SET_ACTIVE_TASK_TAB:
        return action.value;
    default:
        return state;
    }
}

export function setGroupedTableLabors(state = [], action) {
  switch (action.type) {
    case SET_GROUPED_TABLE_LABORS:
      return action.groups;
    case OPEN_LABOR_COMMENT:
        const keys = Object.keys(state);
        for (var i = 0; i < keys.length; i++) {
            let labor = findLaborById(state[keys[i]], action.id);
            if (labor !== -1) {
                labor.commentsOpened = !labor.commentsOpened;
            }
        }
        return JSON.parse(JSON.stringify(state));
    default:
        return state;
  }
}

export function setGroupedLabors(state = [], action) {
    switch (action.type) {
    case SET_GROUPED_LABORS:
        return action.groups;
    case OPEN_LABOR_COMMENT:
        const keys = Object.keys(state);
        for (var i = 0; i < keys.length; i++) {
            let labor = findLaborById(state[keys[i]], action.id);
            if (labor !== -1) {
                labor.commentsOpened = !labor.commentsOpened;
            }
        }
        return JSON.parse(JSON.stringify(state));
    default:
        return state;
    }
}

export function setCurrentLabors(state = {}, action) {
    switch (action.type) {
    case SET_CURRRENT_LABOR:
        return action.labors;

    default:
        return state;
    }
}

export function setActiveIndexes(state = {taskId: -1, globalIndex: -1}, action) {
  switch (action.type) {
    case ACTIVATE_TASK:
      return {taskId: action.taskId ? action.taskId : state.taskId, globalIndex: action.globalIndex ? action.globalIndex : state.globalIndex};
    case TOGGLE_RIGHT_PANEL:
      if(action.status === 0) {
        return {taskId: -1, globalIndex: -1}
      } else {
        return state;
      }
    case CLEAR_LAYOUT:
      return {taskId: -1, globalIndex: -1}
    default:
      return state;
  }
}

export function setOpenedTasks(state=[], action) {
  switch (action.type) {
    case TOGGLE_TASK_OPEN:
      let newState = state.slice();
      const idx = newState.indexOf(action.globalIndex);
      if(~idx) {
        newState.splice(idx,1);
      } else {
        newState.push(action.globalIndex);
      }
      return newState;
    case SET_TASK_OPEN:
      return action.globalIndexes
    default:
      return state;
  }
}


import {normalizeTree} from "../../Entities/Tasks/TaskTree";

export function setTasks(state = [], action) {
    switch (action.type) {
    case SET_TASKS:
    let tasks = {
      byId: {},
      byGlobalId: {}
    };
        let newTasks = {};
        newTasks.tree = JSON.parse(JSON.stringify(action.tasks.tree));
        normalizeTree(newTasks.tree, 0,0, tasks);
        newTasks.treeNormalized = tasks;
        return newTasks;
    default:
        return state;
    }
}

