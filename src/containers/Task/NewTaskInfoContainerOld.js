import NewTaskInfo from "../../components/Tasks/NewTaskInfo";
import { connect } from 'react-redux';
import {
    getUsers
} from "../../redux/actions/Admin/usersActions";
import {
    loadDepartment,
    setDepartment, loadDepTree, loadFlatDepartments
} from "../../redux/actions/Admin/departmentActions";

const mapStateToProps = (state,ownProps) => {
  return {
      flatDepartments: state.Admin.flatDepartments,
      departments: state.Admin.departments,
    codes: state.codes,
    finances: state.finances,
    executors: state.User.subordinates
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: function () {
          dispatch(getUsers());
      },

      loadDepTree: () =>
      {
          dispatch(loadDepTree());
      },

      loadFlatDepartments: () =>
      {
          dispatch(loadFlatDepartments());
      }
  }
}



const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTaskInfo)

export default Visible;