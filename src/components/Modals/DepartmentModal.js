/**
 * Created by vasil_000 on 10.04.2017.
 */
import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Container from "../Container";
import next from "../../Icons/next.svg";
import RightDepartmentPanelContainer from "../../containers/Admin/RightDepartmentPanelContainer";
import listGenerator from "../utils/listGenerator";
import Icon from "../../Icons/Icon";
import { List, AutoSizer } from 'react-virtualized';
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
let tasksDict1 = {};
let tasksIdDict1 = {};
// var z = this.props.users;



function findAllTaskInTreeByIndexes(globalIndexes) {
    // console.log(globalIndexes);
    if(globalIndexes[0] === -1) {
        return [];
    } else {
        let elems = globalIndexes.map(x => tasksDict[x]);
        return elems.filter(x=> x!== undefined);
    }
}

// function findAllTaskInTreeByIds(ids) {
//     // console.log(ids);
//     if(ids[0] === -1) {
//         return [];
//     } else {
//         let elems = ids.reduce((sum,current) => sum.concat(tasksIdDict[current]), []);
//         return elems.filter(x=> x!== undefined);
//     }
// }

function deactivateTasks() {
    for(var e in tasksDict) {
        if(1) {
            // tasksDict[e].active = false;
            tasksDict[e].opened = false;
        }
    }
}





export default class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = {
            chosenUsers: [],
            chosenDepIds: []
        }
    }
    componentDidUpdate() {
        const ref = this.refs.taskTree;
        if(ref) {
            this.props.setClientHeight(ref.clientHeight);
        }
    }

    getAllIds(tree) {
        let ids = [];
        tree.forEach(x => {
            const id = x.id;
            const name = x.name;
            const children = x.children;
            if(children && children.length > 0) {
                ids = ids.concat(this.getAllIds(children));
            }
            ids.push({name, id, children});
        });
        return ids;
    }

    clearAllIds(tree) {
        let ids = [];
        tree.forEach(x => {
            const name = x.name;
            const children = x.children;
            if(children && children.length > 0) {
                ids = ids.concat(this.clearAllIds(children));
            }
            ids = ids.filter(y => y.name !== name);
        });
        return ids;
    }

    checkboxValueChange(name, id, children, e) {

        var newArr = [];



        if (this.state.chosenUsers.map(y => y.name).indexOf(name) === -1) {
            newArr = newArr.concat([{name, id, children}]);
            newArr = newArr.concat(this.getAllIds(newArr));

            this.setState({chosenUsers: this.state.chosenUsers.concat(newArr)});


        } else {
            newArr = this.state.chosenUsers.filter(x => x.name !== name);
            this.setState({chosenUsers: this.clearAllIds(newArr)});
        }
    }



    closeModal() {
        // this.props.setExecutors(this.state.chosenUsers.map(x => ({value: x.globalIndex, label: x.name})));
        this.props.closeModal();
    }

    modifyTree(mainTree, secondTree){
        function getAllIds(tree) {
            // let ids = [];
            tree.forEach(x => {
                // console.log(x);
            });
            // return ids;
        }

    }



    render() {
        let departments = this.props.departments;
        let users = this.props.users;
        const props = this.props;
        if(departments.length === 0) {
            return <div/>;
        }
        // departments.treeNormalized.byGlobalId.concat(users.treeNormalized.byGlobalId);
        tasksIdDict= departments.treeNormalized.byId;
        tasksDict = departments.treeNormalized.byGlobalId;
        tasksDict1= users.treeNormalized.byId;
        tasksIdDict1 = users.treeNormalized.byGlobalId;


        deactivateTasks();
        // if(this.props.activeIndexes.taskId !== -1) {
        //     let items_ = findAllTaskInTreeByIds([this.props.activeIndexes.taskId]);
        //     items_.forEach(x=> x.active = true);
        // }
        if(this.props.openedTasks.length > 0) {
            let items_ = findAllTaskInTreeByIndexes(this.props.openedTasks);
            items_.forEach(x=> x.opened = true);
        }
        let config = {};





        config.listItemRender = (item) => {
            return (
                <div>
                <div
                    style={{display: "flex", flexDirection: "row"}} key={item.id}>



                     <div className={"single-task " +
                ` level_${item.level} `} key={item.id} >
                    <div>
                        <input onChange={this.checkboxValueChange.bind(this, item.name, item.id, item.children)}
                               checked={this.state.chosenUsers.map(y => y.name).indexOf(item.name) !== -1}
                               type="checkbox"
                               name="a"
                               style={{margin:10}}
                               id={item.id}
                        />
                        <span className="taskLabel">{item.name}</span>
                    </div>



                    <div>
                        <img role="presentation"  className={"clickable-image next " + (item.opened? 'opened' : 'closed') +
                        (item.children.length ? " visible" : " non-visible")} onClick={props.toggleTaskOpen.bind(this,item)}  src={next}/>
                    </div>

                </div>
                </div>
                    <ul>
                        <li>1</li>>
                        <li>2</li>>
                        <li>3</li>>
                        <li>4</li>>
                    </ul>
                </div>



            )
        }




        let taskContainers = listGenerator(users, this.props, config);


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