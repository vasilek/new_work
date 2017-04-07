import RightTaskPanel from "../../components/Tasks/RightTaskPanel";
import { connect } from 'react-redux';
import {
    loadTask,
    activateTask,
    toggleTaskOpen,
    setTaskView,
    createTask,
    editTask,
    editLabor,
    setFilters,
    loadTasks
} from "../../redux/actions/tasksActions";
import {
    toggleRightPanel,
    setClientHeight
} from "../../redux/actions/layoutActions";
import LaborToSend from "../../Entities/Tasks/LaborToSend";
import TaskToSend from "../../Entities/Tasks/TaskToSend";

const mapStateToProps = (state,ownProps) => {
  return {
    taskView: state.taskView,
    laborView: state.laborView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleNewTaskSubmit: (json) => {
        let task = TaskToSend(json);
        dispatch(createTask(task));
    },
    handleEditTaskSubmit: (json) => {
        let task = TaskToSend(json);
        dispatch(editTask(task, json));
    },
    handleEditLaborSubmit: (json) => {
      const labor = LaborToSend(json);
      if(json.author_val) {
          labor.author_id = json.author_val.value;
      }
      labor.status = 0;
      dispatch(editLabor(labor, true));
    },
    handleAddNewTask: () => {
        dispatch(setTaskView({
            task: {
                type: "new"
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
)(RightTaskPanel)

export default Visible;