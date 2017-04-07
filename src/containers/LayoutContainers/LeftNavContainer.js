import LeftNav from "../../components/LeftNav";
import { connect } from 'react-redux';
import {toggleToolbar} from "../../redux/actions/layoutActions";

const mapStateToProps = (state,ownProps) => {
  return {
    showNav: state.showNav,
    children: ownProps.children
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleHide: ()=> {
      dispatch(toggleToolbar({status: false}));
    }
  }
}


const VisibleLeftNav = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftNav)

export default VisibleLeftNav