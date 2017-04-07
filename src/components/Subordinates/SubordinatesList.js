import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Container from "../Container";
import listGenerator from "../utils/listGenerator";
import Icon from "../../Icons/Icon";
import { List } from 'react-virtualized';
import {rowHeight} from "../../helperFunctions";
import next from "../../Icons/next.svg";
import briefcase from "../../Icons/briefcase.svg";
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router';

const buttonContainerStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  minHeight: "40px"
}

const fullSize = {
  width:"100%",
  height: "100%"
}



let tasksDict = {};
let tasksIdDict = {};



function findAllTaskInTreeByIndexes(globalIndexes) {
  if(globalIndexes[0] === -1) {
    return [];
  } else {
    let elems = globalIndexes.map(x => tasksDict[x]);
    return elems.filter(x=> x!== undefined);
  }
}

function findAllTaskInTreeByIds(ids) {
    if(ids[0] === -1) {
      return [];
    } else {
      let elems = ids.reduce((sum,current) => sum.concat(tasksIdDict[current]), []);
      return elems.filter(x=> x!== undefined);
    }
}

function deactivateTasks() {
    for(var e in tasksDict) {
        if(1) {
          tasksDict[e].active = false;
          tasksDict[e].opened = false;
        }
    }
}



export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }
  componentDidUpdate() {
    const ref = this.refs.taskTree;
    if(ref) {
      this.props.setClientHeight(ref.clientHeight);
    }
    ReactTooltip.rebuild();
  }
  render() {
    let peopleTree = this.props.peopleTree;
    const props = this.props;
    if(peopleTree.length === 0) {
      return <div/>;
    }
    tasksIdDict= peopleTree.treeNormalized.byId;
    tasksDict = peopleTree.treeNormalized.byGlobalId;
    deactivateTasks();
    if(this.props.activeIndexes.taskId !== -1) {
      let items_ = findAllTaskInTreeByIds([this.props.activeIndexes.taskId]);
      items_.forEach(x=> x.active = true);
    }
    if(this.props.openedTasks.length > 0) {
      let items_ = findAllTaskInTreeByIndexes(this.props.openedTasks);
      items_.forEach(x=> x.opened = true);
    }

    let config = {};
    config.listItemRender = (item) => {
      return (
        <div className={"single-task " +
          ` level_${item.level} ` + (item.active ? " active" : "") + " "} key={item.globalIndex}>
           <span className="taskLabel">{item.name}</span>
            <span className="taskLabel">{item.position}</span>
             <span className="taskLabel">{item.department}</span>
            <Link to={props.user.id === item.id ? ("/tasks/my/table?all_subs=1&statuses=0,1,2,3,4&sub_ids=" + item.id) : ("/tasks/subordinate/table?all_subs=1&statuses=0,1,2,3,4&sub_ids=" + item.id)} data-tip="Открыть задачи пользователя"><Icon name="briefcase" className="clickable-image next " src={briefcase} /></Link>
            <img role="presentation"  className={"clickable-image next " + (item.opened? 'opened' : 'closed') +
              (item.children.length ? " visible" : " non-visible")} onClick={props.toggleTaskOpen.bind(this,item)}  src={next}/>
        </div>
      )
    }
    let taskContainers = listGenerator(peopleTree, this.props, config);

    function rowRenderer ({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible,   // This row is visible within the List (eg it is not an overscanned row)
        style        // Style object to be applied to row (to position it)
      }) {
        return (
          <div
            key={key}
            style={style}
          >
            {taskContainers[index]}
          </div>
        )
      }

    let tasksView = (
      <List
     width={500}
    height={this.props.clientHeight - 40}
    rowHeight={rowHeight}
    rowCount={taskContainers.length}
    rowRenderer={rowRenderer}
    />
    )
    return (
      <Container>
        <div className="tasksContainer" style={fullSize} ref="taskTree">
          <div style={buttonContainerStyles}>
            <div>

            </div>
          </div>
          {tasksView}
        </div>
      </Container>
    );
  }
}