import React from "react";
import ReactTooltip from 'react-tooltip';

export function createTaskBlocks(obj) {
  let blocks = [];
  let data = obj.normatives;
  let max_val = obj.max_val;
  const countWidth = function(val) {
    let percent = 0;
    if(val) {
      percent = ((val / max_val) * 100)+"%";
      return percent;
    } else {
      return percent;
    }
  }
  for(let i = 0; i < data.length; i++) {
    let task = (
      <div className="taskBlock"><div>{data[i].name}</div></div>
    );
    let lowerTotal = data[i].done_hours + (data[i].underwork || 0);
    let upperTotal = data[i].max_hours +(data[i].overwork || 0);
    let upperWidth = countWidth(upperTotal);
    let lowerWidth = countWidth(lowerTotal);

    let maxHoursWidth = (data[i].max_hours / upperTotal) * 100 + "%";
    let overWorkWidth = (data[i].overwork / upperTotal) * 100 + "%";
    let doneHoursWidth = (data[i].done_hours / lowerTotal) * 100 + "%";
    let underWorkWidth = (data[i].underwork / lowerTotal) * 100 + "%";
    let hours = (
      <div className="hoursBlock">
        <div className="upperBlock" style={{minWidth: upperWidth, maxWidth: upperWidth}}>
          {data[i].max_hours ? <div className="normativeBlock" data-tip="Норматив" style={{width:maxHoursWidth}}><div>{data[i].max_hours}</div></div> : <div className="noDisplay"/>}
          {data[i].overwork ? <div className="overworkBlock" data-tip="Переработка" style={{width:overWorkWidth}}><div>{data[i].overwork}</div></div> : <div className="noDisplay"/>}
        </div>
        <div className="lowerBlock" style={{minWidth: lowerWidth, maxWidth: lowerWidth}}>
          {data[i].done_hours ? <div className="workdoneBlock" data-tip="Выполнено" style={{width:doneHoursWidth}}><div>{data[i].done_hours}</div></div> : <div className="noDisplay"/>}
          {data[i].underwork ? <div className="underworkBlock" data-tip="Остаток" style={{width:underWorkWidth}}><div>{data[i].underwork}</div></div> :  <div className="noDisplay"/>}
        </div>
      </div>
    )
    let container = (
      <div className="containerBlock" key={i}>
        <div className="innerTaskContainerBlock">
          {task}
        </div>
        <div className="innerHoursContainerBlock">
          {hours}
        </div>
      </div>
    )
    blocks.push(container);
  }
  return blocks;
}