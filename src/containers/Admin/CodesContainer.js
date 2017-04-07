import CodesList from "../../components/Admin/CodesList";
import {
    setClientHeight
} from "../../redux/actions/layoutActions";
import {
    activateTask
} from "../../redux/actions/tasksActions";
  import {
    editCode,
    createCode,
    setCodesPage,
    loadCodes,
    deleteCode
  } from "../../redux/actions/Admin/codesActions";

import {
    connect
} from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        codes: state.Admin.codesTable,
        clientHeight: state.clientHeight,
        activeIndexes: state.activeIndexes,
        pageNumber: state.Admin.codesPage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setClientHeight: (height) => {
        dispatch(setClientHeight({height}));
      },
      editCode: (code)  => {
        dispatch(editCode(code));
      },
      createCode: (code) => {
        dispatch(createCode(code));
      },
      activateCode: (code) => {
        dispatch(activateTask({
           globalIndex: code.globalIndex,
           taskId: code.id
        }));
      },
      deleteCode: (code_id) => {
        dispatch(deleteCode({id: code_id}));
      },
      prevPage: (page) => {
        if(page > 0) {
          dispatch(setCodesPage({page:(page-1)}));
          dispatch(loadCodes());
        }
      },
      nextPage: (page) => {
        if(true) {
          dispatch(setCodesPage({page:(page+1)}));
          dispatch(loadCodes());
        }
      }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(CodesList)

export default Visible;
