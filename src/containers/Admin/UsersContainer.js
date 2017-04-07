import UsersList from "../../components/Admin/UsersList";
import {
    setClientHeight,
    toggleRightPanel
} from "../../redux/actions/layoutActions";
import {
    activateTask
} from "../../redux/actions/tasksActions";
  import {
    loadUser,
    setUser,
    setUsersPage,
    getUsers
  } from "../../redux/actions/Admin/usersActions";

import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.Admin.users,
        clientHeight: state.clientHeight,
        activeIndexes: state.activeIndexes,
        rightPanelStatus: state.rightPanelStatus,
        pageNumber: state.Admin.usersPage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setClientHeight: (height) => {
        dispatch(setClientHeight({height}));
      },
      loadUser: (user) => {
        dispatch(activateTask({
           globalIndex: user.globalIndex,
           taskId: user.id
        }));
        dispatch(loadUser(user));
      },
      handleAddNewUser: () => {
          dispatch(setUser({
              user: {
                  type: "new"
              }
          }));
          dispatch(toggleRightPanel({
              status: 1
          }));
      },
      prevPage: (page) => {
        if(page > 0) {
          dispatch(setUsersPage({page:(page-1)}));
          dispatch(getUsers());
        }
      },
      nextPage: (page) => {
        if(true) {
          dispatch(setUsersPage({page:(page+1)}));
          dispatch(getUsers());
        }
      }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersList)

export default Visible;
