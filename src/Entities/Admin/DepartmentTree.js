import Department from "./Department";
export function normalizeTree(tree, pInd, level, tasks) {
  tree.forEach((item, index) => {
    let parentIndex = pInd || item.id;
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
    let parentIndex = pInd || item.object.id;
    const children = parseTree(item.children, parentIndex, level+1);
    container[index] = {name:item.name, children: children, level: level};
    let obj = new Department(item.object);
    Object.assign(obj,container[index]);
    container[index] = obj;
    container[index].globalIndex = parentIndex + "_" + container[index].id;
  });
  return container;
}

export class DepartmentTree {
  constructor(json) {
    let tasks = {
      byId: {},
      byGlobalId: {}
    };
    const tree = json;
    this.tree = parseTree(tree, 0,0);
    this.treeNormalized = tasks;
  }
}