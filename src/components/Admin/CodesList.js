import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Container from "../Container";
import listGenerator from "../utils/listGenerator";
import Icon from "../../Icons/Icon";
import {List} from 'react-virtualized';
import {PagesPicker} from "../formComponents/ReusableComponents";
import {rowHeight} from "../../helperFunctions";
import ConfirmModalContainer from "../../containers/ModalContainers/ConfirmModalContainer";
import ReactTooltip from 'react-tooltip';

const buttonContainerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
}

const fullSize = {
    width: "100%",
    height: "100%"
}

let tasksDict = {};
let tasksIdDict = {};

function findAllTaskInTreeByIndexes(globalIndexes) {
    if (globalIndexes[0] === -1) {
        return [];
    } else {
        let elems = globalIndexes.map(x => tasksDict[x]);
        return elems.filter(x => x !== undefined);
    }
}

function findAllTaskInTreeByIds(ids) {
    if (ids[0] === -1) {
        return [];
    } else {
        let elems = ids.reduce((sum, current) => sum.concat(tasksIdDict[current]), []);
        return elems.filter(x => x !== undefined);
    }
}

function deactivateTasks() {
    for (var e in tasksDict) {
        if (1) {
            tasksDict[e].active = false;
            tasksDict[e].opened = false;
        }
    }
}

const headers = {
    id: -1,
    label: "Название",
    description: "Описание",
    week_limit: "Нормативы",
    isHeader: true
};

export default class CodesList extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = {
            activeEditing: false,
            description: "",
            label: "",
            week_limit: "",
            id: "",
            currentQuestion: () => {
            },
            isModalOpen: false,
            message: ""
        }
    }

    activateCodeEditing(item) {
        this.setState({
            activeEditing: item.id,
            description: item.description || "",
            label: item.label || "",
            week_limit: item.week_limit || 0,
            id: item.id
        })
    }

    componentDidUpdate() {
        const ref = this.refs.taskTree;
        if (ref) {
            this.props.setClientHeight(ref.clientHeight);
        }
        ReactTooltip.rebuild();
    }

    changeState(event) {
        const newVal = event.target.value;
        const name = event.target.name;
        let newState = {};
        newState[name] = newVal;
        this.setState(newState);
    }

    commitChanges() {
        if (this.state.activeEditing === "new") {
            this.props.createCode(this.state);
        } else {
            this.props.editCode(this.state);
        }
        this.setState({
            activeEditing: false,
            description: "",
            label: "",
            week_limit: "",
            id: ""
        })
    }

    addNewCode() {
        this.setState({
            activeEditing: "new",
            description: "",
            label: "",
            week_limit: "",
            id: ""
        })
    }

    acceptAnswer(answer) {
        this.closeConfirm.bind(this)();
        if (answer) {
            this.props.deleteCode(this.props.activeIndexes.taskId)
        }
    }

    closeConfirm() {
        this.setState({isModalOpen: false});
    }

    startQuestion(department) {
        this.setState({
            selectedDepartment: department,
            currentQuestion: this.acceptAnswer,
            message: "Уверены, что хотите удалить код работ?",
            isModalOpen: true
        });
    }

    render() {
        let codes = this.props.codes;
        const props = this.props;
        if (codes.length === 0) {
            return <div/>;
        }

        if (codes.tree.length === 0) {
            let emptyCode = {
                description: "",
                label: "",
                week_limit: "",
                id: "new"
            }
            codes.tree.push({
                ...emptyCode
            });
        }
        if (this.state.activeEditing === "new" && codes.tree[codes.tree.length - 1].id !== "new") {
            let emptyCode = {
                description: "",
                label: "",
                week_limit: "",
                id: "new"
            }
            codes.tree.push({
                ...emptyCode
            });
        }
        tasksIdDict = codes.treeNormalized.byId;
        tasksDict = codes.treeNormalized.byGlobalId;
        deactivateTasks();
        if (this.props.activeIndexes.taskId !== -1) {
            let items_ = findAllTaskInTreeByIds([this.props.activeIndexes.taskId]);
            items_.forEach(x => x.active = true);
        }
        tasksIdDict = codes.treeNormalized.byId;
        tasksDict = codes.treeNormalized.byGlobalId;
        const rightPanelContainerStyle = this.props.rightPanelStatus ? {} : {maxWidth: "0"};
        const rightPanelClass = this.props.rightPanelStatus ? "" : "right-closed";
        let config = {};
        const self = this;
        config.listItemRender = (item) => {
            const beingEdited = self.state.activeEditing == item.id;
            return (
                <div onClick={beingEdited ? () => {
                } : props.activateCode.bind(this, item)} className={"single-task " +
                ` ${item.isHeader ? " header-list-row " : ""} ` + (item.active ? " active" : "") + " "}
                     key={item.globalIndex}>
                    { beingEdited ?
                        <input name="label" value={self.state.label} onChange={self.changeState.bind(self)}/> :
                        <span className="taskLabel">{item.label}</span>}
                    {beingEdited ? <input name="description" value={self.state.description}
                                          onChange={self.changeState.bind(self)}/> :
                        <span className="taskLabel">{item.description}</span>}
                    {beingEdited ? <input name="week_limit" value={self.state.week_limit}
                                          onChange={self.changeState.bind(self)}/> :
                        <span className="taskLabel">{item.week_limit}</span>}
                    {beingEdited ?
                        <div data-tip="Сохранить"><Icon name="acceptTrud"
                                                        className={`clickable-image clock ${item.isHeader ? "non-visible" : ""}`}
                                                        onClick={self.commitChanges.bind(self, item)}/></div>
                        : <div className="pencil-edit" data-tip="Редактировать"><Icon name="edit"
                                                                                      className={`clickable-image clock ${item.isHeader ? "non-visible" : ""}`}
                                                                                      onClick={self.activateCodeEditing.bind(self, item)}/>
                        </div>}
                </div>
            )
        }
        const treeWithHeaders = [headers].concat(codes.tree);
        const treeNormalized = codes.treeNormalized;
        let newCodes = {
            tree: treeWithHeaders,
            treeNormalized: treeNormalized
        };
        let taskContainers = listGenerator(newCodes, this.props, config);

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
            />
        )
        return (
            <Container>
                <div className="tasksContainer" style={fullSize} ref="taskTree">
                    <div style={buttonContainerStyles}>
                        <div>
                            <RaisedButton className="addButton" label="Добавить" onClick={this.addNewCode.bind(this)}/>
                        </div>
                        <div className={!~this.props.activeIndexes.taskId ? "noDisplay" : ""}>
                            <RaisedButton className="addButton" label="Удалить"
                                          onClick={this.startQuestion.bind(this)}/>
                        </div>
                    </div>
                    {tasksView}
                    <PagesPicker prevPage={props.prevPage.bind(this, props.pageNumber)}
                                 nextPage={props.nextPage.bind(this, props.pageNumber)} pageNumber={props.pageNumber}/>
                </div>
                <ConfirmModalContainer containerStyle={{maxHeight: '0', maxWidth: '0'}}
                                       isModalOpen={this.state.isModalOpen}
                                       message={this.state.message}
                                       answer={this.state.currentQuestion.bind(this)}/>
            </Container>
        );
    }
}