import {
  SET_FINANCES_PAGE,
  SET_FINANCES_TABLE
} from "../../actions/Admin/financesActions";;


export function setFinancesPage(state = 0, action) {
  switch (action.type) {
    case SET_FINANCES_PAGE:
      return action.page;
    default:
      return state;
  }
}

export function setFinancesTable(state = [], action) {
    switch (action.type) {
    case SET_FINANCES_TABLE:
        return action.finances;
    default:
        return state;
    }
}