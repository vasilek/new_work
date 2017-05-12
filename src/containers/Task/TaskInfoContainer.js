import TaskInfo from "../../components/Tasks/TaskInfo";
import TaskToSend from "../../Entities/Tasks/TaskToSend";
import {
    connect
} from 'react-redux';
import {
    setActiveTaskTab,
    openDescription,
    setAddingTrudTask,
    createLabor,
    createComment,
    setTaskView,
    acceptTask,
    declineTask,
    completeTask,
    createTask,
    deleteTask,
    reopenTask
} from "../../redux/actions/tasksActions";
import {
    openTrudModal,
    closeTrudModal,
    toggleRightPanel
} from "../../redux/actions/layoutActions";
import {
    getUsers
} from "../../redux/actions/Admin/usersActions";
import {
    loadDepartment,
    setDepartment, loadDepTree, loadFlatDepartments
} from "../../redux/actions/Admin/departmentActions";
import {loadPeopleTree} from "../../redux/actions/subordinateActions";

const mapStateToProps = (state, ownProps) => {
    return {
        // finances_1: state.Admin.financesTable,
        task: ownProps.task,
        trudTask: state.currentAddingTrudTask,
        activeTab: state.activeTaskTab,
        isTrudModalOpen: state.isTrudModalOpen,
        codes: state.codes,
        finances: state.finances,
        executors: state.User.subordinates
        // executors: ownProps.task.executors,
        // rawExecutors: ownProps.task.executors
    }
}
import LaborToSend from "../../Entities/Tasks/LaborToSend";

const mapDispatchToProps = (dispatch) => {
    return {
        chooseCurrentTaskTab: (tab) => {
            dispatch(setActiveTaskTab({
                value: tab
            }));
        },
        openDescription: (task) => {
            dispatch(openDescription({
                task: task
            }));
        },
        openTrudModal: (task) => {
            dispatch(openTrudModal());
            dispatch(setAddingTrudTask({
                task
            }))
        },
        handleTrudSubmit: (task, json) => {
            let labor = LaborToSend(json);
            if(json.author_val) {
                labor.author_id = json.author_val.value;
            }
            labor.task_id = task.id;
            dispatch(createLabor(labor, task));
        },
        handleAddNewSubTask: (task) => {
          dispatch(setTaskView({
              task: {
                  type: "new"
              },
              parent_id: task.id,
              parent_task: task
          }));
          dispatch(toggleRightPanel({
              status: 1
          }));
        },
        closeModal: () => {
            dispatch(closeTrudModal({}));
        },
        sendComment: (task, comment) => {
          let obj = {};
          obj.comment = comment;
          obj.task_id = task.id;
          dispatch(createComment(obj,task));
        },
        deleteTask: (data) => {
          dispatch(deleteTask(data));
          dispatch(toggleRightPanel({
              status: 0
          }));
        },
        acceptTask:(task)=> {
          dispatch(acceptTask(task));
        },
        reopenTask:(task) => {
          dispatch(reopenTask(task));
        },
        declineTask:(task) => {
          dispatch(declineTask(task));
        },
        completeTask:(task) => {
          dispatch(completeTask(task));
        },
        copyTask: (task) => {
          let json = TaskToSend(task);
          dispatch(createTask(json));
        },
        getUsers: function () {
            dispatch(getUsers());
        },

        loadDepTree: () =>
        {
            dispatch(loadDepTree());
        },
        loadPeopleTree: () =>
        {
            dispatch(loadPeopleTree());
        }

    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskInfo)

export default Visible;
