import Calendar from "../../components/Admin/Calendar";
import {
  setDay,
  loadCalendar
} from "../../redux/actions/Admin/calendarActions";
import { connect } from 'react-redux';

const mapStateToProps = (state,ownProps) => {
  return {
    calendar: state.Admin.calendar
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setDay:(day, status) => {
      dispatch(setDay(day, status));
    },
    loadYear:(year) => {
      dispatch(loadCalendar(year));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar)

export default Visible;