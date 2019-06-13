import * as actions from '../actions/actionTypes';

const initialState = {
    userPopUp: false
}

const reducer = (state= initialState, action) => {
    switch (action.type) {
        case actions.USER_POP_UP:
            return {
                ...state,
                userPopUp: action.userPopUp
            }
        default:
            return state;
  }
    }


export default reducer;