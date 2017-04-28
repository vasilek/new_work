import {
    SET_USER,
    SET_SUBORDINATES,
    SET_PINGED_USER,
    SET_USER_TYPE
} from "../actions/userActions";

export function setSubordinates(state = [], action) {
    switch (action.type) {
    case SET_SUBORDINATES:
        return action.subordinates
    default:
        return state;
    }
}

export function setPingedUser(state = "none", action) {
  switch (action.type) {
    case SET_PINGED_USER:
      return action.id;
    default:
      return state;
  }
}

export function setUserType(state = 0, action) {
  switch (action.type) {
    case SET_USER_TYPE:
      return action.userType;
    default:
      return state;
  }
}

export function userSet(state = {
    name: 'None',
    position: 'Никто',
    id: -1,
    department: ''
}, action) {

    switch (action.type) {
    case SET_USER:
        return {
            name: action.user.name,
            position: action.user.position,
            id: action.user.id,
            department: action.user.department
        };
    default:
        return state;
    }
}
