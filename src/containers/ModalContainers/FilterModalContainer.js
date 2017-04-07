import FilterModal from "../../components/Modals/FilterModal";
import {
      setFilters
} from "../../redux/actions/layoutActions";
import {
  loadTasks
} from "../../redux/actions/tasksActions";
import {loadTableData} from "../../redux/actions/tableActions";
import {
    connect
} from 'react-redux';


const mapStateToProps = (state, ownProps) => {
    return {
      filterValues: ownProps.filterValues,
      isModalOpen: ownProps.isModalOpen,
      closeModal: ownProps.closeModal,
      anchorEl: ownProps.anchorEl,
      handleTouchTap: ownProps.handleTouchTap,
      currentTaskFilters: state.currentTaskFilters,
      executors: state.User.subordinates,
      defaultFilters: state.defaultFilters,
      currentLocation: state.currentLocation,
      location: state.currentLocation
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      applyFilters:(filters, currentLocation) => {
        const filt = {sub_ids: filters.sub_ids, statuses: filters.statuses, all_subs: filters.all_subs};
        dispatch(setFilters({filters: filt}));
        if(~currentLocation.indexOf("tasks")) {
          dispatch(loadTableData());
          dispatch(loadTasks());
        }
      }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterModal)

export default Visible;
