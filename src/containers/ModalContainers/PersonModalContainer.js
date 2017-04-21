/**
 * Created by vasil_000 on 06.04.2017.
 */
import PersonModal from "../../components/Modals/PersonModal";
import {
    connect
} from 'react-redux';
import {
    toggleTaskOpen,
    activateTask
} from "../../redux/actions/tasksActions";


const mapStateToProps = (state, ownProps) => {
    return {
        departments: state.Admin.departments,
        users: state.Admin.users,
        activeIndexes: state.activeIndexes,
        openedTasks: state.openedTasks,
        isModalOpen: ownProps.isModalOpen,
        isModalOpen1: ownProps.isModalOpen1,
        closeModal: ownProps.closeModal,
        closeModal1: ownProps.closeModal1,
        peopleTree: state.User.peopleTree,
        // clientHeight: state.clientHeight,
        user: state.User.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleTaskOpen: (dep) => {
            dispatch(toggleTaskOpen({
                globalIndex: dep.globalIndex
            }));
        },
    }
}
const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonModal)

export default Visible
