/**
 * Created by vasil_000 on 10.04.2017.
 */
//
// import React from "react"
// import Modal from 'react-modal';
// import Container from "../Container";
// import FlatButton from 'material-ui/FlatButton';
// import "../styles/Modal.css";
//
//
//
// const departmentList = class department extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             chosenUsers: []
//         }
//     }
//
//     closeModal() {
//         // this.props.setExecutors(this.state.chosenUsers.map(x => ({value: x.id, label: x.name})));
//         this.props.closeModal();
//     }
//
//     parseTree(tree) {
//         if (tree) {
//             const z = tree.map(x => x.children);
//             // console.log(z.name);
//             console.log(z);
//         }
//     }
//
//     render() {
//         const props = this.props;
//         const departments = props.departments;
//         const depTree = departments.tree;
//         // console.log(depTree);
//         this.parseTree(depTree);
//
//         const list = (props.departments && props.departments.tree) ? props.departments.tree.map(x => <div
//             style={{display: "flex", flexDirection: "row"}} key={x.id}>
//             <div>{x.name}</div>
//         </div>) : <div/>;
//         // console.log(departments);
//         // if(departments.length === 0) {
//         //     return <div/>;
//         // }
//
//
//
//
//         return (
//             <Modal
//             isOpen={props.isModalOpen}
//             contentLabel="Modal"
//             style={{overlay: {zIndex: 10}}}
//             className="large-modal"
//             >
//             <Container vertical="true">
//             <h2 flex="2"> Внимание! </h2>
//
//             <p>Список пользователей</p>
//             <div>{list}</div>
//
//             <div flex="1">
//             <FlatButton style={{float: "right"}} onClick={this.closeModal.bind(this)} label="ОК"/>
//             </div>
//             </Container>
//             </Modal>
//
//     )
// }
//
//
//
//
// }
//
// export default departmentList;


import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Container from "../Container";
import next from "../../Icons/next.svg";
import RightDepartmentPanelContainer from "../../containers/Admin/RightDepartmentPanelContainer";
import listGenerator from "../utils/listGenerator";
import Icon from "../../Icons/Icon";
import { List } from 'react-virtualized';
import {rowHeight} from "../../helperFunctions";
import Modal from 'react-modal';
import FlatButton from 'material-ui/FlatButton';
const buttonContainerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
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
    console.log(ids);
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
        //noinspection JSAnnotator
        this.state = {
            chosenUsers: [],
            chk : {
                id : '',
                chk : false}
        }
    }
    componentDidUpdate() {
        const ref = this.refs.taskTree;
        if(ref) {
            this.props.setClientHeight(ref.clientHeight);
        }
    }

    checkboxValueChange(name, globalIndex, id, children, e) {
        if(this.state.chosenUsers.map(y => y.name).indexOf(name) === -1) {
            // console.log(children);
            var newArr = [];
            // this.state.chk = false;
            const State = this.state;
            newArr = newArr.concat([{name,globalIndex, id, children}]);

            // console.log(children);
            if (children.length != 0){
                children.forEach(function(f){
                    // this.setState({chosenUsers:this.state.chosenUsers.concat([{f: name, globalIndex, id, children}])});
                    const chId = f.id;
                    const chName = f.name;
                    const chGlobalIndex = f.globalIndex;
                    const chChildren = f.children;
                    const doc = document.getElementById(f.id);
                    // doc.checked = "checked";
                    // State.chk = true;
                    // console.log(State.chosenUsers.map(y => y.name));
                    // this.checkboxValueChange(chName, chGlobalIndex, chId, chChildren);
                    newArr = newArr.concat([{chName, chGlobalIndex, chId, chChildren}])
                    // this.setState({chosenUsers:this.state.chosenUsers.concat([{chName, chGlobalIndex, chId, chChildren}])});
                    // console.log(chChildren, chId, chName, chGlobalIndex);
                });
            }

            this.setState({chosenUsers:this.state.chosenUsers.concat(newArr)});
            console.log(this.state.chosenUsers);
            // console.log(newArr);
            // return true;


        } else {
            const newArr = this.state.chosenUsers.filter(x => x.name !== name);
            this.state.chk = false;
            // console.log(123123);
            // console.log(this.state.chosenUsers.map(x => x.children));
            this.setState({chosenUsers: newArr});
            // console.log(this.state.chosenUsers);
        }
    }

    closeModal() {
        // this.props.setExecutors(this.state.chosenUsers.map(x => ({value: x.globalIndex, label: x.name})));
        this.props.closeModal();
    }


    render() {
        let departments = this.props.departments;
        const props = this.props;
        if(departments.length === 0) {
            return <div/>;
        }
        tasksIdDict= departments.treeNormalized.byId;
        tasksDict = departments.treeNormalized.byGlobalId;

        deactivateTasks();
        if(this.props.activeIndexes.taskId !== -1) {
            let items_ = findAllTaskInTreeByIds([this.props.activeIndexes.taskId]);
            items_.forEach(x=> x.active = true);
        }
        if(this.props.openedTasks.length > 0) {
            let items_ = findAllTaskInTreeByIndexes(this.props.openedTasks);
            items_.forEach(x=> x.opened = true);
        }
        // console.log(departments);
        let config = {};



        config.listItemRender = (item) => {
            return (
                <div
                    style={{display: "flex", flexDirection: "row"}} key={item.globalIndex}>
                    <input onChange={this.checkboxValueChange.bind(this, item.name, item.globalIndex, item.id, item.children)}
                           checked={this.state.chosenUsers.map(y => y.name).indexOf(item.name) !== -1}
                           // checked={this.props.chk}
                           type="checkbox"
                           name="a"
                           style={{margin:10}}
                           id={item.id}
                    />


                <div className={"single-task " +
                ` level_${item.level} ` + (item.active ? " active" : "") + " "} key={item.globalIndex}>
                    <span className="taskLabel" onClick={props.loadDepartment.bind(this,item)}>{item.name}</span>


                    <div>
                        <img role="presentation"  className={"clickable-image next " + (item.opened? 'opened' : 'closed') +
                        (item.children.length ? " visible" : " non-visible")} onClick={props.toggleTaskOpen.bind(this,item)}  src={next}/>
                    </div>

                </div>
                </div>



            )
        }
        let taskContainers = listGenerator(departments, this.props, config);

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
                height={this.props.clientHeight}
                rowHeight={rowHeight}
                rowCount={taskContainers.length}
                rowRenderer={rowRenderer}
            />
        )
        // List.recomputeRowHeights()
        // List.forceUpdate()
        return (
            <Modal
                isOpen={props.isModalOpen}
                contentLabel="Modal"
                style={{overlay: {zIndex: 10}}}
                className="large-modal"
            >
            <Container>
                <div className="tasksContainer" style={fullSize} ref="taskTree">
                    {tasksView}
                </div>
            </Container>
                <div>
                    <FlatButton style={{float: "right"}} onClick={this.closeModal.bind(this)} label="ОК"/>
                </div>
            </Modal>
        );
    }
}