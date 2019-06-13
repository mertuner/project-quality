import * as actionTypes from '../actions/actionTypes';

const initialState = {
    userId: null,
    error: null,
    loading: false,
    email: null,
    displayName: null,
    photoURL: null,
    isSignUp: false,
};



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return {
                ...state,
                error: null,
                loading: true
            }
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                userId: action.userId,
                loading: false,
                error: null,
                email: action.email,
                displayName: action.displayName,
                photoURL: action.photoURL
            }
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                userId: action.userId,
                email: action.email,
                displayName: action.displayName,
                photoURL: action.photoURL
            }
        case actionTypes.AUTH_ON_PAGE_LOAD:
            return {
                ...state,
                userId: action.userId,
                email: action.email,
                displayName: action.displayName,
                photoURL: action.photoURL
            }
        case actionTypes.AUTH_SWITCH:
            return {
                ...state,
                isSignUp: action.isSignUp
            }
        case actionTypes.AUTH_DETAILS:
            return{
                ...state,
                displayName: action.displayName,
                photoURL: action.photoURL
            }
        case actionTypes.AUTH_ACCOUNT_DELETED:
            return{
                ...state,
                userId: null,
                error: null,
                loading: false,
                email: null,
                displayName: null,
                photoURL: null,
                isSignUp: false,
            }
        default:
            return state;
    }
};

export default reducer;