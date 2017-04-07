import React from "react";
import {getDateRange} from "../../redux/actions/tableActions";
let helpers = {};
import Icon from "../../Icons/Icon";
import taskHelpers from "../Tasks/taskHelpers";


helpers.generateHeaders = function (headers = [], datedLabors, onAccept) {
  let th = [<th key="0">Название</th>];
  for(var i = 1; i <= headers.length; i++) {
    const newLabors = datedLabors[headers[i-1]] ? datedLabors[headers[i-1]].filter(x=> x.rawstatus===0) : [];
    const canAcceptAll = (newLabors.length > 0) && newLabors.every(x => x.rights.accept);
    th[i] = (
      <th key={i} className="table-header">
        <div>
          <span>{headers[i-1]}</span>
          <Icon name="acceptTrud" className={`clickable-image openTrud small ` + ( canAcceptAll ?  "" : "noDisplay")} onClick={onAccept.bind(this, headers[i-1], newLabors)}/>
        </div>
      </th>
    );
  }
  return th;
}


helpers.generateRows = function(data = [], props, config, dataField) {
  const renderRow = config.renderRow;
  const renderCell = config.renderCell;
  let rows = [];
  if(!data || data.length === 0) {
    return [];
  }
  const elements = data.data;
  const headers = data.headers;
  let finalTimes = {};
  const tdWidth = data.headers ? 70 / data.headers.length : 0;
  for(var i = 0; i < Object.keys(elements).length;i++) {
    let elem = elements[Object.keys(elements)[i]];
    if(elem.ignored) {
      continue;
    }
    let td = [];
    let labors = [];
    for(var j = 0; j < headers.length; j++) {
      const val = elem[dataField][headers[j]];
      td[j] = (renderCell(val, headers[j], tdWidth));
    }
    rows[i] = (renderRow(td,Object.keys(elements)[i].split("|id|")[0],elem))
  }
  let finalcell = [];
  //const finalRows = rows.concat(finalRow);
  return {rows: rows};
}


helpers.getWeek = function(date) {
    var onejan = new Date(date.getFullYear(),0,1);
    var today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    var dayOfYear = ((today - onejan +1)/86400000);
    return Math.ceil(dayOfYear/7)
};

helpers.getDateRange = getDateRange;

export default helpers;