import {
    generateActionFunc,
    fetchAsync,
    fetchPost
} from "../actionHelper.js";
import {
    reset
} from 'redux-form';
import {loadWorkCodes} from "../tasksActions";

export const SET_CODES_PAGE = "SET_CODES_PAGE";
export const SET_CODES_TABLE = "SET_CODES_TABLE";


export const setCodesPage = generateActionFunc(SET_CODES_PAGE);
export const setCodesTable = generateActionFunc(SET_CODES_TABLE);

export function editCode(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadCodes());
  }
  data.value = data.label;
  return fetchPost(`/edit/workcode`, data, handler);
}

export function createCode(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadCodes());
  }
  data.value = data.label;
  return fetchPost(`/create/workcode`, data, handler);
}

export function deleteCode(data) {
  const handler = (json,dispatch, getState) => {
      dispatch(loadCodes());
  }
  return fetchAsync(`/delete/workcode?id=${data.id}`, handler);
}


import {CodesTree} from  "../../../Entities/Admin/Codes";
import Code from  "../../../Entities/Admin/Code";


const limit = 30;

export function loadCodes() {
  return (dispatch, getState) => {
    const page = getState().Admin.codesPage;
    const currentOffset = page*limit;
    const handler = (json, dispatch, getState) => {
      let codes = new CodesTree(json.data.codes);
      dispatch(setCodesTable({
          codes
      }));
    }
    const query = getState().searchQuery;
    let q = "";
    if(query !== "") {
      q = "&query="+encodeURIComponent(query);
    }
    dispatch(fetchAsync(`/all/codes?limit=${limit}&offset=${currentOffset}`+q,handler));
  }
}
