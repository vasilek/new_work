import RightReportsPanel from "../../components/Reports/RightReportsPanel";
import { connect } from 'react-redux';
import {
    loadUser
} from "../../redux/actions/Admin/usersActions";
import {
    loadDepartment,
    setDepartment, loadDepTree, loadFlatDepartments
} from "../../redux/actions/Admin/departmentActions";


const mapStateToProps = (state,ownProps) => {
  return {
    reportsTable: state.Reports.reportsTableData,
    currentWeek: state.Table.currentWeek,
      name: state.User.user.name,
      position: state.User.user.position,
      Y: state.User,
      departments: state.Admin.departments,
      dep: state.Admin.department
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      hmm: () => "mm",
      loadUser: (user) =>
          dispatch(loadUser(user)),
      loadDepTree: () =>
      {
          dispatch(loadDepTree());
      },
      loadDepartment: (department) =>
      {
          dispatch(loadDepartment(department));
      }

  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightReportsPanel)

export default Visible;