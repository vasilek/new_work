import LeftReportsPanel from "../../components/Reports/LeftReportsPanel";
import { connect } from 'react-redux';
import {
getUserTasks,
createTasksReport,
createFinanceReport,
createUserReport,
deleteTableData
} from "../../redux/actions/reportsActions";
import {changeWeek, setCurrentWeek, setCurrentDay, loadTableData} from "../../redux/actions/tableActions";


const mapStateToProps = (state,ownProps) => {
  return {
    finances: state.finances,
    currentTasks: state.Reports.reportTasks,
    currentWeek: state.Table.currentWeek
  }
}


function getNextMonth(now) {
  if (now.getMonth() == 11) {
      var current = new Date(now.getFullYear() + 1, 0, 13);
  } else {
      var current = new Date(now.getFullYear(), now.getMonth() + 1, 13);
  }
  return current;
}

function getPrevMonth(now) {
  if (now.getMonth() == 0) {
      var current = new Date(now.getFullYear() - 1, 11, 13);
  } else {
      var current = new Date(now.getFullYear(), now.getMonth() - 1, 13);
  }
  return current;
}


const mapDispatchToProps = (dispatch) => {
  return {
    getTasksForUsers: (user_ids) => {
      dispatch(getUserTasks(user_ids));
    },
    createTaskReport: (state) => {
      let obj = {};
      obj.user_ids = state.user_ids;
      obj.task_ids = state.task_ids;
      dispatch(createTasksReport(obj));
    },
    createFinanceReport: (state) => {
      let obj = {};
      obj.user_ids = state.user_ids;
      obj.finance_ids = state.finance_ids;
      dispatch(createFinanceReport(obj));
    },
    createUserReport: (state) => {
      let obj = {};
      obj.user_ids = state.user_ids;
      dispatch(createUserReport(obj));
    },
    onDateSelect: (day) => {
      dispatch(setCurrentWeek({day: day}));
      dispatch(deleteTableData());
    },
    onDateMonthSelect: (day) => {
      const current = new Date(day.toDate().getFullYear(),  day.toDate().getMonth(), 13);
      dispatch(setCurrentWeek({day: current}));
      dispatch(deleteTableData());
    },
    handlePrevMonth: (weekStart) => {
      const prev = new Date(getPrevMonth(weekStart));
      dispatch(setCurrentWeek({day: prev}));
      dispatch(deleteTableData());
    },
    handlePrevWeek: (weekStart) => {
      const prev = new Date(weekStart.getTime() - 2 * 24 * 60 * 60 * 1000);
      dispatch(setCurrentWeek({day: prev}));
      dispatch(deleteTableData());
    },
    handleNextWeek: (weekStart) => {
      const next = new Date(weekStart.getTime() + 9 * 24 * 60 * 60 * 1000);
      dispatch(setCurrentWeek({day: next}));
      dispatch(deleteTableData());
    },
    handleNextMonth: (weekStart) => {
      const next = new Date(getNextMonth(weekStart));
      dispatch(setCurrentWeek({day: next}));
      dispatch(deleteTableData());
    },
    radioChanged: () => {
      dispatch(deleteTableData());
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftReportsPanel)

export default Visible;