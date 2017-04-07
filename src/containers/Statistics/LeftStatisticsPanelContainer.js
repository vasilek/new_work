import LeftStatisticsPanel from "../../components/Statistics/LeftStatisticsPanel";
import { connect } from 'react-redux';
import {
loadPie,
loadHisto,
setWeekPeriod,
loadNormatives
} from "../../redux/actions/statisticsActions";
import {
  getUserTasks,
  deleteTableData
  } from "../../redux/actions/reportsActions";
import {changeWeek, setCurrentWeek, setCurrentDay, loadTableData} from "../../redux/actions/tableActions";


const mapStateToProps = (state,ownProps) => {
  return {
    codes: state.codes,
    currentTasks: state.Reports.reportTasks,
    currentWeek: state.Table.currentWeek,
    period: state.Statistics.period,
    weekPeriod: state.Statistics.weekPeriod
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
    onDateSelect: (day) => {
      dispatch(setCurrentWeek({day: day}));
      dispatch(deleteTableData());
    },
    getTasksForUsers: (user_ids) => {
      dispatch(getUserTasks(user_ids));
    },
    loadPie: (state) => {
      let obj = {};
      if(state.type === 1) {
        obj.user_ids = state.user_ids;
        obj.task_ids = state.task_ids;
        obj.type = state.type;
      } else {
        obj.user_ids = state.user_ids;
        obj.code_ids = state.code_ids;
        obj.type = state.type;
      }
      dispatch(loadPie(obj));
    },
    loadNormatives: (state) => {
      let obj = {};
      obj.user_ids = state.user_ids;
      obj.task_ids = state.task_ids;
      obj.type = state.type;
      dispatch(loadNormatives(obj));
    },
    loadHisto: (state) => {
      let obj = {};
      if(state.type === 1) {
        obj.user_ids = state.user_ids;
        obj.task_ids = state.task_ids;
        obj.type = state.type;
      } else {
        obj.user_ids = state.user_ids;
        obj.code_ids = state.code_ids;
        obj.type = state.type;
      }
      dispatch(loadHisto(obj));
    },
    changeFirstWeek: (date)=> {
      dispatch(setWeekPeriod({first: date}));
    },
    changeLastWeek: (date) => {
      dispatch(setWeekPeriod({last: date}));
    },
    radioChanged: () => {
      dispatch(deleteTableData());
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftStatisticsPanel)

export default Visible;