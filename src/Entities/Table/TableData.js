import moment from 'moment';
import _ from 'lodash';
import Labor from "../Tasks/Labor";
const addDays = function(date, days) {
    var dat = date;
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = addDays(currentDate,1);
    }
    return dateArray;
}

export function copyLaborsCells(tableData) {
    let laborsCellsByIds = {};
    let datedLabors = {};
    const data = tableData.data;
    for(var e in data) {
      for(var k in data[e].dates) {
        if(!datedLabors[k]) {
          datedLabors[k] = []
        }
        datedLabors[k] = datedLabors[k].concat(data[e].dates[k].timings);
        for(let i =0; i < data[e].dates[k].timings.length; i++) {
          laborsCellsByIds[data[e].dates[k].timings[i].id] = data[e].dates[k];
        }
      }
    }
    return {laborsCellsByIds, datedLabors};
}

export class TableData {
  constructor(json, first, last, pingedUser) {
    const dataInfo = json.data.tasks;
    let laborsCellsByIds = {};
    let datedLabors = {};
    let overallDated = {};
    const dateArray = getDates(first, last).map(x=> {
      const date =  moment(x).format('DD.MM');
      datedLabors[date] = [];
      overallDated[date] = {};
      overallDated[date].overallMy = 0;
      overallDated[date].overallTotal = 0;
      return date;
    });
    let datedTaskLabors = {};
    for(let i = 0; i < dataInfo.length; i++) {
      let timings = dataInfo[i].timings.map(x => new Labor(x));
      const taskName = dataInfo[i].name + "|id|" + dataInfo[i].id;
      datedTaskLabors[taskName] = {
        timings: timings,
        executors: dataInfo[i].executors,
        id: dataInfo[i].id,
        dates: {},
        status: dataInfo[i].status,
        rights:  dataInfo[i].rights
      };
      for(let j = 0; j < dateArray.length; j++) {
        datedTaskLabors[taskName].dates[dateArray[j]] = {
          val: 0,
          timings:  [],
          id: dataInfo[i].id,
          executors: dataInfo[i].executors,          
          rights:  dataInfo[i].rights
        };
      }

      for(let j = 0; j < dateArray.length; j++) {
        let currentTimings = timings.filter(x => x.date === dateArray[j]);
        let overallMy = 0;
        let overallTotal = 0;
        let hours = 0;
        let myHours = 0;
        for(let k = 0; k < currentTimings.length; k++) {
            datedLabors[dateArray[j]].push(currentTimings[k]);
            let val = currentTimings[k].value;
            if(!isNaN(parseFloat(val))) {
              hours += parseFloat(val);
              overallTotal += parseFloat(val);
              if(currentTimings[k].author.id === pingedUser) {
                myHours += parseFloat(val);
                overallMy += parseFloat(val);
              }
            }
          if(!laborsCellsByIds[currentTimings[k].id]) {
             laborsCellsByIds[currentTimings[k].id] = {};
          }
          laborsCellsByIds[currentTimings[k].id] = datedTaskLabors[taskName].dates[dateArray[j]];
        }
        datedTaskLabors[taskName].dates[dateArray[j]].overWork = parseFloat(myHours) > 8 ? true : false;
        datedTaskLabors[taskName].dates[dateArray[j]].myHours = myHours;
        datedTaskLabors[taskName].dates[dateArray[j]].allHours = hours;
        datedTaskLabors[taskName].dates[dateArray[j]].timings = currentTimings;
        datedTaskLabors[taskName].dates[dateArray[j]].hasUnaccepted = currentTimings.some(x => x.rawstatus === 0);
        datedTaskLabors[taskName].dates[dateArray[j]].commentsNumber = currentTimings.reduce((s,c) => s+c.comments.length,0);
        overallDated[dateArray[j]].overallMy += overallMy;
        overallDated[dateArray[j]].overallTotal += overallTotal;
      }
    }
    let data = {};
    this.headers = dateArray;
    this.data = datedTaskLabors;
    this.datedLabors = datedLabors;
    this.overallDated = overallDated;
    this.laborsCellsByIds = laborsCellsByIds;
  }
}