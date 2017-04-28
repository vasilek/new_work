import Toolbar from "../../components/Toolbar";
import { connect } from 'react-redux';
import {toggleToolbar} from "../../redux/actions/layoutActions";

const mapStateToProps = (state) => {
  return {
    name: state.User.user.name,
    position: state.User.user.position,
      department: state.User.user.department
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: ()=> {
      dispatch(toggleToolbar());
    }
  }
}

const VisibleToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar)

export default VisibleToolbar