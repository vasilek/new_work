import Code from "./Code";
export function normalizeTree(tree, tasks) {
  tree.forEach((item, index) => {
    tasks.byGlobalId[item.id] = item;
    if(!tasks.byId[item.id]) {
      tasks.byId[item.id] = [];
    }
    tasks.byId[item.id] = tasks.byId[item.id].concat(item);
  });
}

function parseTree(tree) {
  let container = [];
  container.globalIndexes = [];
  tree.forEach((item, index) => {
    container[index] = {name:item.name || item.value};
    let obj = new Code(item);
    Object.assign(obj,container[index]);
    container[index] = obj;
    container[index].globalIndex = container[index].id;
  });
  return container;
}

export class FinancesTree {
  constructor(json) {
    let tasks = {
      byId: {},
      byGlobalId: {}
    };
    const tree = json;
    this.tree = parseTree(tree);
    normalizeTree(this.tree, tasks);
    this.treeNormalized = tasks;
  }
}