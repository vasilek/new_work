import React from "react";
import Container from "../Container";
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {debounce} from "../../helperFunctions";
import Icon from "../../Icons/Icon";
import {StandardField, Panel, DepartmentField} from "../formComponents/ReusableComponents";
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

const UserInfoComponent = class UserInfo extends React.Component {
    render() {
        const props = this.props;
        const user = props.user;
        const {handleSubmit} = props;

        return (
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Container vertical={true}>
                    <div className="infoHeader" flex="1">

                    </div>
                    <Container vertical={true} flex="11" height="auto"
                               containerStyle={{overflowY: "auto", overflowX: 'hidden', paddingTop: "25px"}}>
                        <Panel label="ФИО">
                            <Field name="name" component={StandardField} placeholder="ФИО пользователя"/>
                        </Panel>
                        <Panel label="Логин в Active Directory">
                            <Field name="login" component={StandardField} placeholder="Логин в Active Directory"/>
                        </Panel>
                        <Panel label="AD логин">
                            <Field name="ldap_login" component={StandardField} placeholder="AD логин"/>
                        </Panel>
                        <Panel label="Отделение штатной структуры">
                            <DepartmentField departments={props.departments}/>
                        </Panel>
                        <Panel label="Должность">
                            <Field name="position" component={StandardField} placeholder="Должность"/>
                        </Panel>
                        <Panel label="Табельный номер">
                            <Field name="number" component={StandardField} placeholder="Табельный номер"/>
                        </Panel>
                        <Panel>
                            <label htmlFor="employed">Руководитель</label>
                            <div>
                                <Field name="is_chief" id="employed" component="input" type="checkbox"
                                       className="form-checkbox"/>
                            </div>
                        </Panel>
                        <Panel>
                            <label htmlFor="employed">Администратор</label>
                            <div>
                                <Field name="is_admin" id="employed" component="input" type="checkbox"
                                       className="form-checkbox"/>
                            </div>
                        </Panel>
                        <Panel>
                            <label htmlFor="employed">Заблокирован</label>
                            <div>
                                <Field name="is_banned" id="employed" component="input" type="checkbox"
                                       className="form-checkbox"/>
                            </div>
                        </Panel>
                    </Container>
                </Container>
                <div style={{borderTop: "1px solid black", minHeight: "36px"}}>
                    <FlatButton type="submit" label="Создать"/>
                </div>
            </form>
        )

    }
}

let taskForm = reduxForm({
    form: "userInfoDialogForm",
    enableReinitialize: true
})(UserInfoComponent);

const selector = formValueSelector('userInfoDialogForm');
taskForm = connect(
    state => {
        return ({})
    }
)(taskForm);

export default taskForm;