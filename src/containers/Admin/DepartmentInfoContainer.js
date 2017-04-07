import DepartmentInfo from "../../components/Admin/DepartmentInfo";
import {
  deleteDepartment
} from "../../redux/actions/Admin/departmentActions";
import {
    connect
} from 'react-redux';
import {
    toggleRightPanel
} from "../../redux/actions/layoutActions";

const mapStateToProps = (state, ownProps) => {
    return {
        department: ownProps.department,
        departments: state.Admin.flatDepartments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => {

        },
        deleteDepartment: (dep) => {
          dispatch(deleteDepartment(dep));
          dispatch(toggleRightPanel({
            status: 0
          }));
        }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(DepartmentInfo)

export default Visible;
