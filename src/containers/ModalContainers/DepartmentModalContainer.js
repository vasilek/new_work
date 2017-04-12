/**
 * Created by vasil_000 on 10.04.2017.
 */
import DepartmentModal from "../../components/Modals/DepartmentModal";
import {
    connect
} from 'react-redux';
import {
    loadDepartment,
    setDepartment, loadDepTree
} from "../../redux/actions/Admin/departmentActions";

// import StateStructure from "../../components/Admin/StateStructure";
import {
    toggleRightPanel,
    setClientHeight
} from "../../redux/actions/layoutActions";
import {
    toggleTaskOpen,
    activateTask
} from "../../redux/actions/tasksActions";
// import { connect } from 'react-redux';
// import {
//     loadDepartment,
//     setDepartment
// } from "../../redux/actions/Admin/departmentActions";


const mapStateToProps = (state, ownProps) => {
    return {
        flatDepartments: state.Admin.flatDepartments,
        isModalOpen: ownProps.isModalOpen,
        closeModal: ownProps.closeModal,
        clientHeight: state.clientHeight,
        activeIndexes: state.activeIndexes,
        openedTasks: state.openedTasks,
        rightPanelStatus: state.rightPanelStatus,
        departments: state.Admin.departments,
        users: state.Admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      loadDepTree: () =>{
          dispatch(loadDepTree());},

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
)(DepartmentModal)

export default Visible
