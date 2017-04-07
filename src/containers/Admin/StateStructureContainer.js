import StateStructure from "../../components/Admin/StateStructure";
import {
    toggleRightPanel,
    setClientHeight
} from "../../redux/actions/layoutActions";
import {
    toggleTaskOpen,
    activateTask
} from "../../redux/actions/tasksActions";
import { connect } from 'react-redux';
import {
    loadDepartment,
    setDepartment
} from "../../redux/actions/Admin/departmentActions";


const mapStateToProps = (state,ownProps) => {
  return {
    departments: state.Admin.departments,
    clientHeight: state.clientHeight,
    activeIndexes: state.activeIndexes,
    openedTasks: state.openedTasks,
    rightPanelStatus: state.rightPanelStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadDepartment: (dep) => {
      dispatch(activateTask({
         globalIndex: dep.globalIndex,
         taskId: dep.id
      }));
      dispatch(loadDepartment(dep));
    },
    toggleTaskOpen: (dep) => {
      dispatch(toggleTaskOpen({
          globalIndex: dep.globalIndex
      }));
    },
    setClientHeight: (height) => {
      dispatch(setClientHeight({height}));
    },
    handleAddNewDepartment: (parent_id) => {
        dispatch(setDepartment({
            department: {
                type: "new",
                value: parent_id
            }
        }));
        dispatch(toggleRightPanel({
            status: 1
        }));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(StateStructure)

export default Visible;