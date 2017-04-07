import ReportsTable from "../../components/Reports/ReportsTable";
import { connect } from 'react-redux';

const mapStateToProps = (state,ownProps) => {
  return {
    hey: "lalaley"
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hmm: () => "mmm"
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsTable)

export default Visible