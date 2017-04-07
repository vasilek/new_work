import User from "./User";
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
    container[index] = {name:item.name};
    let obj = new User(item);
    Object.assign(obj,container[index]);
    container[index] = obj;
    container[index].globalIndex = container[index].id;
  });
  return container;
}

export class UsersTree {
  constructor(json) {
    let tasks = {
      byId: {},
      byGlobalId: {}
    };
    const tree = json;
    this.tree = parseTree(tree);
    this.treeNormalized = tasks;
  }
}