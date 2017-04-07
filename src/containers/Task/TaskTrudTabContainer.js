import TaskTrudTab from "../../components/Tasks/TaskTrudTab";
import { connect } from 'react-redux';
import {openLaborComment, loadLabor,editLabor, acceptTiming, declineTiming} from "../../redux/actions/tasksActions";
import LaborToSend from "../../Entities/Tasks/LaborToSend";

const mapStateToProps = (state,ownProps) => {
  return {
    groups: state.groupedLabors,
    groupsTable:  state.groupedTableLabors,
    type: ownProps.type
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openComments: (id) => {
      dispatch(openLaborComment({id}));
    },
    openTrud: (labor) => {
      dispatch(loadLabor(labor));
    },
    acceptTrud: (trud) => {
      dispatch(acceptTiming(trud));
    },
    declineTrud: (trud, comment) => {
      dispatch(declineTiming(trud, null, comment));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTrudTab);

export default Visible;