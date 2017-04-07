import RightDepartmentPanel from "../../components/Admin/RightDepartmentPanel";
import { connect } from 'react-redux';
import {
  editDepartment,
  createDepartment
} from "../../redux/actions/Admin/departmentActions";
import {
    toggleRightPanel,
    setClientHeight
} from "../../redux/actions/layoutActions";
import DepartmentToSend from "../../Entities/Admin/DepartmentToSend";

const mapStateToProps = (state,ownProps) => {
  return {
    department: state.Admin.department
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleDepartmentEditSubmit: (json) => {
        let dep = new DepartmentToSend(json);
        dispatch(editDepartment(dep, json));
    },
    handleDepartmentNewSubmit: (json) => {
        let dep = new DepartmentToSend(json);
        dispatch(createDepartment(dep, json));
    },
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightDepartmentPanel)

export default Visible;