import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Container from "../Container";
import listGenerator from "../utils/listGenerator";
import Icon from "../../Icons/Icon";
import { List } from 'react-virtualized';
import RightUserPanelContainer from "../../containers/Admin/RightUserPanelContainer";
import {PagesPicker} from "../formComponents/ReusableComponents";
import {rowHeight} from "../../helperFunctions";

const buttonContainerStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginLeft: "5px"
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


const roleDict = {
  0: "Пользователь",
  1: "Администратор",
  2: "Заблокирован",
  "-1": "Роль",
  "-2": 'Руководитель',
  "-21": "Руководитель/Администратор",
   "-22": "Заблокирован/Руководитель"
}

const headers = {
  id: -1,
  number: "Табельный номер",
  name: "ФИО",
  login: "Логин в Active Directory",
  department_name: "Отделение ШС",
  position: "Должность",
  role: -1,
  isHeader: true
};


export default class UsersList extends React.Component {
    constructor(props) {
        super(props);

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    // componentWillMount() {
    //     this.props.getUsers();
    // }

    componentDidUpdate() {
        const ref = this.refs.taskTree;
        if (ref) {
            this.props.setClientHeight(ref.clientHeight);
        }
    }


    render() {
        let users = this.props.users;
        const props = this.props;
        // console.log(props)
        if (users.length === 0) {
            return <div/>;
        } else {



            // const widthOfEl = 100/6 + "%";
            tasksIdDict = users.treeNormalized.byId;
            tasksDict = users.treeNormalized.byGlobalId;
            deactivateTasks();
            if (this.props.activeIndexes.taskId !== -1) {
                let items_ = findAllTaskInTreeByIds([this.props.activeIndexes.taskId]);
                items_.forEach(x => x.active = true);
            }
            tasksIdDict = users.treeNormalized.byId;
            tasksDict = users.treeNormalized.byGlobalId;
            const rightPanelContainerStyle = this.props.rightPanelStatus ? {} : {maxWidth: "0"};
            const rightPanelClass = this.props.rightPanelStatus ? "" : "right-closed";
            let config = {};
            config.listItemRender = (item) => {
                return (
                    <div className={"single-task " +
                    ` ${item.isHeader ? " header-list-row " : ""} ` + (item.active ? " active" : "") + " "}
                         key={item.globalIndex} onClick={props.loadUser.bind(this, item)}>
                        <span className="taskLabel1">{item.number}</span>
                        <span className="taskLabel2">{item.name}</span>
                        <span className="taskLabel3" style={{textAlign: "center"}}><b>{item.login}</b></span>
                        <span className="taskLabel4">{item.department_name}</span>
                        <span className="taskLabel5">{item.position}</span>
                        <span className="taskLabel6">{roleDict[item.role]}</span>
                    </div>
                )
            }
            // const treeWithHeaders = [headers].concat(users.tree);
            const treeWithHeaders = users.tree;
            const treeNormalized = users.treeNormalized;
            let newUsers = {
                tree: treeWithHeaders,
                treeNormalized: treeNormalized
            };
            let taskContainers = listGenerator(newUsers, this.props, config);

            function rowRenderer({
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
                    height={this.props.clientHeight - 65}
                    rowHeight={rowHeight}
                    rowCount={taskContainers.length}
                    rowRenderer={rowRenderer}
                    style={{overflowY: "scroll", marginLeft: "5px", height: "80%"}}
                />
            )
            return (
                <Container>
                    <div className="tasksContainer" style={fullSize} ref="taskTree">
                        <div style={buttonContainerStyles}>
                            <div>
                                <RaisedButton className="addButton" label="Добавить"
                                              onClick={this.props.handleAddNewUser}/>
                            </div>

                        </div>


                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            overflowY: "scroll",
                            marginTop: "20px",
                            marginBottom: "10px",
                            marginLeft: "5px",
                            width: "100%"
                        }}>
                            <div className="taskLabel1"><u><b>Табельный номер</b></u></div>
                            <div className="taskLabel2"><u><b>ФИО</b></u></div>
                            <div className="taskLabel3"><u><b>Логин в Active Directory</b></u></div>
                            <div className="taskLabel4"><u><b>Отделение ШС</b></u></div>
                            <div className="taskLabel5"><u><b>Должность</b></u></div>
                            <div className="taskLabel6"><u><b>Роль</b></u></div>
                        </div>

                        {tasksView}
                        <PagesPicker prevPage={props.prevPage.bind(this, props.pageNumber)}
                                     nextPage={props.nextPage.bind(this, props.pageNumber)}
                                     pageNumber={props.pageNumber}/>
                    </div>
                    <div className={`splitter ${(this.props.rightPanelStatus ? "" : "noDisplay")}`}/>
                    <RightUserPanelContainer flex="0.7" containerStyle={rightPanelContainerStyle}
                                             className={rightPanelClass}/>
                </Container>
            );
        }
    }
}