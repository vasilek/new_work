import React from "react";
import {getDateRange, getDateMonthRange} from "../../redux/actions/tableActions";
let helpers = {};
import Icon from "../../Icons/Icon";
import taskHelpers from "../Tasks/taskHelpers";
import moment from "moment";


helpers.generateHeaders = function (headers = [], datedLabors, onAccept) {
  let th = [<th key="0">Название</th>];
  for(var i = 1; i <= headers.length; i++) {
    const newLabors = datedLabors[headers[i-1]] ? datedLabors[headers[i-1]].filter(x=> x.rawstatus===0) : [];
    const canAcceptAll = (newLabors.length > 0) && newLabors.every(x => x.rights.accept);
    const currentDay = moment().format("DD.MM");
    th[i] = (
      <th key={i} className="table-header">
        <div>
          <span className={currentDay == headers[i-1] ? "current-day" : ""}>{headers[i-1]}</span>
          <div data-tip={"Подтвердить все трудозатраты за " + headers[i-1]}>
            <Icon name="acceptTrud" className={`clickable-image openTrud small ` + ( canAcceptAll ?  "" : "noDisplay")} onClick={onAccept.bind(this, headers[i-1], newLabors)}/>
          </div>
        </div>
      </th>
    );
  }
  return th;
}


helpers.generateRows = function(data = [], clickHandler, rowClickHandler, props) {
  let rows = [];
  const elements = data.data;
  const headers = data.headers;
  const activeId = props.activeIndexes.taskId;
  let finalTimes = {};
  const tdWidth = data.headers ? 70 / data.headers.length : 0;
  if(!data || data.length === 0) {
    return [];
  }
  let datedLabors = {};

  for(var i = 0; i < Object.keys(elements).length;i++) {
    let elem = elements[Object.keys(elements)[i]];
    if(elem.id === activeId) {
      elem.active = true;
    } else {
      elem.active = false;
    }
    let td = [];
    let labors = [];
    for(var j = 0; j < headers.length; j++) {
      const val = elem[headers[j]];
      if(!datedLabors[headers[j]]) {
          datedLabors[headers[j]] = [];
      }
      let hasUnaccepted = false;
      if(val) {
        for(var k = 0; k < val.length; k++) {
          if(val[k].rawstatus === 0) {
            hasUnaccepted = true;
            break;
          }
        }
        labors = labors.concat(val);
        if(!finalTimes[headers[j]]) {
          finalTimes[headers[j]] = {my: val.myHours, all: val.hours};
        } else {
          finalTimes[headers[j]].my += val.myHours;
          finalTimes[headers[j]].all += val.hours;
        }
      }
      const commentsNumber = val ? val.timings.reduce((sum, cur) => sum + cur.comments.length, 0) : 0;
      datedLabors[headers[j]] = val ? datedLabors[headers[j]].concat(val.timings.reduce((sum, cur) => sum.concat(cur), []).filter(x => x.rawstatus === 0)) :  datedLabors[headers[j]];
      let comments = <div className="noDisplay"/>;
      if(commentsNumber > 0) {
        comments = <div className="comments-number">{commentsNumber}</div>
      }
      td[j] = (
        <td key={j} className={`tableCell  ${hasUnaccepted ? 'has-unaccepted' : ''}
        ${elem.active && (headers[j] === props.currentDay || props.currentDay === false)? "active" : ''}`} width={tdWidth+"%"}
          onClick={clickHandler.bind(this, val, elem.id, headers[j])}>{val ? (val.myHours + "/" + val.hours) : 0}
        {comments}</td>
      )
    }
    const executors = taskHelpers.createExecutors(elem.executors);
    rows[i] = (
      <tr key={i}>
        <td width="30%" className={`tableCell ${elem.active? "active" : ''}`} onClick={rowClickHandler.bind(this, labors, elem.id)}>
          {Object.keys(elements)[i].split("|id|")[0]} {executors} </td>
        {td}
      </tr>
    )
  }
  let finalcell = [];
  for(let j = 0; j < headers.length; j++) {
    const val = finalTimes[headers[j]];
    finalcell[j] = (
      <td key={98765+j} className="tableCell" width={tdWidth+"%"}>{val ? (val.my + "/" + val.all) : 0}</td>
    )
  }
  let finalRow = (
    <tr key={1234567} className="overall-row">
      <td width="30%" className="tableCell"> Итого </td>
      {finalcell}
    </tr>
  )
  const finalRows = rows.concat(finalRow);
  return {rows: finalRows, datedLabors};
}


