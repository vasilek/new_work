import React from "react";
import Container from "../Container";
import "../styles/TaskInfo.css";
import calendar from "../../Icons/calendar.svg";
import human from "../../Icons/human.svg";
import people from "../../Icons/people.svg";
import {Field, reduxForm,change} from 'redux-form'
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import DPicker from "../formComponents/DatePicker";
import {
    WorkCodeField,
    FinancesField,
    ExecutorsSelectField,
    Panel,
    ExecutorsAsyncSelectField
} from "../formComponents/ReusableComponents";

import PersonModalContainer from "../../containers/ModalContainers/PersonModalContainer";
import DepartmentModalContainer from "../../containers/ModalContainers/DepartmentModalContainer";
// import Popup from 'react-popup';


const codeBlockStyle = {
    minHeight: "76px"
}

const headerBlockStyle = {
    minHeight: "56px"
}

const descriptionBlockStyle = {
    minHeight: "270px"
}

const newTaskInfoComponent = class newTaskInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            executors: []
        }
    }
    clickHandler() {
        this.props.getUsers();
        this.props.loadDepTree();
        // this.props.loadFlatDepartments();

        // console.log(this.props.departments);

        this.setState({isModalOpen: true});
    }
    setExecutors(list) {
        this.setState({executors: list});
    }
    closeModal() {
        this.setState({isModalOpen: false});
    }

    render() {
        const props = this.props;
        const {handleSubmit} = props;
        // console.log(props.users);
        return (
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Container vertical={true}>
                    <div className="infoHeader" flex="1">

                        <Container style={{justifyContent: "space-between"}}>
                            <div className="infoHeaderBlock fullWidth"
                                 style={{display: 'flex', justifyContent: "flex-begin"}}>
                                {/*<div>*/}
                                    {/*/!**!/*/}
                                    {/*<img className="user" onClick={this.clickHandler.bind(this)} src={human} alt="logo" style={{margin:5}}/>*/}
                                    {/*<PersonModalContainer isModalOpen={this.state.isModalOpen} closeModal={this.closeModal.bind(this)}*/}
                                                          {/*setExecutors={(list) => { this.setExecutors(list); this.props.changeFieldValue('executors', list)}}/>*/}
                                {/*/!**!/*/}
                                {/*</div>*/}
                                <div>
                                    <img className="user" onClick={this.clickHandler.bind(this)} src={people} alt="logo" style={{margin:5}}/>
                                    <DepartmentModalContainer isModalOpen={this.state.isModalOpen} closeModal={this.closeModal.bind(this)}/>
                                </div>

                                {/*<div style={{display: "none"}}>*/}
                                    {/*<ExecutorsAsyncSelectField executors={props.executors}/>*/}
                                {/*</div>*/}
                                <div>
                                    <img className="user" src={calendar} alt="logo" style={{margin:5}}/>
                                    <Field name="startDate" component={DPicker}/>
                                </div>
                                {/*<span style={{margin:5}}>*/}
                                    {/*{this.state.executors.map(x => <span key={x.value}> {x.label}</span>)}*/}
                                {/*</span>*/}
                            </div>
                        </Container>
                    </div>
                    <Container vertical={true} flex="6" height="auto"
                               containerStyle={{overflowY: "auto", overflowX: 'hidden', paddingTop: "25px"}}>
                        <h2 containerStyle={headerBlockStyle} flex="1" style={{margin: "5px", marginBottom: "20px"}}>
                            <Field name="name" className="fieldValue taskHeader" component="textarea"
                                   placeholder="Название задачи"/>
                        </h2>
                        <Container containerStyle={codeBlockStyle} flex="3">
                            <Panel label="Код работ">
                                <WorkCodeField codes={this.props.codes}/>
                            </Panel>
                            <Panel label="Статья финансирования">
                                <FinancesField finances={this.props.finances}/>
                            </Panel>
                        </Container>
                        <div className="taskPanel" flex="4" containerStyle={descriptionBlockStyle}>
                            <span className="panelLabel"> Описание </span>
                            <span className="panelText fullWidth">
            <Field className="fieldValue" style={{margin: "10px", minHeight: "200px", minWidth: "90%"}}
                   name="description" component="textarea" placeholder="Описание задачи"/>
          </span>
                        </div>
                    </Container>
                    <div style={{borderTop: "1px solid black", minHeight: "36px"}}>
                        <FlatButton type="submit" label="Создать"/>
                    </div>
                </Container>
            </form>
        )
    }
}

let taskForm = reduxForm({
    form: "newTaskInfoDialogForm"
})(newTaskInfoComponent);

taskForm = connect(
    state => {

        let additionalParams = {};
        if (state.taskView.parent_task) {
            additionalParams.code = state.taskView.parent_task.code;
            additionalParams.finance = state.taskView.parent_task.finance;
        }
        return ({
            initialValues: {
                executors: [],
                parent_id: state.taskView.parent_id,
                ...additionalParams
            }
        })
    },
    function(dispatch) {
        return {
            // This will be passed as a property to the presentational component
            changeFieldValue: function(field, value) {
                dispatch(change('newTaskInfoDialogForm', field, value))
            }
        }
    }
)(taskForm)

export default taskForm;