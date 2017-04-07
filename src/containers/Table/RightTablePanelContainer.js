import RightTablePanel from "../../components/Table/RightTablePanel";
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
    handleEditLaborSubmit: (json) => {
      const labor = LaborToSend(json);
      if(json.author_val) {
          labor.author_id = json.author_val.value;
      }
      labor.status = 0;
      dispatch(editLabor(labor,true, true));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightTablePanel)

export default Visible;