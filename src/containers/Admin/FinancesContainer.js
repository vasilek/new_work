import FinancesList from "../../components/Admin/FinancesList";
import {
    setClientHeight
} from "../../redux/actions/layoutActions";
import {
    activateTask
} from "../../redux/actions/tasksActions";
  import {
    editFinance,
    createFinance,
    setFinancesPage,
    loadFinancesTable,
    deleteFinance
  } from "../../redux/actions/Admin/financesActions";

import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        finances: state.Admin.financesTable,
        clientHeight: state.clientHeight,
        activeIndexes: state.activeIndexes,
        pageNumber: state.Admin.financesPage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setClientHeight: (height) => {
        dispatch(setClientHeight({height}));
      },
      editFinance: (code)  => {
        dispatch(editFinance(code));
      },
      deleteFinance: (finance_id) => {
        dispatch(deleteFinance({id: finance_id}));
      },
      createFinance: (code) => {
        dispatch(createFinance(code));
      },
      activateFinance: (finance) => {
        dispatch(activateTask({
           globalIndex: finance.globalIndex,
           taskId: finance.id
        }));
      },
      prevPage: (page) => {
        if(page > 0) {
          dispatch(setFinancesPage({page:(page-1)}));
          dispatch(loadFinancesTable());
        }
      },
      nextPage: (page) => {
        if(true) {
          dispatch(setFinancesPage({page:(page+1)}));
          dispatch(loadFinancesTable());
        }
      }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(FinancesList)

export default Visible;