helpers.getWeek = function(date) {
    var onejan = new Date(date.getFullYear(),0,1);
    var today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    var dayOfYear = ((today - onejan +1)/86400000);
    return Math.ceil(dayOfYear/7)
};

const cellGenerator = (val, key) => {
  return (<td className="tableCell" key={key}>{val}</td>);
}
const rowGenerator = (tds, key) => {
  return (
    <tr key={key}>
      {tds}
    </tr>
  )
}

helpers.generateSimpleRows = function(table) {
  const headers = table.headers;
  const data = table.data;
  let rows = [];
  for(let i = 0; i < data.length; i++) {
    const currentTask = data[i].data;
    let currentTds = [cellGenerator(data[i].name,"name")];
    for(let j = 0; j < headers.length; j++) {
      if(currentTask[headers[j]]) {
        currentTds.push(cellGenerator(currentTask[headers[j]], j))
      } else {
        currentTds.push(cellGenerator(0, j));
      }
    }
    rows.push(rowGenerator(currentTds, i));
  }
  return rows;
}

helpers.generateSimpleHeaders = function(table)  {
 const headers = table.headers;
 let ths= [<th key="empty"></th>];
 for(let i = 0; i < headers.length; i++) {
   ths.push(<th  className="table-header" key={i}>{headers[i]}</th>)
 }
 return rowGenerator(ths, "head");
}

function generateThs(number) {
  let ths = [];
  for(let i = 0; i < number; i++) {
    ths.push(<th key={"th-" + i}></th>);
  }
  return ths;
}

function generateTds(number) {
  let ths = [];
  for(let i = 0; i < number; i++) {
    ths.push(<td key={"td-" + i}></td>);
  }
  return ths;
}

