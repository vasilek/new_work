import RightStatisticsPanel from "../../components/Statistics/RightStatisticsPanel";
import { connect } from 'react-redux';
import {
loadPie,
loadHisto,
setPeriod
} from "../../redux/actions/statisticsActions";

const mapStateToProps = (state,ownProps) => {
  return {
    pie: state.Statistics.pie,
    histo: state.Statistics.bar,
    currentWeek: state.Table.currentWeek,
    normatives: state.Statistics.normatives
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGlobalPeriod:(val) =>{
      dispatch(setPeriod({period: val}))
    },
    setPeriodType: (val, state) => {
      let obj = {};

      if(state.type == 1) {
        obj.user_ids = state.user_ids;
        obj.task_ids = state.task_ids;
        obj.period = val;
        obj.type = state.type;
        dispatch(loadHisto(obj));
      } else {
        obj.user_ids = state.user_ids;
        obj.code_ids = state.code_ids;
        obj.period = val;
        obj.type = state.type;
        dispatch(loadHisto(obj));
      }
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightStatisticsPanel)

export default Visible;