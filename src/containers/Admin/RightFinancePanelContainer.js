/**
 * Created by vasil_000 on 18.05.2017.
 */
import RightFinancePanel from "../../components/Admin/RightFinancePanel";
import { connect } from 'react-redux';
// import {
//     editDepartment,
//     createDepartment
// } from "../../redux/actions/Admin/departmentActions";
// import {
//     toggleRightPanel,
//     setClientHeight
// } from "../../redux/actions/layoutActions";
// import DepartmentToSend from "../../Entities/Admin/DepartmentToSend";

const mapStateToProps = (state,ownProps) => {
    return {
        // department: state.Admin.department
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // handleDepartmentEditSubmit: (json) => {
        //     let dep = new DepartmentToSend(json);
        //     dispatch(editDepartment(dep, json));
        // },
        // handleDepartmentNewSubmit: (json) => {
        //     let dep = new DepartmentToSend(json);
        //     dispatch(createDepartment(dep, json));
        // },
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(RightFinancePanel)

export default Visible;