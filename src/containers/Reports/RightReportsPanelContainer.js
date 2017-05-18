import RightReportsPanel from "../../components/Reports/RightReportsPanel";
import {connect} from 'react-redux';
import {
    loadUser
} from "../../redux/actions/Admin/usersActions";
import {
    loadDepartment,
    setDepartment, loadDepTree, loadFlatDepartments
} from "../../redux/actions/Admin/departmentActions";
import {
    toggleTaskOpen,
    activateTask
} from "../../redux/actions/tasksActions";
import {loadPeopleTree} from "../../redux/actions/subordinateActions";

const mapStateToProps = (state, ownProps) => {
    return {
        half: state.Table.half,
        reportsTable: state.Reports.reportsTableData,
        currentWeek: state.Table.currentWeek,
        chosenDays: state.Table.chosenDays,
        weekPeriod: state.Statistics.weekPeriod,
        name: state.User.user.name,
        position: state.User.user.position,
        Y: state.User,
        departments: state.Admin.departments,
        department: state.Admin.department,
        typeReport: state.Table.typeReport
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        hmm: () => "mm",
        loadUser: (user) =>
            dispatch(loadUser(user)),
        loadDepTree: () => {
            dispatch(loadDepTree());
        },
        loadDepartment: (dep) => {
            dispatch(activateTask({
                globalIndex: dep.globalIndex,
                taskId: dep.id
            }));
            dispatch(loadDepartment(dep));
        },
        loadPeopleTree: () => {
            dispatch(loadPeopleTree());
        }

    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(RightReportsPanel)

export default Visible;