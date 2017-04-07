export const SET_PEOPLE_TREE = "SET_PEOPLE_TREE";
import {
    generateActionFunc
} from "./actionHelper.js";
import {
    fetchAsync,
    fetchPost
} from "./actionHelper.js";

import {setTaskOpen} from "./tasksActions";

export const setPeopleTree = generateActionFunc(SET_PEOPLE_TREE);

import {SubordinatesTree} from  "../../Entities/Subordinates/SubordinatesTree";

export function loadPeopleTree() {
  const handler = (json, dispatch, getState) => {
    const subsTree = new SubordinatesTree([json.data.tree]);
    dispatch(setPeopleTree(subsTree));
    dispatch(setTaskOpen({globalIndexes: [subsTree.tree[0].globalIndex]}));
  }
  return fetchAsync("/data/peopletree", handler);
}