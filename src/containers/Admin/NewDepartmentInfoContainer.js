import NewDepartmentInfo from "../../components/Admin/NewDepartmentInfo";
import { connect } from 'react-redux';

const mapStateToProps = (state,ownProps) => {
  return {
    user: ownProps.user,
    departments: state.Admin.flatDepartments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDepartmentInfo)

export default Visible;