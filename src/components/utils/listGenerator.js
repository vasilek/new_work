import React from "react";
import next from "../../Icons/next.svg";
import MenuItem from 'material-ui/MenuItem';
import { List } from 'react-virtualized';
let helpers = {};


helpers.generateComments = function(comments = []) {
  const makeCommentBlock = function(comment) {
    return (
      <div className="commentBlock" key={comment.id}>
        <div className="headerCommentBlock"><span>{comment.author.name},</span><span style={{marginLeft:"10px"}}>{comment.date}</span></div>
        <span style={{ marginLeft:"5px", fontWeight:"bold"}}>{comment.comment}</span>
      </div>
    )
  }
  let commentBlocks = [];
  for(var i = 0; i < comments.length; i++) {
    commentBlocks[i] = makeCommentBlock(comments[i]);
  }
  return commentBlocks;
}


helpers.createExecutors = function(executors) {
  let executorDivs = [];
  if(executors) {
    executors.forEach((x,i) => {
      const name = x.name.split(' ').map(x=>x[0].toUpperCase());
      executorDivs.push(<div className="singleExecutor" key={x.id}>
      <span data-tip={x.name}>{name}</span></div>)
    });
  }
  return executorDivs;
}


helpers.generateChildren = function(items,props, config) {
  const itemActionButtons = config.itemActionButtons;
  const additionalChildrenClassesDict = config.additionalChildrenClassesDict;
  const itemClickAction = config.itemClickAction;
  const childrenActionButtons = config.childrenActionButtons;
  let elements = [];
  items = items || [];
  items.filter(x => !x.ignored).forEach((item, i) => {
    let children = [];
    const hasChildren = item.children && item.children.length > 0;
    let elem = {};
    let wrapItemContainer = (task,children) => {

      return (
          <div className="taskContainer" key={item.id}>
          {task}
            <div className={"tasks " + (item.opened? 'opened' : 'closed')}>
              {children}
            </div>
          </div>
      )
    }
    elem = (
        <div className={"single-task " + (item.active ? " active" : "") + " " + additionalChildrenClassesDict(item)} key={item.id}>
          <span className="taskLabel" onClick={itemClickAction.bind(this,item)}>{item.name || item.title}</span>
           {childrenActionButtons ? childrenActionButtons(item) : <div className="noDisplay"/>}
        </div>
    );
    if(hasChildren) {
      children = helpers.generateChildren(item.children, props, config);
      elem = wrapItemContainer(elem, children)
    }
    elements.push(elem);
  });
  return elements;
}

helpers.generateMenuItems =  function(menuItems) {
  let items = [];
  menuItems.forEach((item, i) => {
    items.push(
      <MenuItem value={item.id} key={item.id} primaryText={item.text}/>
    );
  });
  return items;
}


helpers.generateContainers = function (entities, props, config) {
  let Containers = [];
  const treeData = entities.filter(x=>!x.ignored);
    for(var i = 0; i < treeData.length; i++) {
      let items = [];
      if(treeData[i].opened) {
        items = helpers.generateContainers(treeData[i].children, props, config);
      }
      Containers.push(treeData[i]);
      Containers = Containers.concat(items);
    }
   return Containers;
}

helpers.generateMainContainers = function (entities, props, config) {
    const listItemRender = config.listItemRender;
    let treeData = entities.tree;
    let data = helpers.generateContainers(entities.tree, props, config);
    return data.map(x => listItemRender(x));
}



export default helpers.generateMainContainers;