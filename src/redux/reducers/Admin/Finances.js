import {
    SET_FINANCES_PAGE,
    SET_FINANCES_TABLE,
    SET_FINANCES_TREE
} from "../../actions/Admin/financesActions";
;
import {normalizeTree} from "../../../Entities/Admin/FinancesTree";


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

export function setFinancesTree(state = [], action) {
    switch (action.type) {
        case SET_FINANCES_TREE:
            let fins = {
                byId: {},
                byGlobalId: {}
            };
            let newTasks = {};
            newTasks.tree = JSON.parse(JSON.stringify(action.tree));
            normalizeTree(newTasks.tree, 0, 0, fins);
            newTasks.treeNormalized = fins;
            return newTasks;
        default:
            return state;
    }
}