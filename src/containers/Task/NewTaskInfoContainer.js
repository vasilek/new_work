import NewTaskInfo from "../../components/Tasks/NewTaskInfo";
import { connect } from 'react-redux';
import {
    getUsers
} from "../../redux/actions/Admin/usersActions";

const mapStateToProps = (state,ownProps) => {
  return {

    codes: state.codes,
    finances: state.finances,
    executors: state.User.subordinates
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: function () {
        dispatch(getUsers());
    }
  }
}



const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTaskInfo)

export default Visible;