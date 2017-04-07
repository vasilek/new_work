import RightUserPanel from "../../components/Admin/RightUserPanel";
import { connect } from 'react-redux';
import {
editUser, createUser
} from "../../redux/actions/Admin/usersActions";


const mapStateToProps = (state,ownProps) => {
  return {
    user: state.Admin.userView
  }
}

import UserToSend from "../../Entities/Admin/UserToSend";

const mapDispatchToProps = (dispatch) => {
  return {
    handleEditUserSubmit: (json) => {
        let user = UserToSend(json);
        dispatch(editUser(user, json));
    },
    handleNewUserSubmit: (json) => {
        let user = UserToSend(json);
        dispatch(createUser(user, json));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightUserPanel)

export default Visible;