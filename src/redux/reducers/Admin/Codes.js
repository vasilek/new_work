import {
  SET_CODES_PAGE,
  SET_CODES_TABLE
} from "../../actions/Admin/codesActions";;


export function setCodesPage(state = 0, action) {
  switch (action.type) {
    case SET_CODES_PAGE:
      return action.page;
    default:
      return state;
  }
}

export function setCodesTable(state = [], action) {
    switch (action.type) {
    case SET_CODES_TABLE:
        return action.codes;
    default:
        return state;
    }
}
