import LaborInfo from "../components/Tasks/LaborInfo";
import {
    connect
} from 'react-redux';
import {
    closeLabor,
    loadTask,
    createComment,
    deleteTiming
  } from "../redux/actions/tasksActions";
import {editLabor, acceptTiming, declineTiming} from "../redux/actions/tasksActions";
import LaborToSend from "../Entities/Tasks/LaborToSend";

const mapStateToProps = (state, ownProps) => {
    return {
        labor: ownProps.labor,
        codes: state.codes,
        finances: state.finances
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendComment: (labor, comment) => {
          let obj = {};
          obj.comment = comment;
          obj.time_id = labor.id;
          dispatch(createComment(obj,{id: labor.task_id}, true));
        },
        acceptTrud: (trud) => {
          dispatch(acceptTiming(trud, true));
        },
        declineTrud: (trud,comment) => {
          dispatch(declineTiming(trud, true, comment));
        },
        deleteTrud: (trud) => {
          dispatch(deleteTiming(trud));
        },
        returnToTask: (trud) => {
          dispatch(closeLabor());
          dispatch(loadTask({id: trud.task_id}));
        }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(LaborInfo)

export default Visible;
