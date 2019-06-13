import * as actions from './actionTypes';


export const userPopUp = (userPopUp) => {
    return {
        type: actions.USER_POP_UP,
        userPopUp: !userPopUp
    }
}