import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "../actionHelper.js";
import {
    reset
} from 'redux-form';
import {loadFinances} from "../tasksActions";

export const SET_FINANCES_PAGE = "SET_FINANCES_PAGE";
export const SET_FINANCES_TABLE = "SET_FINANCES_TABLE";
export const SET_FINANCES_TREE = "SET_FINANCES_TREE";

export const setFinancesTable = generateActionFunc(SET_FINANCES_TABLE);
export const setFinancesPage = generateActionFunc(SET_FINANCES_PAGE);
export const setFinancesTree = generateActionFunc(SET_FINANCES_TREE);

export function editFinance(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadFinancesTable());
  }
  data.value = data.label;
  return fetchPost(`/edit/finance`, data, handler);
}

export function createFinance(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadFinancesTable());
  }
  data.value = data.label;
  return fetchPost(`/create/finance`, data, handler);
}

export function deleteFinance(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadFinancesTable());
  }
  return fetchAsync(`/delete/finance?id=${data.id}`, handler);
}

const limit = 30;

import {FinancesTree} from  "../../../Entities/Admin/Finances";
import {FinancesTree_} from  "../../../Entities/Admin/FinancesTree";
import Finance from  "../../../Entities/Admin/Finance";

export function loadFinancesTable() {
  return (dispatch, getState) => {
    const page = getState().Admin.financesPage;
    const currentOffset = page*limit;
    const handler = (json, dispatch, getState) => {
        console.log("json!",json)
      let finances = new FinancesTree(json.data.finances);
      dispatch(setFinancesTable({
          finances
      }));
    }
    const query = getState().searchQuery;
    let q = "";
    if(query !== "") {
      q = "&query="+encodeURIComponent(query);
    }
    dispatch(fetchAsync(`/all/finances?limit=${limit}&offset=${currentOffset}`+q,handler));
  }
}

export function loadFinancesTree() {
    return (dispatch, getState) => {
        // const page = getState().Admin.financesPage;
        // const currentOffset = page*limit;
        const handler = (json, dispatch, getState) => {
            console.log("json", json);
            let finances = new FinancesTree_(json.data.tree);
            dispatch(setFinancesTree({
                finances
            }));
        }
        const query = getState().searchQuery;
        let q = "";
        if(query !== "") {
            q = "&query="+encodeURIComponent(query);
        }
        // dispatch(fetchAsync(`/all/finances?limit=${limit}&offset=${currentOffset}`+q,handler));
        dispatch(fetchAsync(`/data/fintree`+q,handler));
    }
}
