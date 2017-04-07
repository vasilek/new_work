import RightPanel  from "../../components/RightPanel";
import { connect } from 'react-redux';
import {toggleRightPanel} from "../../redux/actions/layoutActions";

const mapStateToProps = (state,ownProps) => {
  return {
    onClose: () => {
      if(ownProps.onClose) {
        ownProps.onClose();
      }
    }
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    closePanel: () => {

      dispatch(toggleRightPanel({status: 0}))
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightPanel)

export default Visible