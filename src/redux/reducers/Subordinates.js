import {
  SET_PEOPLE_TREE
} from "../actions/subordinateActions.js";

import {normalizeTree} from "../../Entities/Subordinates/SubordinatesTree";


export function setSubordinates(state = [], action) {
  switch (action.type) {
    case SET_PEOPLE_TREE:
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