import SubordinatesList from "../components/Subordinates/SubordinatesList";
import {
    toggleTaskOpen,
    activateTask
} from "../redux/actions/tasksActions";
import {
    setClientHeight
} from "../redux/actions/layoutActions";
import { connect } from 'react-redux';
import {reset} from 'redux-form';

const mapStateToProps = (state,ownProps) => {
  return {
    peopleTree: state.User.peopleTree,
    activeIndexes: state.activeIndexes,
    openedTasks: state.openedTasks,
    clientHeight: state.clientHeight,
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
    setClientHeight: (height) => {
      dispatch(setClientHeight({height}));
    }
  }
}



const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubordinatesList)

export default Visible