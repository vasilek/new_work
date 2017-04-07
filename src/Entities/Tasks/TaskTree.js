import Task from "./Task";
const dict = {
  "Мои задачи": 1,
  "Задачи подчинённых": 2,
  "Нераспределённые задачи": 3
}

export function normalizeTree(tree, pInd, level, tasks) {
  tree.forEach((item, index) => {
    let parentIndex = -1;
    if(item.type === "NODE") {
      parentIndex = dict[item.name];
    } else if(pInd) {
      parentIndex = pInd;
    }
    normalizeTree(item.children, parentIndex, level+1, tasks);
    tasks.byGlobalId[parentIndex + "_" + item.id] = item;
    if(!tasks.byId[item.id]) {
      tasks.byId[item.id] = [];
    }
    tasks.byId[item.id] = tasks.byId[item.id].concat(item);
  });
}

function parseTree(tree, pInd, level) {
  let container = [];
  container.globalIndexes = [];
  tree.forEach((item, index) => {
    let parentIndex = -1;
    if(item.type === "NODE") {
      parentIndex = dict[item.name];
    } else if(pInd) {
      parentIndex = pInd;
    }
    const children = parseTree(item.children, parentIndex, level+1);
    container[index] = {name:item.name, children: children, type: item.type,
      childrenGlobalIndexes: children.globalIndexes,
      level: level};
    if(item.type === "TASK") {
      let obj = new Task(item.task);
      Object.assign(obj,container[index]);
      container[index] = obj;
      container[index].type = "TASK";
    } else {
        container[index].type = "NODE";
    }
    container[index].globalIndex = parentIndex + "_" + container[index].id;
    container.globalIndexes[index] = container[index].globalIndex;
  });
  return container;
}

export class TaskTree {
  constructor(json) {
    let tasks = {
      byId: {},
      byGlobalId: {},
      allIds: []
    };
    const tree = json;
    this.tree = parseTree(tree, 0,0);
  }
}