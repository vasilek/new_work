import SideBar from "../../components/SideBar";
import { connect } from 'react-redux';
import {setSearchQuery} from "../../redux/actions/layoutActions";
import {loadCodes} from "../../redux/actions/Admin/codesActions";
import {loadFinancesTable} from "../../redux/actions/Admin/financesActions"
import {loadDepTree} from "../../redux/actions/Admin/departmentActions";
import {getUsers} from "../../redux/actions/Admin/usersActions"
import { browserHistory } from 'react-router';

const mapStateToProps = (state,ownProps) => {
  return {
    menuItems: ownProps.children,
    showNav: state.showNav,
    location: state.currentLocation,
    searchQuery: state.searchQuery,
    userType: state.User.userType,
    query: state.query
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeSearchQuery: (query, location) => {
      dispatch(setSearchQuery({query}));
      if(location == "/admin/workCodes") {
        dispatch(loadCodes());
      } else if(location == "/admin/finances") {
        dispatch(loadFinancesTable());
      } else if(location == "/admin/users") {
        dispatch(getUsers());
      }
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar)

export default Visible;