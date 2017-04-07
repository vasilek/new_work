import NewUserInfo from "../../components/Admin/NewUserInfo";
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
)(NewUserInfo)

export default Visible;