helpers.generateUserReportTable = function(users, dateWords) {
  let rows = [];
  const daysNumber = 31;
  const totalTableWidth = daysNumber+3 + 9;
  const headerRow = [
    (<tr   key="header-row" className="noDisplay noBorder">
      {generateThs(6)}
      <th colSpan={totalTableWidth- 4 - 5 - 5} key="header-td">
        Табель №
      </th>
      {generateThs(11)}
    </tr>),,
    (<tr  key="header-row-2" className="noDisplay noBorder">
      {generateThs(6)}
      <th colSpan={totalTableWidth- 4 - 5 - 5} key="header-td">
        {"учета использования рабочего времени"}
      </th>
      {generateThs(7)}
      <th colSpan={4} key="header-td-4">
        Коды
      </th>
    </tr>),
    <tr key="a1" className="noDisplay">
      {generateThs(totalTableWidth - 5)}
      <th colSpan={4} key="header-td-5">
        Форма по ОКУД
      </th>
      <th colSpan={4} key="header-td-6">

      </th>
    </tr>,
    <tr key="a2 noBorder" className="noDisplay">
      {generateThs(14)}
      <th colSpan={12} key="header-td">
        {"за период " + dateWords}
      </th>
      {generateThs(totalTableWidth - 20 - 10)}
      <th colSpan={3} key="header-td-7">
        Дата
      </th>
      <th colSpan={4} key="header-td-8">

      </th>
    </tr>,
    <tr key="a3 noBorder" className="noDisplay" >
      <th  colSpan={3}>
        Учреждение:
      </th>
      {generateThs(4)}
      <th colSpan={25}>
        ФГБУ "НИИ ЦПК имени Ю.А. Гагарина"
      </th>
      {generateThs(totalTableWidth - 25 - 3 - 4 - 5)}
      <th colSpan={4} key="header-td-7">
        по ОКПО
      </th>
      <th colSpan={4} key="header-td-8">

      </th>
    </tr>,
    <tr key="a5 noBorder" className="noDisplay" >
      <th colSpan={7}>
        Структурное подразделение:
      </th>
      <th colSpan={25}>

      </th>
      {generateThs(totalTableWidth - 25 - 3 - 3 -2)}
      <th colSpan={4} key="header-td-8">

      </th>
    </tr>,
    <tr key="a7" className="noDisplay" >
      <th   colSpan={3}>
        Вид табеля:
      </th>
      {generateThs(4)}
      <th colSpan={25}>

      </th>
      {generateThs(totalTableWidth - 25 - 3 - 4 - 6)}
      <th colSpan={5} key="header-td-7">
        Номер корректировки
      </th>
      <th colSpan={4} key="header-td-8">

      </th>
    </tr>,
    <tr key="a9" className="noDisplay">
      {generateThs(14)}
      <th  colSpan={12}>
        (первичный - 0; корректирующий - 1, 2 и т.д.)
      </th>
      {generateThs(totalTableWidth - 12 - 14 - 8)}
      <th colSpan={7} key="header-td-7">
        Дата формирования документа
      </th>
      <th colSpan={4} key="header-td-8">
        {moment().format("DD/MM/YYYY")}
      </th>
    </tr>,
    <tr key="a10" className="noDisplay">
    </tr>
  ]
  rows = headerRow.concat([(
    <tr key="first-row">
      <th className="tg-yw4l" colSpan="3" rowSpan="4"  key="fio-header">
        Фамилия, имя, отчество
      </th>
      <th  className="tg-yw4l" colSpan="3" rowSpan="4" key="number-header">
        Учетный номер
      </th>
      <th className="tg-yw4l" colSpan="3" rowSpan="4"  key="position-header">
        Должность (профессия)
      </th>
      <th className="tg-yw4l" rowSpan="2" colSpan={daysNumber+6}  key="monthDates">
        Числа месяца
      </th>
    </tr>),
    <tr key="3422">
    </tr>]);
  let setHalf = false;
  let daysArr = [];
  let rownumbers = [<td className="tg-yw4l" colSpan="3" key="1" >1</td>,<td className="tg-yw4l" colSpan="3" key="2">2</td>,<td className="tg-yw4l" colSpan="3" key="3">3</td>];
    for(let i = 0; i < daysNumber; i++) {
      if(i+1 === 16 && !setHalf) {
        setHalf = true;
        rownumbers.push(<td className="tg-yw4l"  colSpan="3" key={i+3488}>{i+4}</td>);
        i--;
        continue;
      }
      rownumbers.push(<td className="tg-yw4l" key={setHalf ? i+ 3987 : i+3488}>{(setHalf ? (i+5) : (i+4))}</td>);
      daysArr.push(<td rowSpan="2" className="tg-yw4l" key={`days${i}`}>{i+1}</td>);
    }
    rownumbers.push(<td key={"hm"} className="tg-yw4l" colSpan="3" >{daysNumber+5}</td>);
    let dayTypesInfo = [];
    let financeRows = [];
    rows.push(
      <tr key={"second-row" + ind}>
        {daysArr.slice(0,15)}
        <td rowSpan="2" colSpan="3" className="tg-yw4l"> Итого дней (часов) явок (неявок) с 1 по 15 </td>
        {daysArr.slice(15)}
        <td rowSpan="2" colSpan="3" className="tg-yw4l"> Всего дней (часов) явок (неявок) </td>
      </tr>
    )
  for(var ind = 0; ind < users.length; ind++) {
    let user = users[ind];
    while(user.days.length < 31) {
      user.days.push({
        dayType: "",
        finance: [],
        hours: 0
      })
    }
    let tick = true;    
    let daysArr = [];
    let dayTypesInfo = [];
    let financeRows = [];
    let setHalf = false;
    for(let i = 0; i < user.days.length; i++) {
      if(i+1 === 16 && !setHalf) {
        setHalf = true;
        dayTypesInfo.push(<td className="tg-yw4l" colSpan="3" key="empty2"></td>);
        i--;
        continue;
      }
      dayTypesInfo.push(<td className="tg-yw4l" key={i+88}>{user.days[i].dayType}</td>);
    };
    let i = 0;
    let totalFinanceCells = [];
    let firstRows = [];
    let secondRows = [];
    for(; i < user.longestFinance; i++) {
        let firstRow = [];
        let secondRow = [];
        setHalf = false;
        for(let j = 0; j < user.days.length; j++) {
          if(j+1 == 16 && !setHalf) {
            firstRow.push(<td className="tg-yw4l" rowSpan="2" colSpan="3" key={j+ i +623}></td>);
            secondRow.push(<td className="tg-yw4l" rowSpan="2"  colSpan="3" key={j+ i + 28}></td>);
            setHalf = true;
            j--;
            continue;
          }
          if(user.days[i].finance && user.days[j].finance[i]) {
            firstRow.push(<td className="tg-yw4l" rowSpan="2" key={j + i+15228}>{user.days[j].finance[i].hours}</td>)
            secondRow.push(<td className="tg-yw4l" rowSpan="2" key={j+ i +323458}>{user.days[j].finance[i].name}</td>)
          } else {
            firstRow.push(<td className="tg-yw4l" rowSpan="2" key={j+ i +158123}></td>)
            secondRow.push(<td className="tg-yw4l" rowSpan="2" key={j+ i + 35128}></td>)
          }
        }
        firstRows.push(firstRow
        )
        secondRows.push(secondRow
        )
    }
    let globalCounter = 0;
    for(let i = 0; i < user.totalFinance.length; i++) {
      if(!firstRows[globalCounter]) {
        let firstRow = [];
        let secondRow = [];
        for(let j = 0; j < user.days.length; j++) {
          firstRow.push(<td className="tg-yw4l" rowSpan="2" key={j+ i +158123}></td>)
          secondRow.push(<td className="tg-yw4l" rowSpan="2" key={j+ i + 35128}></td>)
        }
        firstRows.push(firstRow
        )
        secondRows.push(secondRow
        )
      }
      if(tick) {
        tick = false;
        if(user.totalFinance[i]) {
          firstRows[globalCounter].push(<td className="tg-yw4l" rowSpan="2" colSpan="3" key={ i-128}>{user.totalFinance[i].value} - {`${user.totalFinance[i].days}/${user.totalFinance[i].hours}`}</td>);
          firstRows[globalCounter][15]=(<td className="tg-yw4l" rowSpan="2" colSpan="3" key={ i-12338}>{user.halfFinance[i].value} - {`${user.halfFinance[i].days}/${user.halfFinance[i].hours}`}</td>)
        } else {
          break;
        }
      } else {
        tick = true;
        if(user.totalFinance[i]) {
          secondRows[globalCounter].push(<td className="tg-yw4l" rowSpan="2" colSpan="3" key={ i-15228}>{user.totalFinance[i].value} - {`${user.totalFinance[i].days}/${user.totalFinance[i].hours}`}</td>);
          secondRows[globalCounter][15]=(<td className="tg-yw4l" rowSpan="2" colSpan="3" key={ i-15222348}>{user.halfFinance[i].value} - {`${user.halfFinance[i].days}/${user.halfFinance[i].hours}`}</td>);
        } else {
          break;
        }
        globalCounter++;
      }
    }
    let counter = globalCounter;
    let rowLen = (firstRows.length);
    tick = false;
    let diff = rowLen - counter;
    if(diff > 0) {
      let i = secondRows.length - 1;
      while(diff) {
        if(tick && user.totalFinance.length %2 && !(diff-1)) {
          diff--;
          continue;
        }
        if(tick) {
          tick = false;
          firstRows[i].push(<td className="tg-yw4l" colSpan="3" rowSpan="2" key={i +6575}></td>);
          diff--;
          i--;
        } else {
          tick = true
          secondRows[i].push(<td className="tg-yw4l" colSpan="3" rowSpan="2" key={i +13}></td>);
        }
      }
    }
    let totalRowCounter = firstRows.length*2 + secondRows.length*2 + 2;
    const userInfo = [
      <td className="tg-yw4l" rowSpan={totalRowCounter} colSpan="3" key="fio"> {user.name} </td>,
      <td className="tg-yw4l" rowSpan={totalRowCounter} colSpan="3" key="number"> {user.number} </td>,
      <td className="tg-yw4l" rowSpan={totalRowCounter} colSpan="3" key="position"> {user.position} </td>
    ]
    setHalf = false;
    for(let i = 0; i < user.days.length; i++) {
      if(i+1 === 16 && !setHalf) {
          userInfo.push(<td className="tg-yw4l" colSpan="3" key="itogo2">{`Ф - ${user.halfDays}/${user.halfHours}`}</td>);
          i--;
          setHalf = true;
          continue;
      }
      userInfo.push(
        <td className="tg-yw4l"  key={i+43}>{user.days[i].hours}</td>
       )
    }
    for(let i = 0; i < firstRows.length; i++) {
      financeRows.push(<tr key ={i+13*76 * (ind+1)}>{firstRows[i]}</tr>);
      financeRows.push(<tr key={i-(115)*(ind+1)}></tr>)
      financeRows.push(<tr key ={i + (i+1)*(ind+1)*13}>{secondRows[i]}</tr>);
      financeRows.push(<tr key={i+1232*(ind+1)}></tr>);
    }
    if(ind==0) {
      rows.push(  <tr key={"mmm" + ind}></tr>)
      rows.push(<tr key={"numbers-row"+ind} >{rownumbers}</tr>);
    }
    dayTypesInfo.push(<td className="tg-yw4l empt" colSpan="3" key="empty"></td>)
    userInfo.push(<td className="tg-yw4l" colSpan="3" key="itogo">{`Ф - ${user.totalDays}/${user.totalHours}`}</td>);
    rows.push(<tr key={"row-four" + ind}>{userInfo}</tr>);
    rows.push(<tr key={"row-five" + ind}>{dayTypesInfo}</tr>);
    rows = rows.concat(financeRows)
  }

  let otherRows = [<tr className="noDisplay" key="blank1"/>];

  let firstOtherRow = [
    <tr key="other1" className="noDisplay">
      <td key="executor1" rowSpan="2" colSpan="4">
        Ответственный
      </td>
      <td/>
      <td key="executor2" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor3" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor4" rowSpan="2" colSpan="4">

      </td>
      {generateTds(8)}
      <td key="markBuh" rowSpan="4" colSpan="18">
        Отметка бухгалтерии о принятии настоящего табеля
      </td>
      {generateTds(totalTableWidth - 3 * 4 - 12 - 18 )}
    </tr>,
    <tr  key="blank73"/>,
    <tr key="other11" className="noDisplay">
      <td key="executor1"  colSpan="4">
      исполнитель
      </td>
      <td/>
      <td key="executor2" colSpan="4">
        (должность)
      </td>
      <td/>
      <td key="executor3" colSpan="4">
        (подпись)
      </td>
      <td/>
      <td key="executor4"  colSpan="4">
        (расшифровка подписи)
      </td>
      {generateTds(totalTableWidth - 3 * 4)}
    </tr>,
    <tr  key="blank3" />,
    <tr  key="blank81"/>
  ]

  let thirdOtherRow = [
    <tr key="other3" className="noDisplay">
      <td key="executor1" rowSpan="2" colSpan="4">
        Исполнитель
      </td>
      <td/>
      <td key="executor2" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor3" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor4" rowSpan="2" colSpan="4">

      </td>
      {generateTds(7)}
      <td key="executor11" rowSpan="2" colSpan="4">
        Исполнитель
      </td>
      <td/>
      <td key="executor21" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor31" rowSpan="2" colSpan="4">

      </td>
      <td/>
      <td key="executor41" rowSpan="2" colSpan="4">

      </td>
      {generateTds(3)}
    </tr>,
    <tr  key="blank71"/>,
    <tr key="other4" className="noDisplay">
        <td key="executor1" colSpan="4">

        </td>
        <td/>
        <td key="executor2" colSpan="4">
          (должность)
        </td>
        <td/>
        <td key="executor3" colSpan="4">
          (подпись)
        </td>
        <td/>
        <td key="executor4"  colSpan="4">
          (расшифровка подписи)
        </td>
        {generateTds(7)}
      <td key="executor11" colSpan="4">

      </td>
      <td/>
      <td key="executor21" colSpan="4">
        (должность)
      </td>
      <td/>
      <td key="executor31" colSpan="4">
        (подпись)
      </td>
      <td/>
      <td key="executor41"  colSpan="4">
        (расшифровка подписи)
      </td>
      {generateTds(3)}
    </tr>
  ]

  let datesOtherRow = [
    <tr key="blank135"/>,<tr key="blank142"/>,
    <tr key="date1" className="noDisplay">
      <td colSpan="2" key="day11">
        "{moment().format("DD")}"
      </td>
      <td colSpan="6" key="day12">
        {moment().format("MMMM")}
      </td>
      <td colSpan="2" key="day13">
        {moment().format("YYYY")}г.
      </td>
        {generateTds(18)}
        <td colSpan="2" key="day21">
        "           "
        </td>
        <td colSpan="6" key="day22">

        </td>
        <td colSpan="2" key="day23">

        </td>
        {generateTds(8)}
    </tr>,
    <tr key="blank13"/>
  ]
  otherRows = otherRows.concat(firstOtherRow).concat(thirdOtherRow);
  rows = rows.concat(otherRows).concat(datesOtherRow);
  return rows;
}

helpers.getDateRange = getDateRange;
helpers.getDateMonthRange = getDateMonthRange;

export default helpers;