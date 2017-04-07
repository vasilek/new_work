import UserInfo from "../../components/Admin/UserInfo";
import {
    connect
} from 'react-redux';
import {
  deleteUser,
  setPassword
} from "../../redux/actions/Admin/usersActions";
import {
    toggleRightPanel
} from "../../redux/actions/layoutActions";

const mapStateToProps = (state, ownProps) => {
    return {
        user: ownProps.user,
        departments: state.Admin.flatDepartments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => {

        },
        deleteUser: (user) => {
          dispatch(deleteUser(user));
          dispatch(toggleRightPanel({
            status: 0
          }));
        },
        setPassword: (obj) => {
          dispatch(setPassword(obj));
        }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserInfo)

export default Visible;
