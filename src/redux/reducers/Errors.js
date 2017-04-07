import {
    SET_VALIDATION_ERRORS
} from "../actions/errorActions";

export function setValidationErrors(state = [], action) {
    switch (action.type) {
      case SET_VALIDATION_ERRORS:
          return action.errors
      default:
          return state;
    }
}
