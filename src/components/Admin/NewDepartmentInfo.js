import React from "react";
import Container from "../Container";
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {connect} from 'react-redux';
import {debounce} from "../../helperFunctions";
import Icon from "../../Icons/Icon";
import {DescriptionField, Panel, NameField, DepartmentParentField} from "../formComponents/ReusableComponents";
import FlatButton from 'material-ui/FlatButton';


const codeBlockStyle = {
  minHeight: "76px"
}

const headerBlockStyle = {
  minHeight: "56px"
}

const descriptionBlockStyle = {
  minHeight: "200px"
}

const  DepartmentInfoComponent =  class NewDepartmentInfo extends React.Component {
  constructor(props) {
   super(props);
    this.handleDebounce = debounce(this.handleEdit, 400);
  }
  handleEdit(e) {
    setTimeout(() => {this.refs.sbmt.click()});
  }
  render () {
    const props=this.props;
    const department = props.department;
    const {handleSubmit} = props;
      return (
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", height: "100%"}}>
          <Container vertical={true}>
            <div className="infoHeader" flex="1">

            </div>
            <Container vertical={true} flex="11" height="auto" containerStyle={{overflowY: "auto", overflowX: 'hidden', paddingTop: "25px"}}>
                <h2 flex="1" containerStyle={headerBlockStyle} style={{margin:"5px", marginBottom: "20px"}}>
                  <Field name="name" placeholder="Название отдела"  component={NameField} />
                </h2>
                <div className="taskPanel" flex="4" containerStyle={descriptionBlockStyle}>
                  <span className="panelLabel"> Описание </span>
                    <span  className="panelText fullWidth">
                      <Field className="fieldValue" name="description" placeholder="Описание" component={DescriptionField}/>
                    </span>
                </div>
                <Panel label="Родительский узел">
                  <DepartmentParentField departments={props.departments}/>
                </Panel>
            </Container>
          </Container>
          <div style={{borderTop:"1px solid black", minHeight: "36px"}}>
            <FlatButton type="submit" label="Создать" />
          </div>
        </form>
        )
    }
}

let taskForm = reduxForm({
  form: "departmentInfoDialogForm",
  enableReinitialize: true
})(DepartmentInfoComponent);

const selector = formValueSelector('departmentInfoDialogForm');
taskForm = connect(
  state => {
    if(state.Admin.department) {
        return   {
          initialValues: {parent: state.Admin.department.value}
        }
    } else {
      return ({});
    }
  }
)(taskForm);

export default taskForm;