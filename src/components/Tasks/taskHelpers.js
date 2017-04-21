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

helpers.generateMenuItems =  function(menuItems) {
  let items = [];
  menuItems.forEach((item, i) => {
    items.push(
      <MenuItem value={item.id} key={item.id} primaryText={item.text}/>
    );
  });
  return items;
}

helpers.createExecutors = function(executors) {
  let executorDivs = [];
  let smallDivs = [];
  if(executors && executors.length > 3) {
      executors.forEach((x,i) => {
        let name = x.name || x.label;
        smallDivs.push(name);
      });
  } else if(executors && executors.length > 0) {
    executors.forEach((x,i) => {
      let name = x.name ? x.name.toString().trim().split(' ').map(x=>x[0].toUpperCase()) : (x.label ? x.label.toString().trim().split(' ').map(x=>x[0].toUpperCase()) : " ");
      name = name.slice(0,2).join("");
      executorDivs.push(<div className="singleExecutor" key={x.id || x.value}><span data-tip={x.name || x.label}>{name}</span></div>)
    });
  } else if(executors.length == 0){
      executorDivs.push(<div className="singleExecutor non-distributed" key={-1}><span data-tip={"Не распределено"}>Н</span></div>)
  }
  if(smallDivs.length) {
    executorDivs.push(<div className="singleExecutor" key={-2}><span data-html data-tip={"<b>Исполнители:  </b><br/>" + smallDivs.join(",<br/> ")}>...</span></div>)
  }
  return executorDivs;
}

export default helpers;